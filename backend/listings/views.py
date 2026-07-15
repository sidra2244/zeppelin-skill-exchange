from rest_framework import generics, filters, permissions
from .models import Listing
from .serializers import ListingSerializer
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from django_filters.rest_framework import DjangoFilterBackend



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
        return Listing.objects.filter(status='active')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class ListingDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ListingSerializer

    def get_permissions(self):
        if self.request.method == 'GET':
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        if self.request.method in ['PUT', 'PATCH', 'DELETE']:
            return Listing.objects.filter(user=self.request.user)
        return Listing.objects.all()
    
