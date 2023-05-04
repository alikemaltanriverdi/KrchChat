"""KrchChat URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.contrib.auth.views import LoginView, LogoutView
from django.conf import settings
from django.conf.urls.static import static

from krchchat_app import views

urlpatterns = [
    #AWS Health Check
    path('health', views.health_check),
    path('', include('krchchat_app.urls')),
    path('admin/', admin.site.urls),
    path('chat/', include('krchchat_app.urls')),
    # login-section
    path('login/', LoginView.as_view(template_name='LoginPage.html'), name="login"),
    path("logout/", views.logout_view, name="logout"),
    path("register", views.register_request, name="register"),
    path('online/', views.user_online, name='user_online'),
    path('offline/', views.user_offline, name='user_offline'),
    path('online_status/', views.friends_online_status, name='friends_online_status'),
    path('conversations/', views.apiCreateConversation, name='conversations')
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

