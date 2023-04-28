from django.contrib import admin
from .models import Conversation, ChatMessage, UserProfile

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
