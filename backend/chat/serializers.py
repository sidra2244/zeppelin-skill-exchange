from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import ChatRoom, Message

User = get_user_model()


class ChatParticipantSerializer(serializers.ModelSerializer):
    """
    Lightweight user representation used inside chat responses.
    Includes only the fields needed to render a chat UI avatar/name.
    """
    photo = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'photo']

    def get_photo(self, obj):
        """Return photo URL as a plain string, or None if not set."""
        if obj.photo:
            return str(obj.photo.url) if hasattr(obj.photo, 'url') else str(obj.photo)
        return None


class MessageSerializer(serializers.ModelSerializer):
    """
    Full serializer for a single chat message.
    Sender is nested to include name/photo without a separate API call.
    """
    sender = ChatParticipantSerializer(read_only=True)

    class Meta:
        model = Message
        fields = ['id', 'room', 'sender', 'content', 'timestamp', 'is_read']
        read_only_fields = ['id', 'sender', 'timestamp', 'room']

    def to_representation(self, instance):
        """
        Convert UUID and datetime fields to plain strings so the result
        is safely serializable by both JSON and msgpack (used by channels_redis).
        """
        data = super().to_representation(instance)
        # Ensure id and room are plain strings (UUIDs)
        data['id'] = str(data['id']) if data.get('id') else None
        data['room'] = str(data['room']) if data.get('room') else None
        # Ensure timestamp is a plain ISO string
        if data.get('timestamp'):
            data['timestamp'] = str(data['timestamp'])
        return data


class ChatRoomSerializer(serializers.ModelSerializer):
    """
    Full chat room serializer for the REST API.
    Includes:
      - participants  : nested user objects
      - last_message  : preview of the most recent message
      - unread_count  : count of unread messages for the requesting user
    """
    participants = ChatParticipantSerializer(many=True, read_only=True)
    last_message = serializers.SerializerMethodField()
    unread_count = serializers.SerializerMethodField()

    class Meta:
        model = ChatRoom
        fields = [
            'id', 'match', 'participants',
            'created_at', 'last_message', 'unread_count',
        ]
        read_only_fields = ['id', 'created_at']

    def get_last_message(self, obj):
        last = obj.messages.order_by('-timestamp').first()
        return MessageSerializer(last).data if last else None

    def get_unread_count(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.messages.filter(
                is_read=False
            ).exclude(sender=request.user).count()
        return 0
