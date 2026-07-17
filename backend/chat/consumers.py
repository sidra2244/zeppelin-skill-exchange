import json
from channels.generic.websocket import AsyncJsonWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth.models import AnonymousUser

from .models import ChatRoom, Message
from .serializers import MessageSerializer


class ChatConsumer(AsyncJsonWebsocketConsumer):
    """
    Async WebSocket consumer for real-time chat.

    ┌─────────────────────────────────────────────────────────┐
    │          Client → Server events                         │
    ├─────────────────┬───────────────────────────────────────┤
    │ chat_message    │ { "type": "chat_message",             │
    │                 │   "content": "Hello!" }               │
    ├─────────────────┼───────────────────────────────────────┤
    │ typing          │ { "type": "typing",                   │
    │                 │   "is_typing": true/false }           │
    ├─────────────────┼───────────────────────────────────────┤
    │ mark_read       │ { "type": "mark_read" }               │
    └─────────────────┴───────────────────────────────────────┘

    ┌─────────────────────────────────────────────────────────┐
    │          Server → Client events                         │
    ├──────────────────────┬──────────────────────────────────┤
    │ message_history      │ Last 50 msgs on connect          │
    │ chat_message         │ New message broadcast            │
    │ typing_indicator     │ Who is typing                    │
    │ presence_update      │ User online / offline            │
    │ unread_update        │ Unread count per room            │
    │ error                │ Validation / server errors       │
    └──────────────────────┴──────────────────────────────────┘
    """

    # -------------------------------------------------------------------------
    # Connection lifecycle
    # -------------------------------------------------------------------------

    async def connect(self):
        self.user = self.scope.get('user')
        self.room_id = self.scope['url_route']['kwargs']['room_id']
        self.room_group_name = f'chat_{self.room_id}'

        # Reject unauthenticated connections immediately
        if not self.user or isinstance(self.user, AnonymousUser):
            await self.close(code=4001)
            return

        # Reject if user is not a participant of this room
        if not await self._is_participant():
            await self.close(code=4003)
            return

        # Join the Redis broadcast group for this room
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)

        await self.accept()

        # Notify other participants that this user is now online
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'presence_update',
                'user_id': self.user.id,
                'username': self.user.username,
                'status': 'online',
            }
        )

        # Push last 50 messages to the newly connected client
        history = await self._get_message_history()
        await self.send_json({
            'type': 'message_history',
            'messages': list(history),
        })

    async def disconnect(self, close_code):
        if not hasattr(self, 'room_group_name'):
            return

        # Notify other participants that this user went offline
        try:
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'presence_update',
                    'user_id': self.user.id,
                    'username': self.user.username,
                    'status': 'offline',
                }
            )
        except Exception:
            pass

        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    # -------------------------------------------------------------------------
    # Receive from client
    # -------------------------------------------------------------------------

    async def receive_json(self, content):
        """
        Central dispatcher for all incoming WebSocket messages.
        Wrapped in try/except so malformed payloads never crash the consumer.
        """
        try:
            msg_type = content.get('type')

            if msg_type == 'chat_message':
                await self._handle_chat_message(content)

            elif msg_type == 'typing':
                await self._handle_typing(content)

            elif msg_type == 'mark_read':
                await self._handle_mark_read()

            else:
                await self.send_json({
                    'type': 'error',
                    'code': 400,
                    'message': f"Unknown event type: '{msg_type}'",
                })

        except Exception as exc:
            await self.send_json({
                'type': 'error',
                'code': 500,
                'message': 'An internal server error occurred.',
            })

    # -------------------------------------------------------------------------
    # Event handlers (incoming from client)
    # -------------------------------------------------------------------------

    async def _handle_chat_message(self, content):
        text = content.get('content', '').strip()

        if not text:
            await self.send_json({
                'type': 'error', 'code': 400,
                'message': 'Message content cannot be empty.',
            })
            return

        if len(text) > 5000:
            await self.send_json({
                'type': 'error', 'code': 400,
                'message': 'Message is too long (maximum 5000 characters).',
            })
            return

        # Persist to PostgreSQL and get serialized payload
        serialized = await self._save_message(text)

        # Broadcast new message to all connected participants
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': serialized,
            }
        )

        # Push individual unread counts to each participant in real-time
        unread_map = await self._get_unread_counts()
        for user_id, count in unread_map.items():
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'unread_update',
                    'for_user_id': user_id,
                    'room_id': str(self.room_id),
                    'unread_count': count,
                }
            )

    async def _handle_typing(self, content):
        is_typing = bool(content.get('is_typing', False))
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'typing_indicator',
                'user_id': self.user.id,
                'username': self.user.username,
                'is_typing': is_typing,
            }
        )

    async def _handle_mark_read(self):
        await self._mark_messages_read()
        # Immediately confirm updated unread count (zero) back to this user
        await self.send_json({
            'type': 'unread_update',
            'room_id': str(self.room_id),
            'unread_count': 0,
        })

    # -------------------------------------------------------------------------
    # Group event handlers — called by the channel layer (Redis → consumer)
    # -------------------------------------------------------------------------

    async def chat_message(self, event):
        """Forward a broadcast message to this WebSocket client."""
        await self.send_json({
            'type': 'chat_message',
            'message': event['message'],
        })

    async def typing_indicator(self, event):
        """Forward typing status — skip echoing back to the sender."""
        if event['user_id'] != self.user.id:
            await self.send_json({
                'type': 'typing_indicator',
                'user_id': event['user_id'],
                'username': event['username'],
                'is_typing': event['is_typing'],
            })

    async def presence_update(self, event):
        """Forward presence (online/offline) — skip echoing back to the sender."""
        if event['user_id'] != self.user.id:
            await self.send_json({
                'type': 'presence_update',
                'user_id': event['user_id'],
                'username': event['username'],
                'status': event['status'],
            })

    async def unread_update(self, event):
        """Forward unread count update — only to the user it's addressed to."""
        if event['for_user_id'] == self.user.id:
            await self.send_json({
                'type': 'unread_update',
                'room_id': event['room_id'],
                'unread_count': event['unread_count'],
            })

    # -------------------------------------------------------------------------
    # Database helpers — executed synchronously in a thread pool
    # -------------------------------------------------------------------------

    @database_sync_to_async
    def _is_participant(self) -> bool:
        try:
            room = ChatRoom.objects.get(id=self.room_id)
            return room.participants.filter(id=self.user.id).exists()
        except ChatRoom.DoesNotExist:
            return False

    @database_sync_to_async
    def _get_message_history(self) -> list:
        """Return the last 50 messages in chronological order."""
        qs = (
            Message.objects
            .filter(room_id=self.room_id)
            .select_related('sender')
            .order_by('-timestamp')[:50]
        )
        messages = list(reversed(list(qs)))
        return list(MessageSerializer(messages, many=True).data)

    @database_sync_to_async
    def _save_message(self, content: str) -> dict:
        """
        Persist a Message to PostgreSQL.
        Re-fetches with select_related to ensure the sender object is
        fully loaded before the serializer accesses it.
        """
        message = Message.objects.create(
            room_id=self.room_id,
            sender=self.user,
            content=content,
        )
        # Re-fetch with select_related to avoid any lazy-load issues in serializer
        message = Message.objects.select_related('sender').get(id=message.id)
        return dict(MessageSerializer(message).data)

    @database_sync_to_async
    def _mark_messages_read(self):
        """Mark all messages NOT sent by current user as read."""
        Message.objects.filter(
            room_id=self.room_id,
            is_read=False,
        ).exclude(sender=self.user).update(is_read=True)

    @database_sync_to_async
    def _get_unread_counts(self) -> dict:
        """
        Return a mapping of { user_id: unread_count } for every
        participant in the room — used to push real-time badge updates.
        """
        try:
            room = ChatRoom.objects.prefetch_related('participants').get(id=self.room_id)
            result = {}
            for participant in room.participants.all():
                count = (
                    Message.objects
                    .filter(room_id=self.room_id, is_read=False)
                    .exclude(sender=participant)
                    .count()
                )
                result[participant.id] = count
            return result
        except ChatRoom.DoesNotExist:
            return {}
