from django.contrib import admin
from .models import Listing, ListingReport

# Register your models here.
@admin.register(Listing)
class ListingAdmin(admin.ModelAdmin):
    list_display = ('user', 'type', 'category', 'city', 'status', 'created_at')

@admin.register(ListingReport)
class ReportAdmin(admin.ModelAdmin):
    list_display = ('listing', 'reported_by', 'reason', 'created_by')