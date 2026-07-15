from rest_framework import generics, permissions
from .models import Match   
from .serializers import MatchSerializer
# from rest_framework.response import Response
# from rest_framework.views import APIView
from listings.models import Listing
from django.db.models import Q


def find_and_create_matches(listing):
    opposite_type = 'request' if listing.type == 'offer' else 'offer'

    opposite_listings = Listing.objects.filter(
        type=opposite_type, 
        category=listing.category, 
        city__iexact=listing.city, 
        status='active').exclude(user=listing.user)
    
    matches_created = []
    for opposite in opposite_listings:
        already_exists = Match.objects.filter(
            listing1 = listing,
            listing2 = opposite
        ).exists() or Match.objects.filter(
            listing1 = opposite,
            listing2 = listing
        ).exists()

        if not already_exists:
            match = Match.objects.create(
                listing1 = listing,
                listing2 = opposite
            )
            matches_created.append(match)
    return matches_created

class MyMatchView(generics.ListAPIView):
    serializer_class = MatchSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Match.objects.filter (Q(listing1__user=user)| Q(listing2__user=user)).order_by('matched_at')
    
class MatchDetailView(generics.RetrieveAPIView):
    serializer_class = MatchSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Match.objects.filter(
            listing1__user=user
        ) | Match.objects.filter(
            listing2__user=user
        )
    
