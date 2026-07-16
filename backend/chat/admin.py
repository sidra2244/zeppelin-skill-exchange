from django.contrib import admin
from .models import ChatRoom, Message


@admin.register(ChatRoom)
class ChatRoomAdmin(admin.ModelAdmin):
    list_display = ['id', 'match', 'created_at', 'participant_list']
    filter_horizontal = ['participants']
    readonly_fields = ['id', 'created_at']

    def participant_list(self, obj):
        return ', '.join(p.username for p in obj.participants.all())
    participant_list.short_description = 'Participants'


@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ['id', 'room', 'sender', 'short_content', 'timestamp', 'is_read']
    list_filter = ['is_read', 'timestamp']
    search_fields = ['content', 'sender__username', 'room__id']
    readonly_fields = ['id', 'timestamp']
    ordering = ['-timestamp']

    def short_content(self, obj):
        return obj.content[:80]
    short_content.short_description = 'Content'
