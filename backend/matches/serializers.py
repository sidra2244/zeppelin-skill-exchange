from rest_framework import serializers
from .models import Match
from listings.serializers import ListingSerializer

class MatchSerializer(serializers.ModelSerializer):
    listing1 = ListingSerializer(read_only=True)
    listing2 = ListingSerializer(read_only=True)
    class Meta:
        model = Match
        fields = ['id', 'listing1', 'listing2', 'matched_at']