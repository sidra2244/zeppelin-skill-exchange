from rest_framework import serializers
from .models import Listing, ListingReport

class ListingSerializer(serializers.ModelSerializer):
    user_name = serializers.SerializerMethodField()
    class Meta:
        model = Listing
        fields = [
            'id', 'user', 'user_name', 'type', 'title',
            'category', 'description', 'city',
            'radius_km', 'status', 'created_at',
        ]
        read_only_fields = ['id', 'created_at', 'user']
    
    def get_user_name(self, obj):
            return f"{obj.user.first_name} {obj.user.last_name}".strip() or obj.user.email


    
class ListingReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = ListingReport
        fields = ['id', 'listing', 'reason', 'created_by']
        read_only_fields = ['reported_by' , 'created_by']

        