from django.db import models
from django.contrib.auth import get_user_model
from django.db.models import Q
from django.db.models.signals import post_save
from django.dispatch import receiver

User = get_user_model()

# Create your models here.

class UserProfile(models.Model):
	user = models.OneToOneField(User, on_delete=models.CASCADE)
	is_online = models.BooleanField(default=False)
	
	def __str__(self):
		return self.user.username


@receiver(post_save, sender=User)
def create_profile(sender, instance, created, **kwargs):
	if created:
		UserProfile.objects.create(user=instance)


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


