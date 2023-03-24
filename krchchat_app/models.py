from django.db import models
from django.contrib.auth import get_user_model
from django.db.models import Q

User = get_user_model()


# Create your models here.

class ConversationManager(models.Manager):
	def by_user(self, **kwargs):
		user = kwargs.get('user')
		lookup = Q(first_person=user) | Q(second_person=user)
		qs = self.get_queryset().filter(lookup).distinct()
		return qs


class Conversation(models.Model):
	first_person = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True,
	                                 related_name='conversation_first_person')
	second_person = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True,
	                                  related_name='conversation_second_person')
	updated = models.DateTimeField(auto_now=True)
	timestamp = models.DateTimeField(auto_now_add=True)
	
	objects = ConversationManager()
	
	class Meta:
		unique_together = ['first_person', 'second_person']


class ChatMessage(models.Model):
	conversation = models.ForeignKey(Conversation, null=True, blank=True, on_delete=models.CASCADE,
	                           related_name='chatmessage_conversation')
	user = models.ForeignKey(User, on_delete=models.CASCADE)
	message = models.TextField()
	timestamp = models.DateTimeField(auto_now_add=True)
