from rest_framework import generics, filters, permissions
from .models import Listing, ListingReport
from .serializers import ListingSerializer, ListingReportSerializer
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from django_filters.rest_framework import DjangoFilterBackend
from matches.views import find_and_create_matches
from users.models import BlockedUser



class ListingView(generics.ListCreateAPIView):
    queryset = Listing.objects.all()
    serializer_class = ListingSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'city', 'radius_km', 'type', 'title']
    search_fields = ['description', 'category', 'city', 'title']
    ordering_fields = ['created_at', 'radius_km']
    ordering = ['-created_at']  # Default ordering by created_at descending

    def get_queryset(self):
        queryset = Listing.objects.filter(status='active')

        if self.request.user.is_authenticated:
            blocked_user = BlockedUser.objects.filter(blocker=self.request.user).values_list('blocked_id', flat=True)
            queryset = queryset.exclude(user__in=blocked_user)
        return queryset
    

    def perform_create(self, serializer):
        listing = serializer.save(user=self.request.user)
        find_and_create_matches(listing)
        

class ListingDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ListingSerializer

    def get_permissions(self):
        if self.request.method == 'GET':
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        queryset = Listing.objects.all()
        if self.request.method in ['PUT', 'PATCH', 'DELETE']:
            return queryset.filter(user=self.request.user)
        
        if self.request.user.is_authenticated:
            blocked_user = BlockedUser.objects.filter(
                blocker = self.request.user
            ).values_list('blocked_id', flat=True)
            queryset = queryset.exclude(user__in = blocked_user)
        return queryset
    

class ListingReportView(generics.CreateAPIView):
    serializer_class = ListingReportSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        listing_id = self.kwargs['pk']
        listing = Listing.objects.get(pk=listing_id)

        serializer.save(reported_by=self.request.user, listing=listing)

        report_count = listing.reports.count()
        if report_count>=3:
            listing.status = 'closed'
            listing.save()
    
