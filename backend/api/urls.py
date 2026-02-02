from django.urls import path
from .views import RegisterView, LoginView, ProtectedView, LogoutView, DonationListCreateView, DonationDetailView, ClaimDonationView, UnclaimDonationView,check_auth
from . import views


urlpatterns = [
    path('register/', RegisterView.as_view(), name="register"),
    path('login/', LoginView.as_view(), name="login"),
    path('protected/', ProtectedView.as_view(), name='protected-api'),
    path('logout/', LogoutView.as_view(), name="logout"),
    path('donations/', DonationListCreateView.as_view(), name='donation-list-create'),
    path('donations/<int:pk>/claim/', ClaimDonationView.as_view(), name='claim-donation'),
    path('donations/<int:pk>/', DonationDetailView.as_view(), name='donation-detail'),
    path('donations/<int:pk>/unclaim/', UnclaimDonationView.as_view(), name='unclaim-donation'),
    path('check-auth/', check_auth, name='check-auth'),
    
    path('user/profile/', views.user_profile_view, name="user-profile"),
    path('user/change-password', views.change_password_view, name="change-password")

]
