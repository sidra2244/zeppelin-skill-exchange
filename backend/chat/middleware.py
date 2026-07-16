from urllib.parse import parse_qs

from channels.middleware import BaseMiddleware
from channels.db import database_sync_to_async
from django.contrib.auth.models import AnonymousUser
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken

User = get_user_model()


@database_sync_to_async
def get_user_from_token(token_key: str):
    """
    Validates a JWT access token and returns the corresponding User.
    Returns AnonymousUser if the token is invalid or the user doesn't exist.
    """
    try:
        token = AccessToken(token_key)
        user_id = token['user_id']
        return User.objects.get(id=user_id)
    except (TokenError, InvalidToken, User.DoesNotExist, KeyError):
        return AnonymousUser()


class JWTAuthMiddleware(BaseMiddleware):
    """
    ASGI middleware that authenticates WebSocket connections using
    a JWT access token supplied in the URL query string.

    Usage:
        ws://host/ws/chat/<room_id>/?token=<access_token>

    On success:  scope["user"] = <authenticated User instance>
    On failure:  scope["user"] = AnonymousUser()
                 (consumer is responsible for closing with code 4001)
    """

    async def __call__(self, scope, receive, send):
        # Only process WebSocket connections
        if scope['type'] == 'websocket':
            query_string = scope.get('query_string', b'').decode('utf-8')
            params = parse_qs(query_string)
            token_list = params.get('token', [None])
            token = token_list[0] if token_list else None

            scope['user'] = (
                await get_user_from_token(token)
                if token
                else AnonymousUser()
            )

        return await super().__call__(scope, receive, send)
