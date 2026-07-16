from rest_framework import serializers
from .models import Listing, ListingReport

class ListingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Listing
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'user']

    
class ListingReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = ListingReport
        fields = ['id', 'listing', 'reason', 'created_by']
        read_only_fields = ['reported_by' , 'created_by']

        