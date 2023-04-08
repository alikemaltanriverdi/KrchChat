from django.urls import path
from django.urls import re_path

from . import consumers

websocket_urlpatterns = [
    path('', consumers.ChatConsumer.as_asgi()),
    path('chat/', consumers.ChatConsumer.as_asgi()),
    re_path(r'listen', consumers.TranscriptConsumer.as_asgi()),
]