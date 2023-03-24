from django.contrib import admin
from .models import Conversation, ChatMessage

admin.site.register(ChatMessage)


class ChatMessage(admin.TabularInline):
	model = ChatMessage


# Register your models here.


class ConversationAdmin(admin.ModelAdmin):
	inlines = [ChatMessage]
	
	class Meta:
		model = Conversation


admin.site.register(Conversation, ConversationAdmin)
