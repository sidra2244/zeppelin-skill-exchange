from django.urls import path
from .views import ListingView , ListingDetailView

urlpatterns = [
    path('listings/', ListingView.as_view(), name='listing-list'),
    path('listings/<int:pk>/', ListingDetailView.as_view(), name='listing-detail'),
]