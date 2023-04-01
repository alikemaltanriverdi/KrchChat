from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth import login
from django.contrib import messages
# Create your views here.
from krchchat_app.models import Conversation, User


@login_required
def messages_page(request):
    if not request.user.is_authenticated:
        return redirect("login-user")
    
    conversations = Conversation.objects.by_user(user=request.user).prefetch_related('chatmessage_conversation').order_by('timestamp')
    friends = User.objects.prefetch_related('conversation_second_person').exclude(username=request.user.username).all()
    context = {
        'conversations': conversations,
        'friends': friends
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
