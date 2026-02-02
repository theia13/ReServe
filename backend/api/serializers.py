from rest_framework import serializers
from .models import CustomUser, Donation, UserAddress, UserProfile
from rest_framework.authentication import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from django.core.validators import validate_email
from django.contrib.auth.password_validation import validate_password

from api.utils.address_lookup import get_location_by_area

    
class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserAddress
        fields = ['street_address', 'area', 'landmark', 'city', 'pin_code']

class CustomUserSerializer(serializers.ModelSerializer):
    address = AddressSerializer()

    class Meta:
        model = CustomUser
        fields = ['id', 'user_type', 'organization_name', 'contact_person','email', 'address', "password"  ]
        extra_kwargs = {'password': {'write_only':True}}


    def create(self, validated_data):
        password = validated_data.pop("password", None)
        address_data = validated_data.pop("address")

        user = CustomUser(**validated_data)

        if password:
            user.set_password(password)
        user.save()

        UserAddress.objects.create(user=user, **address_data)

        return user
    
    def update(self, instance, validated_data):
        password = validated_data.pop("password", None)
        if password:
            instance.set_password(password)

        address_data = validated_data.pop('address', None)
        if address_data:
            try:
                address_instance = instance.address
                address_serializer = AddressSerializer(
                    address_instance,
                    data=address_data,
                    partial=True
            )
                if address_serializer.is_valid():
                    address_serializer.save()
                else:
                    raise serializers.ValidationError(address_serializer.errors)
            except UserAddress.DoesNotExist:
                UserAddress.objects.create(user=instance, **address_data)
        

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        return instance
    
class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        email = data.get('email')
        password = data.get('password')
        user = authenticate(email=email, password=password)
    
        if not user:
            raise serializers.ValidationError("Invalid email or password")

        return {
            "user" : user
        }

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])
    confirm_password = serializers.CharField(write_only=True)  
    address = AddressSerializer()

    class Meta:
        model = CustomUser
        fields ="__all__"
        extra_kwargs = {'password': {'write_only': True}}

    def validate_email(self, value):
        if CustomUser.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists!")
        return value
    
    def validate(self, data):
        if data["password"] != data["confirm_password"]:
            raise serializers.ValidationError({"confirm_password": "Passwords do not match"})
        return data 
    
    def create(self, validated_data):
        address_data = validated_data.pop('address')
        validated_data.pop("confirm_password", None)

        location_info = get_location_by_area(address_data['area'])

        if not location_info:
            raise serializers.ValidationError({"area" : "Service not available in this area"})
        
        address_data.update(location_info)

        user = CustomUser.objects.create_user(**validated_data)

        address = UserAddress.objects.create(user=user, **address_data)
        
        user.address = address
        user.save()
        return user

class DonationSerializer(serializers.ModelSerializer):
    restaurantName = serializers.CharField(source='restaurant.organization_name', read_only=True)
    claimedAt = serializers.DateTimeField(source='claimed_at', read_only=True)
    claimedBy = serializers.CharField(source='claimed_by.username', read_only=True)

    class Meta:
        model = Donation
        fields = '__all__'
        extra_kwargs = {
            "restaurant": {"read_only":True}
        }


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = "__all__"