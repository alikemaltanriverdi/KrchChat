from django.urls import path
from django.urls import re_path

from . import consumers

websocket_urlpatterns = [
    path('ws/chat', consumers.ChatConsumer.as_asgi()),
    path('ws/listen', consumers.TranscriptConsumer.as_asgi()),
]