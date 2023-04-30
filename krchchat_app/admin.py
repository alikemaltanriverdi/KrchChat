from django.contrib import admin
from .models import Conversation, ChatMessage, UserProfile, GroupChat, GroupChatMessage

admin.site.register(ChatMessage)
admin.site.register(UserProfile)


class ChatMessage(admin.TabularInline):
	model = ChatMessage


# Register your models here.


class ConversationAdmin(admin.ModelAdmin):
	inlines = [ChatMessage]
	
	class Meta:
		model = Conversation
	
admin.site.register(Conversation, ConversationAdmin)


class GroupChatAdmin(admin.ModelAdmin):
    filter_horizontal = ('users',)

class GroupChatMessageAdmin(admin.ModelAdmin):
    list_display = ('group_chat', 'sender', 'message', 'timestamp')

admin.site.register(GroupChat, GroupChatAdmin)
admin.site.register(GroupChatMessage, GroupChatMessageAdmin)
