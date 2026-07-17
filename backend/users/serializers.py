from rest_framework import serializers
from django.contrib.auth import get_user_model
from listings.serializers import ListingSerializer
from .models import BlockedUser

User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    class Meta:
        model = User
        fields = ['id', 'username', 'email','first_name', 'last_name', 'password', 'bio', 'city', 'photo']

    def create(self, validated_data):
        user = User.objects.create_user(
            username = validated_data['username'],
            email = validated_data['email'],
            password = validated_data['password'],
            first_name = validated_data.get('first_name', ''),
            last_name = validated_data.get('last_name', ''),
            bio = validated_data.get('bio', ''),
            city = validated_data.get('city', ''),

        )
        return user
    
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id', 'username', 'first_name', 'last_name',
            'email', 'bio', 'city', 'photo', 'created_at', 'listings'
        ]

        def get_listings(self, obj):
            listings = obj.listings.filter(status='active')
            return ListingSerializer(listings, many=True).data


class BlockedUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlockedUser
        fields = ['id', 'blocked', 'created_by']
        read_only_fields = ['blocker', 'created_by']