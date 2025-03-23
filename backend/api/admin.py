from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, Donation

# Register your models here.

class CustomUserAdmin(UserAdmin):
    list_display = ('email', 'user_type', 'organization_name', 'contact_person', 'city')
    list_filter = ('user_type', 'city')
    search_fields = ('email', 'organization_name', 'contact_person')
    ordering = ('email',)
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal Info', {'fields': ('contact_person', 'organization_name', 'street_address', 'area', 'landmark', 'city', 'pin_code')}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'user_type', 'organization_name', 'contact_person', 'street_address','area', 'landmark', 'city', 'pin_code','password1', 'password2')}
            ),
    )



admin.site.register(CustomUser, CustomUserAdmin)

admin.site.register(Donation)