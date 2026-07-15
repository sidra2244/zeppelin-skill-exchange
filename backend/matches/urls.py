from django.urls import path
from .views import MyMatchView, MatchDetailView

urlpatterns = [
    path('', MyMatchView.as_view(), name='my-matches'),
    path('<int:pk>/', MatchDetailView.as_view(), name='match-detail')
]