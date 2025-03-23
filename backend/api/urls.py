from django.urls import path
from .views import RegisterView, LoginView, ProtectedView, LogoutView, DonationListCreateView, DonationDetailView, ClaimDonationView, get_user


urlpatterns = [
    path('register/', RegisterView.as_view(), name="register"),
    path('login/', LoginView.as_view(), name="login"),
    path('protected/', ProtectedView.as_view(), name='protected-api'),
    path('logout/', LogoutView.as_view(), name="logout"),
    path('donations/', DonationListCreateView.as_view(), name='donation-list-create'),
    path('donations/<int:pk>/', DonationDetailView.as_view(), name='donation-detail'),
    path('donations/<int:pk>/claim/', ClaimDonationView.as_view(), name="donation-claim"),
     path("user/", get_user, name="get-user"),
]
