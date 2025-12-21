from django.urls import path
from .views import signup, login

urlpatterns = [
    path("register/", signup),
    path("login/", login),
]
