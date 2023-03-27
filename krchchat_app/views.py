from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect

# Create your views here.
from krchchat_app.models import Conversation


@login_required
def messages_page(request):
    if not request.user.is_authenticated:
        return redirect("login-user")
    
    conversations = Conversation.objects.by_user(user=request.user).prefetch_related('chatmessage_conversation').order_by('timestamp')
    context = {
        'Conversations': conversations
    }
    return render(request, 'messages.html', context)
