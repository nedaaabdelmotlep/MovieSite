import re
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import SingleAccount


def password_is_valid(password: str):
    if len(password) < 8:
        return "Password must be at least 8 characters long."
    if not re.search(r"[@#$]", password):
        return "Password must contain at least one special character (@, #, $)."
    return None


@api_view(["POST"])
def signup(request):
    username = (request.data.get("username") or "").strip()
    password = (request.data.get("password") or "").strip()

    errors = {}
    if not username:
        errors["username"] = ["Username is required."]
    if not password:
        errors["password"] = ["Password is required."]
    if errors:
        return Response(errors, status=status.HTTP_400_BAD_REQUEST)

    password_error = password_is_valid(password)
    if password_error:
        return Response({"password": [password_error]}, status=status.HTTP_400_BAD_REQUEST)

    if SingleAccount.objects.filter(username__iexact=username).exists():
        return Response({"username": ["Username already exists."]}, status=status.HTTP_400_BAD_REQUEST)

    account = SingleAccount.objects.create(username=username, password=password)

    return Response(
        {"message": "Signup successful", "user": {"username": account.username}},
        status=status.HTTP_201_CREATED
    )


@api_view(["POST"])
def login(request):
    username = (request.data.get("username") or "").strip()
    password = (request.data.get("password") or "").strip()

    errors = {}
    if not username:
        errors["username"] = ["Username is required."]
    if not password:
        errors["password"] = ["Password is required."]
    if errors:
        return Response(errors, status=status.HTTP_400_BAD_REQUEST)

    try:
        account = SingleAccount.objects.get(username__iexact=username)
    except SingleAccount.DoesNotExist:
        return Response({"username": ["Username not found."]}, status=status.HTTP_401_UNAUTHORIZED)

    if password != account.password:
        return Response({"password": ["Incorrect password."]}, status=status.HTTP_401_UNAUTHORIZED)

    return Response(
        {"message": "Login success", "user": {"username": account.username}},
        status=status.HTTP_200_OK
    )
