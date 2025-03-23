from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager, PermissionsMixin
from django.utils.timezone import now, timedelta

class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None,**extra_fields):
        if not email:
            raise ValueError("Email is required!")
        
        if extra_fields.get("user_type") != "admin":
            required_fields = ["organization_name", "contact_person", "street_address", "area", "city", "pin_code" ]
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
    street_address = models.CharField(max_length=255, null=False, blank=False)
    area = models.CharField(max_length=200,null=False, blank=False )
    landmark = models.CharField(max_length=255, )
    city = models.CharField(max_length=100,null=False, blank=False)
    pin_code= models.CharField(max_length=10, null=False, blank=False)

    first_name = models.CharField(max_length=150, null=True, blank=True)
    last_name = models.CharField(max_length=150, null=True, blank=True)
    last_login = models.CharField(max_length=150, null=True, blank=True)
    date_joined = models.DateTimeField(max_length=150, null=True, blank=True)

    objects = CustomUserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["user_type"]

    def __str__(self):
        return f"{self.organization_name} ({self.get_user_type_display()})"


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
       ( "claim", "claim"), 
       ( "claimed", "Claimed") 
    ]

    UNIT_CHOICES = [
        ("liters", "Liters"),
        ("kilograms", "Kilograms"), 
        ("servings", "servings"), 
        ("pieces", "pieces"), 
    ]

    food_item = models.CharField(max_length=150)
    quantity = models.PositiveBigIntegerField()
    units = models.CharField(choices=UNIT_CHOICES, max_length=150, default="Servings")
    description = models.TextField(max_length=255, blank=True, null=True)
    status = models.CharField(choices=STATUS_CHOICEs, max_length=150, default="Claim")
    restaurant = models.ForeignKey("CustomUser", on_delete=models.CASCADE, related_name="donations")
    created_at = models.DateTimeField(auto_now_add=True)
    expiration_datetime = models.DateTimeField()

    objects = DonationManager()

    def __str__(self):
        return f"{self.food_item} ({self.quantity} meals) - {self.status}"