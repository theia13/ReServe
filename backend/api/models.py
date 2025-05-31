from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager, PermissionsMixin
from django.utils.timezone import now, timedelta
import datetime

from django.db.models.signals import post_save
from django.dispatch import receiver

class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None,**extra_fields):
        if not email:
            raise ValueError("Email is required!")
        
        if extra_fields.get("user_type") != "admin":
            required_fields = ["organization_name", "contact_person",  ]
            for field in required_fields:
                if field not in extra_fields or not extra_fields[field]:
                    raise ValueError(f"{field.replace('_', ' ').capitalize()} is required")
        
        email = self.normalize_email(email)

        if extra_fields.get("user_type") != "admin":
            extra_fields.setdefault("is_staff", True)
            extra_fields.setdefault("is_superuser", False)

        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self, email, password=True, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        return self.create_user(email, password, **extra_fields)

class CustomUser(AbstractUser, PermissionsMixin):

    USER_TYPE_CHOICES = (
        ('restaurant', 'Restaurant'),
        ('ngo', 'NGO'),
        ('admin', 'Admin'),
    )
    username = None 
    email = models.EmailField(unique=True,)  
    user_type = models.CharField(max_length=20, choices=USER_TYPE_CHOICES, default='admin')
    organization_name = models.TextField(max_length=255, null=False, blank=False)
    contact_person = models.CharField(max_length=255,null=False, blank=False)
    address = models.OneToOneField('UserAddress', on_delete=models.CASCADE, null=True, blank=True, related_name='user_profile_address')

    first_name = models.CharField(max_length=150, null=True, blank=True)
    last_name = models.CharField(max_length=150, null=True, blank=True)
    last_login = models.CharField(max_length=150, null=True, blank=True)
    date_joined = models.DateTimeField(max_length=150, null=True, blank=True)

    objects = CustomUserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["user_type"]

    def __str__(self):
        return f"{self.organization_name} ({self.get_user_type_display()})"
    

class UserAddress(models.Model):
    user = models.OneToOneField("CustomUser", on_delete=models.CASCADE, related_name="user_address",null=True, blank=True)
    street_address = models.CharField(max_length=255)
    area = models.CharField(max_length=255, null=False, blank=True)
    landmark = models.CharField(max_length=255, null=False, blank=True)
    city = models.CharField(max_length=255, null=False, blank=True)
    pin_code = models.CharField(max_length=255, null=False, blank=True)

    def __str__(self):
        return f"{self.street_address} , {self.area} {self.city}"


class DonationManager(models.Manager):
    def active(self):
        return self.filter(status="claim")
    
    def by_active(self, restaurant):
        return self.filter(restaurant="restaurant")
    
    def recent(self ):
        return self.filter(created_at__gte=now() - timedelta(days=7))
    
    def claimed(self):
        return self.filter(status="claimed")

class Donation(models.Model):
    STATUS_CHOICEs = [
       ( "claim", "Claim"), 
       ( "claimed", "Claimed") 
    ]

    UNIT_CHOICES = [
        ("liters", "Liters"),
        ("kilograms", "Kilograms"), 
        ("servings", "servings"), 
        ("pieces", "pieces"), 
    ]
    claimed_by = models.ForeignKey("CustomUser", null=True, blank=True, on_delete=models.SET_NULL, related_name='claimed_donations') 
    claimed_at = models.DateTimeField(null=True, blank=True)
    food_item = models.CharField(max_length=150)
    quantity = models.PositiveBigIntegerField()
    units = models.CharField(choices=UNIT_CHOICES, max_length=150, default="Servings")
    description = models.TextField(max_length=255, blank=True, null=True)
    status = models.CharField(choices=STATUS_CHOICEs, max_length=150, default="claim")
    restaurant = models.ForeignKey("CustomUser", on_delete=models.CASCADE, related_name="donations")
    created_at = models.DateTimeField(auto_now_add=True)
    expiration_date = models.DateField(default=datetime.date.today)
    expiration_time = models.TimeField(default=datetime.time(12,0))

    objects = DonationManager()

    def __str__(self):
        return f"{self.food_item} ({self.quantity} meals) - {self.status}"
    

class UserProfile(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
    email_notification = models.BooleanField(default=True)
    expiration_alerts = models.BooleanField(default=True)
    weekly_reports = models.BooleanField(default=True)
    
    def __str__(self):
        return f"{self.user.organization_name} Profile"

@receiver(post_save, sender=CustomUser)
def create_or_update_user_profile(sender,instance,created, **kwargs):
    UserProfile.objects.get_or_create(user=instance)