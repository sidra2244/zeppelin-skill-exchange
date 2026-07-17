import uuid
from django.db import models
from django.conf import settings


class ChatRoom(models.Model):
    """
    Represents a private chat room between two users.
    Linked to a Match when created through the skill-exchange flow,
    but can also exist independently for direct messaging.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    match = models.OneToOneField(
        'matches.Match',
        on_delete=models.CASCADE,
        related_name='chat_room',
        null=True,
        blank=True,
        help_text="The match that triggered this chat room (optional)."
    )
    participants = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        related_name='chat_rooms',
        help_text="Users participating in this room."
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        usernames = ', '.join(p.username for p in self.participants.all())
        return f"ChatRoom [{usernames}]"


class Message(models.Model):
    """
    A single message sent inside a ChatRoom.
    Persisted in PostgreSQL; Redis only carries it in-transit.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    room = models.ForeignKey(
        ChatRoom,
        on_delete=models.CASCADE,
        related_name='messages'
    )
    sender = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='sent_messages'
    )
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True, db_index=True)
    is_read = models.BooleanField(default=False)

    class Meta:
        ordering = ['timestamp']

    def __str__(self):
        return f"[{self.room_id}] {self.sender.username}: {self.content[:60]}"
