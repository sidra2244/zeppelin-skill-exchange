from rest_framework.permissions import BasePermission
from .models import ChatRoom


class IsRoomParticipant(BasePermission):
    """
    Object-level permission.
    Grants access only if the requesting user is a participant
    of the ChatRoom being accessed.
    """
    message = "You are not a participant of this chat room."

    def has_object_permission(self, request, view, obj):
        if isinstance(obj, ChatRoom):
            return obj.participants.filter(id=request.user.id).exists()
        # For Message objects, check the parent room
        if hasattr(obj, 'room'):
            return obj.room.participants.filter(id=request.user.id).exists()
        return False
