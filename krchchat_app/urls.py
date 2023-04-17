from django.urls import path
from . import views

urlpatterns = [
    path('', views.messages_page),
    path('handleFriendClick/', views.handleFriendClick),
]
