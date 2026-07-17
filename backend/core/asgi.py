"""
ASGI config for core project.

Upgraded to Django Channels for WebSocket (real-time chat) support.
Routes:
    HTTP  → standard Django ASGI handler
    WS    → JWTAuthMiddleware → URLRouter → ChatConsumer
"""

import os

from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from chat.middleware import JWTAuthMiddleware
from chat.routing import websocket_urlpatterns

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

# Initialise Django ASGI app early so models are loaded before consumers import
django_asgi_app = get_asgi_application()

application = ProtocolTypeRouter({
    # Standard HTTP requests — handled by Django as usual
    'http': django_asgi_app,

    # WebSocket connections — authenticated via JWT, routed to ChatConsumer
    'websocket': JWTAuthMiddleware(
        URLRouter(websocket_urlpatterns)
    ),
})
