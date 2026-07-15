from django.urls import path
from .views import (
    ChatRoomListCreateView,
    ChatRoomDetailView,
    MessageListCreateView,
)

urlpatterns = [
    # Room endpoints
    path('chat/rooms/', ChatRoomListCreateView.as_view(), name='chat-room-list'),
    path('chat/rooms/<uuid:pk>/', ChatRoomDetailView.as_view(), name='chat-room-detail'),

    # Message endpoints (scoped to a room)
    path('chat/rooms/<uuid:room_id>/messages/', MessageListCreateView.as_view(), name='chat-message-list'),
]
