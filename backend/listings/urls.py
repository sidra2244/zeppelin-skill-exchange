from django.urls import path
from .views import ListingView , ListingDetailView, ListingReportView

urlpatterns = [
    path('', ListingView.as_view(), name='listing-list'),
    path('<int:pk>/', ListingDetailView.as_view(), name='listing-detail'),
    path('<int:pk>/report/', ListingReportView.as_view(), name='report'),
]