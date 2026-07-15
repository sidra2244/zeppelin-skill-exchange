from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from django.shortcuts import get_object_or_404

from .models import ChatRoom, Message
from .serializers import ChatRoomSerializer, MessageSerializer
from .permissions import IsRoomParticipant


# ---------------------------------------------------------------------------
# Pagination
# ---------------------------------------------------------------------------

class MessagePagination(PageNumberPagination):
    """
    Paginate message history — oldest messages first.
    Default 50 per page, configurable up to 100 via ?page_size=N.
    Frontend should request pages in reverse order (highest page first)
    for an infinite-scroll-upward pattern.
    """
    page_size = 50
    page_size_query_param = 'page_size'
    max_page_size = 100


# ---------------------------------------------------------------------------
# Views
# ---------------------------------------------------------------------------

class ChatRoomListCreateView(generics.ListCreateAPIView):
    """
    GET  /api/chat/rooms/
        List all chat rooms the authenticated user participates in.
        Each room includes: participants, last message preview, unread count.

    POST /api/chat/rooms/
        Create a new chat room.
        If a room with the EXACT same participant set already exists,
        the existing room is returned (idempotent — no duplicates).

        Body:
            {
                "participant_ids": [<user_id>, <user_id>],
                "match_id": <match_id>   (optional)
            }
    """
    serializer_class = ChatRoomSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return (
            ChatRoom.objects
            .filter(participants=self.request.user)
            .prefetch_related('participants', 'messages')
            .order_by('-created_at')
        )

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    def create(self, request, *args, **kwargs):
        participant_ids = list(request.data.get('participant_ids', []))
        match_id = request.data.get('match_id', None)

        # Ensure the requesting user is always included
        if request.user.id not in participant_ids:
            participant_ids.append(request.user.id)

        # Validate: minimum 2 participants
        if len(participant_ids) < 2:
            return Response(
                {'error': 'At least 2 participants are required.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Idempotency: return existing room if one already exists
        # with exactly this participant set (prevents duplicate rooms)
        existing = self._find_existing_room(participant_ids)
        if existing:
            serializer = self.get_serializer(existing, context={'request': request})
            return Response(serializer.data, status=status.HTTP_200_OK)

        # Create the new room
        room = ChatRoom.objects.create(
            match_id=match_id if match_id else None
        )
        room.participants.set(participant_ids)

        serializer = self.get_serializer(room, context={'request': request})
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def _find_existing_room(self, participant_ids: list):
        """
        Find a ChatRoom that has EXACTLY the given set of participants.
        Returns the room or None.
        """
        participant_set = set(participant_ids)

        # Start with rooms containing all requested participants
        qs = ChatRoom.objects.all()
        for pid in participant_ids:
            qs = qs.filter(participants__id=pid)
        qs = qs.distinct().prefetch_related('participants')

        for room in qs:
            # Exact match: no extra or missing participants
            room_participant_ids = set(room.participants.values_list('id', flat=True))
            if room_participant_ids == participant_set:
                return room

        return None


class ChatRoomDetailView(generics.RetrieveAPIView):
    """
    GET /api/chat/rooms/<uuid>/
        Retrieve a single room — accessible only to participants.
        Includes participants, last message, and unread count.
    """
    serializer_class = ChatRoomSerializer
    permission_classes = [IsAuthenticated, IsRoomParticipant]

    def get_queryset(self):
        return (
            ChatRoom.objects
            .filter(participants=self.request.user)
            .prefetch_related('participants', 'messages')
        )

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context


class MessageListCreateView(generics.ListCreateAPIView):
    """
    GET  /api/chat/rooms/<uuid>/messages/
        Paginated message history (oldest first, 50/page).
        Query params: ?page=<n>  ?page_size=<n> (max 100)

    POST /api/chat/rooms/<uuid>/messages/
        Send a message via REST (WebSocket fallback for non-realtime clients).
        Body: { "content": "Hello!" }
    """
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = MessagePagination

    def _get_room(self):
        """Fetch the room and implicitly verify the user is a participant."""
        return get_object_or_404(
            ChatRoom,
            id=self.kwargs['room_id'],
            participants=self.request.user,
        )

    def get_queryset(self):
        room = self._get_room()
        return (
            Message.objects
            .filter(room=room)
            .select_related('sender')
            .order_by('timestamp')
        )

    def perform_create(self, serializer):
        room = self._get_room()
        serializer.save(sender=self.request.user, room=room)
