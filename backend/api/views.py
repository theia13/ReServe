from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import CustomUserSerializer, LoginSerializer, DonationSerializer, RegisterSerializer
from .permissions import IsNGO, IsRestaurant
from .models import Donation
from rest_framework import serializers
from django.shortcuts import get_object_or_404
from django.db.models import Q
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError, PermissionDenied
from django.utils import timezone
from django.conf import settings

class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        
        if not serializer.is_valid():
            print("Validation failed. Errors:", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)
        refresh_token = str(refresh)

        response = Response(
            {
                'user': CustomUserSerializer(user).data,
                'user_type': user.user_type,
            },
            status=status.HTTP_201_CREATED
        )

        response.set_cookie(
            key="access",
            value=access_token,
            httponly=True,
            secure=False,
            samesite="Lax",
            max_age=60 * 20,
        )    

        response.set_cookie(
            key="refresh",
            value=refresh_token,
            httponly=True,
            secure=False,
            samesite="Lax",
            max_age=60 * 60 * 24 * 7,
        ) 

        return response

class LoginView(generics.GenericAPIView):
    serializer_class = LoginSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data["user"]

        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)
        refresh_token = str(refresh)

        response = Response({
            "user": {
                "email": user.email,
                "user_type": user.user_type,
            }
        })

        # Check if in development mode
        is_development = settings.DEBUG  # or however you determine dev mode
        
        response.set_cookie(
            key="access",
            value=access_token,
            httponly=True,
            secure=True,           # force it to True
            samesite="None",       # cross-site requires None + secure
            max_age=60*20,
        )


        response.set_cookie(
            key="refresh",
            value=refresh_token,
            httponly=True,
            samesite="Lax" if is_development else "None",  # Changed
            secure=not is_development,  # False for dev, True for prod
            max_age=60*60*24*7,
        )
        return response
    
class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.COOKIES.get("refresh")
            if not refresh_token:
                return Response({"Error":"Refresh token is required."}, status=400)
            
            token_obj = RefreshToken(refresh_token)
            token_obj.blacklist()

            response = Response({"message":"Logged out succesfully"}, status=200)
            response.delete_cookie("access")
            response.delete_cookie("refresh")
            return response
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
                raise ValidationError({
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

    def get_object(self):
        obj = get_object_or_404(Donation, pk=self.kwargs['pk'])

        if self.request.method == 'GET':
            if (obj.restaurant == self.request.user or obj.claimed_by == self.request.user):
                return obj
            else:
                raise PermissionDenied("You don't have permission to view this donation.")
            
        elif self.request.method in ['PUT', 'PATCH', 'DELETE']:
            if self.request.user.user_type != 'restaurant':
                raise PermissionDenied("Only restaurants can modify donations.")
            
            if obj.restaurant != self.request.user:
                raise PermissionDenied("You can only modify your own donations.")
            
            if self.request.method in ['PUT', 'PATCH', 'DELETE'] and obj.status == 'claimed':
                raise PermissionDenied("Cannot modify claimed donations.")
            
            return obj
        
        return obj
    
    def perform_update(self, serializer):
        if 'restaurant' in serializer.validated_data:
            raise ValidationError({'restaurant': "Restaurant field cannot be modified"})
        if 'claimed_by' in serializer.validated_data:
            raise ValidationError({'claimed_by': "Use the claim endpoint to claim donations."})
        
        serializer.save()

    def perform_destroy(self,instance):
        print(f"Donaton {instance.id} deleted by {self.request.user}")
        instance.delete()
        
class ClaimDonationView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self,request,pk):
        if request.user.user_type != "ngo":
            return Response (
                {"Error" : "Only NGOs can claim donations!"},
                status=status.HTTP_403_FORBIDDEN
            )
        
        try:
            donation = Donation.objects.get(pk=pk, status="claim")

            try:
                ngo_area = request.user.address.area
                restaurant_area = donation.restaurant.address.area

                if ngo_area.lower() != restaurant_area.lower():
                    return Response(
                        {"Error": "You can only claim donations in your area!"},
                        status=status.HTTP_403_FORBIDDEN
                    )
            except AttributeError:
                return Response(
                    {"error": "address information is incomplete!"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            donation.status = "claimed"
            donation.claimed_by = request.user
            donation.claimed_at = timezone.now()
            donation.save()

            return Response({"message" : "Donation claimed successfully!"},
                            status=status.HTTP_200_OK)

        except Donation.DoesNotExist:
            return Response(
                {"Error": "Donation not found or already claimed"},
                status=status.HTTP_404_NOT_FOUND
            )
        
class UnclaimDonationView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self,request,pk):
        if request.user.user_type != "ngo":
            return Response(
                {"Error" : "Only NGOs can unclaim donations!"},
                status=status.HTTP_403_FORBIDDEN
            )
        
        try:
            donation = Donation.objects.get(
                pk=pk,
                status="claimed",
                claimed_by=request.user
            )

            donation.status = "claim"
            donation.claimed_at = None
            donation.claimed_by = None
            donation.save()


            return Response(
                {"message":"Donation unclaimed succesfully!"},
                status=status.HTTP_200_OK
            )
        
        except Donation.DoesNotExist:
            return Response(
                {"Error" : "Donation not found or not claimed by you!"},
                status=status.HTTP_404_NOT_FOUND
            )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def check_auth(request):

    return Response({
        "authenticated": True,
        "user": {
            "email": request.user.email,
            "user_type": request.user.user_type,
            "username": request.user.username,
        }
    }, status=status.HTTP_200_OK)


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
          {"message": "Password updated succesfully"},
            status=status.HTTP_200_OK
    )

