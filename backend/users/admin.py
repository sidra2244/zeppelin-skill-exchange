from django.contrib import admin
from .models import User, BlockedUser

# Register your models here.
@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('username', 'created_at')

@admin.register(BlockedUser)
class BlockAdmin(admin.ModelAdmin):
    list_display = ('blocker', 'blocked', 'created_by')