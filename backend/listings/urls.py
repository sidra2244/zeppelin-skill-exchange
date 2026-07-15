from django.urls import path
from .views import ListingView , ListingDetailView

urlpatterns = [
    path('', ListingView.as_view(), name='listing-list'),
    path('<int:pk>/', ListingDetailView.as_view(), name='listing-detail'),
]