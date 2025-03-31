from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import CustomUserSerializer, LoginSerializer, DonationSerializer
from .permissions import IsNGO, IsRestaurant
from rest_framework_simplejwt.token_blacklist.models import OutstandingToken, BlacklistedToken
from .models import Donation
from django.db import IntegrityError
from rest_framework import viewsets

class RegisterView(generics.CreateAPIView):
    serializer_class = CustomUserSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        try:
            serializer.is_valid(raise_exception=True)
            user = serializer.save()

            refresh = RefreshToken.for_user(user)

            return Response(
                {
                    'user': CustomUserSerializer(user).data,
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                    'user_type': user.user_type, 
                },
                status=status.HTTP_201_CREATED
            )
        
        except IntegrityError:
            return Response({"Error":"A user with this email already exists."}, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response({"Error":str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
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
            raise serializers.ValidationError({"error": "Only restaurants can add donations!"})
        serializer.save(restaurant=self.request.user)

    
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
            return Response(serializer.error_messages, status=status.HTTP_400_BAD_REQUEST)
        except Donation.DoesNotExist:
            return Response({"Error": "Donation not found"}, status=status.HTTP_404_NOT_FOUND)
        
    def delete(self,request,pk):
        if request.user.user_type != "restaurant":
            return Response({"Error": "Only restaurants can delete this!"}, status=status.HTTP_403_FORBIDDEN)
        try:
            donation = Donation.objects.get(pk=pk)
            donation.delete()
            return Response({"Message": "Donation deleted successfully!"}, status=status.HTTP_204_NO_CONTENT)
        except Donation.DoesNotExist:
            return Response({"Error" : "Donation not found"}, status=status.HTTP_404_NOT_FOUND)
        
class ClaimDonationView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self,request,pk):
        try:
            donation = Donation.objects.get(pk=pk, status="claim")
            donation.status = "Claimed"
            donation.save()
            return Response({"Message":"Donation claimed successfully!"}, status=status.HTTP_200_OK)
        except Donation.DoesNotExist:
            return Response({"Error":"Donation not found or already claimed"}, status=status.HTTP_404_NOT_FOUND)

from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(["GET"])
def get_user(request):
    user = request.user
    if user.is_authenticated:
        return Response({"email": user.email, "name": user.username})
    return Response({"error": "User not authenticated"}, status=401)
