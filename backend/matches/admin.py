from django.contrib import admin
from .models import Match

# Register your models here.
@admin.register(Match)
class MatchAdmin(admin.ModelAdmin):
    list_display = ('listing1', 'listing2', 'matched_at')