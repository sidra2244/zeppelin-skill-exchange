from django.urls import path
from .views import RegisterView, UserDetail, BlockUserVIew, UnblockUserView, BlockedUserList,MyListingView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('me/', UserDetail.as_view(), name='me'),
    path('login/', TokenObtainPairView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('block/', BlockUserVIew.as_view(), name='block' ),
    path('unblock/<int:pk>/', UnblockUserView.as_view(), name='unblock'),
    path('blocked/', BlockedUserList.as_view(), name='block-users'),
    path('my-listings/', MyListingView.as_view(), name='my-listings')
]