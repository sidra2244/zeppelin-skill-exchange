from rest_framework import generics
from django.contrib.auth import get_user_model
from .serializers import RegisterSerializer, UserSerializer, BlockedUserSerializer
from rest_framework.permissions import AllowAny, IsAuthenticated
from .models import BlockedUser
from listings.models import Listing
from listings.serializers import ListingSerializer

User = get_user_model()

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

class UserDetail(generics.RetrieveUpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user
    

class BlockUserVIew(generics.CreateAPIView):
    serializer_class = BlockedUserSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(blocker=self.request.user)

class UnblockUserView(generics.DestroyAPIView):
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return BlockedUser.objects.get(blocker=self.request.user, blocked_id=self.kwargs['pk'])
    
class BlockedUserList(generics.ListAPIView):
    serializer_class = BlockedUserSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return BlockedUser.objects.filter(blocker=self.request.user)
    

class MyListingView(generics.ListAPIView):
    serializer_class = ListingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Listing.objects.filter(user=self.request.user).order_by('-created_at')