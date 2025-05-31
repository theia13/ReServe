from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import CustomUserSerializer, LoginSerializer, DonationSerializer, RegisterSerializer
from .permissions import IsNGO, IsRestaurant
from .models import Donation
from rest_framework import serializers
from django.db.models import Q
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from django.utils import timezone


class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        print("Request received!")
        print("Request body:", request.data)
        
        serializer = self.get_serializer(data=request.data)
        
        if not serializer.is_valid():
            print("Validation failed. Errors:", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        user = serializer.save()
        refresh = RefreshToken.for_user(user)

        return Response(
            {
                'user': CustomUserSerializer(user).data,
                'id': user.id,
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user_type': user.user_type,
            },
            status=status.HTTP_201_CREATED
        )    


class LoginView(generics.GenericAPIView):
    serializer_class = LoginSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data["user"]

        return Response(serializer.validated_data, status=status.HTTP_200_OK)
    
class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get("refresh")

            if not refresh_token:
                return Response({"Error":"Refresh token is requires"}, status=400)
            
            token_obj = RefreshToken(refresh_token)
            token_obj.blacklist()
            return Response({"message":"Logged out succesfully"}, status=200)
        except Exception as e:
            return Response({"error":str(e)}, status=400)

class ProtectedView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({"message ": "You're authenticated!"})
    
class NGOView(APIView):
    permission_classes = [IsNGO]

    def get(self,request):
        return Response({"message" : "This is an NGO only endpoint!"})
    
class RestaurantView(APIView):
    permission_classes = [IsRestaurant]

    def get(self, request):
        return Response({"message": "Restaurant can create a donation!"})
    

class DonationListCreateView(generics.ListCreateAPIView):
    serializer_class = DonationSerializer
    permission_classes = [IsAuthenticated]
    queryset = Donation.objects.all()
    
    def perform_create(self, serializer):
        if self.request.user.user_type != "restaurant":
            raise ValidationError({"error": "Only restaurants can add donations!"})
        serializer.save(restaurant=self.request.user)

    def get_queryset(self):
        user = self.request.user

        if user.user_type == 'restaurant':
            return Donation.objects.filter(restaurant=user)

        elif user.user_type == 'ngo':
            try:
                area = user.address.area
            except AttributeError:
                raise serializers.ValidationError({
                    "detail" : "NGO address or area is not set. Please update your profile."
                })
            
            return Donation.objects.filter(
                    Q(status="claim", restaurant__address__area__iexact=user.address.area) | 
                    Q(status="claimed", claimed_by=user)
            )
            
        return Donation.objects.none()

    
class DonationDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Donation.objects.all()
    serializer_class = DonationSerializer
    permission_classes = [IsAuthenticated]

    def get(self,request,pk):
        try:
            donation = Donation.objects.get(pk=pk)
            serializer = DonationSerializer(donation)
            return Response(serializer.data)
        except Donation.DoesNotExist:
            return Response({"Error": "Donation not found"}, status=status.HTTP_404_NOT_FOUND)

    def put(self,request,pk):
        if request.user.user_type != "restaurant":
            return Response({"Error": "Only restaurants can edit this!"}, status=status.HTTP_403_FORBIDDEN)
        try:
            donation = Donation.objects.get(pk=pk)
            serializer = DonationSerializer(donation, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Donation.DoesNotExist:
            return Response({"Error": "Donation not found"}, status=status.HTTP_404_NOT_FOUND)
        
    def delete(self,request,pk):
        if request.user.user_type != "restaurant":
            return Response({"Error": "Only restaurants can delete this!"}, status=status.HTTP_403_FORBIDDEN)
        try:
            donation = Donation.objects.get(pk=pk)
            donation.delete()
            return Response({"message": "Donation deleted successfully!"}, status=status.HTTP_204_NO_CONTENT)
        except Donation.DoesNotExist:
            return Response({"Error" : "Donation not found"}, status=status.HTTP_404_NOT_FOUND)
        
class ClaimDonationView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self,request,pk):
        print("CLAIM VIEW HIT")
        try:
            donation = Donation.objects.get(pk=pk, status="claim")
            donation.status = "claimed"
            donation.claimed_by = request.user
            donation.claimed_at = timezone.now()
            donation.save()
            return Response({"message":"Donation claimed successfully!"}, status=status.HTTP_200_OK)
        except Donation.DoesNotExist:
            return Response({"Error":"Donation not found or already claimed"}, status=status.HTTP_404_NOT_FOUND)


@api_view(["GET"])
def get_user(request):
    user = request.user
    if user.is_authenticated:
        return Response({"email": user.email, "name": user.username})
    return Response({"error": "User not authenticated"}, status=401)


@api_view(['GET', 'PATCH'])
@permission_classes([IsAuthenticated])
def user_profile_view(request):

    if not request.user.is_authenticated:
        return Response(
            {"error": "Authentication required"},
            status=status.HTTP_401_UNAUTHORIZED
        )
    
    if request.method == "GET":
        serializer = CustomUserSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    elif request.method == "PATCH":
        serializer = CustomUserSerializer(
            request.user,
            data = request.data,
            partial = True
        )

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def change_password_view(request):
    if not request.user.is_authenticated:
        return Response(
            {"error": "Authentication required"},
            status=status.HTTP_401_UNAUTHORIZED
        )
    
    current_password = request.data.get('current_password')
    new_password = request.data.get('new_password')
    confirm_new_password = request.data.get('confirm_new_password')


    if not current_password or not new_password:
        return Response(
            {"error": "Both current password and new password are required"},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    if not request.user.check_password(current_password):
        return Response (
              {"error": "Current password is incorrect"},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    if new_password != confirm_new_password:
        return Response(
              {"error": "Passwords do not match"},
            status=status.HTTP_400_BAD_REQUEST
        )

    
    request.user.set_password(new_password)
    request.user.save()

    return Response(
          {"messaage": "Password updated succesfully"},
            status=status.HTTP_200_OK
    )
