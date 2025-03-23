from rest_framework import serializers
from .models import CustomUser, Donation
from rest_framework.authentication import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from django.core.validators import validate_email
from django.contrib.auth.password_validation import validate_password

class CustomUserSerializer(serializers.ModelSerializer):

    password = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = ['id', 'user_type', 'organization_name', 'contact_person','email', 'street_address', 'area', 'landmark', 'pin_code', 'city', "password"  ]
        extra_kwargs = {'password': {'write_only':True}}


    def create(self, validated_data):
        password = validated_data.pop("password", None)
        user = CustomUser(**validated_data)

        if password:
            user.set_password(password)
        user.save()

        return user 
    
class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        email = data.get('email')
        password = data.get('password')
        user = authenticate(email=email, password=password)
    
        if user is None:
            raise serializers.ValidationError("Invalid email or password")

        if not user.check_password(password):
            raise serializers.ValidationError("Incorrect Password!")
        
        refresh = RefreshToken.for_user(user)

        return {
            "user" : {
                "id": user.id,
                "email": user.email,
                "user_type": user.user_type,
            },
            "refresh": str(refresh),
            "access" : str(refresh.access_token)
        }

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])
    confirm_password = serializers.CharField(write_only=True)  # Fixed typo

    class Meta:
        model = CustomUser
        fields = '__all__'

    def validate_email(self, value):
        if CustomUser.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists!")
        return value
    
    def validate(self, data):
        if data["password"] != data["confirm_password"]:
            raise serializers.ValidationError({"confirm_password": "Passwords do not match"})
        return data 
    
    def create(self, validated_data):
        validated_data.pop("confirm_password", None)
        return CustomUser.objects.create_user(**validated_data)


class DonationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Donation
        fields = '__all__'


