from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, Donation, UserAddress, UserProfile

# Register your models here.


class UserAddressInline(admin.StackedInline):
    model = UserAddress
    can_delete = False
    verbose_name_plural = "Address"

class UserProfileInline(admin.StackedInline):
    model = UserProfile
    can_delete = False


class CustomUserAdmin(UserAdmin):
    inlines = [UserAddressInline, UserProfileInline]

    list_display = ('email', 'user_type', 'organization_name', 'contact_person', 'get_city')
    list_filter = ('user_type', 'address__city')
    search_fields = ('email', 'organization_name', 'contact_person', 'address__city')
    ordering = ('email',)

    def get_city(self, obj):
        return obj.address.city if obj.address else ''
    get_city.short_description = "city"

    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal Info', {'fields': ('contact_person', 'organization_name', )}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'user_type', 'organization_name', 'contact_person', 'password1', 'password2')}
            ),
    )




admin.site.register(CustomUser, CustomUserAdmin)

admin.site.register(Donation)
