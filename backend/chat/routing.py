from django.urls import re_path
from .consumers import ChatConsumer

# WebSocket URL patterns — mounted in core/asgi.py
websocket_urlpatterns = [
    re_path(
        r'^ws/chat/(?P<room_id>[0-9a-f\-]{36})/$',
        ChatConsumer.as_asgi(),
        name='ws-chat',
    ),
]
