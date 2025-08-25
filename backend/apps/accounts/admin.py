# apps/accounts/admin.py
from django.contrib import admin
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group

User = get_user_model()

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ("username", "first_name", "last_name", "email", "is_staff", "is_superuser", "is_active")
    search_fields = ("username", "first_name", "last_name", "email")
    list_filter = ("is_staff", "is_superuser", "is_active")
    ordering = ("username",)

try:
    admin.site.unregister(Group)
except admin.sites.NotRegistered:
    pass
