from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth import login, logout
from django.contrib import messages
# Create your views here.
from krchchat_app.models import Conversation, User, UserProfile
from django.db.models import Q
import traceback
from django.http import JsonResponse

from django.http import HttpResponse


def health_check(request):
    return HttpResponse(status=200)


@login_required
def user_online(request):
    user_profile = UserProfile.objects.get(user=request.user)
    user_profile.is_online = True
    user_profile.save()


@login_required
def user_offline(request):
    user_profile = UserProfile.objects.get(user=request.user)
    user_profile.is_online = False
    user_profile.save()


def friends_online_status(request):
    friends = User.objects.exclude(username=request.user.username).all()
    online_friends = UserProfile.objects.filter(user__in=friends, is_online=True)
    online_friend_usernames = [profile.user.username for profile in online_friends]
    return JsonResponse({'online_users': online_friend_usernames})
    

def logout_view(request):
    user_offline(request)
    logout(request)
    return redirect("/")


@login_required
def messages_page(request):
    if not request.user.is_authenticated:
        return redirect("login")
    
    user_online(request)
    conversationId = -1
    if request.method == "POST":
        data = dict(request.POST)

        friend_id = int(data['friend'][0])
        conversationId = getConversationId(request.user.id, friend_id)
        if conversationId == -1:
            conversationId = createConversation(request.user.id, friend_id)


    conversations = Conversation.objects.by_user(user=request.user).prefetch_related('chatmessage_conversation').order_by('timestamp')
    friends = User.objects.prefetch_related('conversation_second_person').exclude(username=request.user.username).all()
    
    online_users = UserProfile.objects.filter(user__in=friends, is_online=True).all()
    context = {
        'conversations': conversations,
        'friends': friends,
        'conversationId': conversationId,
        'online_users': online_users
    }
    return render(request, 'messages.html', context)


def register_request(request):
    if request.method == "POST":
        form = UserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            messages.success(request, "Registration successful." )
            return redirect("/")
        messages.error(request, "Unsuccessful registration. Invalid information.")
    form = UserCreationForm()
    return render(request=request, template_name="register.html", context={"register_form": form})


def getConversationId(user, friend):
    id = -1
    try:
        id = Conversation.objects.by_user(user=user).filter(Q(first_person=friend) | Q(second_person=friend)).get().id
    except Exception:
        id = -1
    return id


def createConversation(user, friend):
    conversation = Conversation(first_person_id=user, second_person_id=friend)
    conversation.save()
    return conversation.id