from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import SingleAccount

@api_view(["POST"])
def signup(request):
    username = (request.data.get("username") or "").strip()
    password = (request.data.get("password") or "").strip()

    if not username or not password:
        return Response({"message": "Username and password are required"}, status=status.HTTP_400_BAD_REQUEST)

    account = SingleAccount.objects.first()

    # أول مرة
    if account is None:
        SingleAccount.objects.create(username=username, password=password)
        return Response({"message": "Data changed successfully"}, status=status.HTTP_200_OK)

    # تغيير البيانات
    account.username = username
    account.password = password
    account.save()
    return Response({"message": "Data changed successfully"}, status=status.HTTP_200_OK)


@api_view(["POST"])
def login(request):
    username = (request.data.get("username") or "").strip()
    password = (request.data.get("password") or "").strip()

    if not username or not password:
        return Response({"message": "Username and password are required"}, status=status.HTTP_400_BAD_REQUEST)

    account = SingleAccount.objects.first()
    if account is None:
        return Response({"message": "No account found. Please sign up first."}, status=status.HTTP_404_NOT_FOUND)

    if username != account.username:
        return Response({"message": "Username not found"}, status=status.HTTP_401_UNAUTHORIZED)

    if password != account.password:
        return Response({"message": "Password failed"}, status=status.HTTP_401_UNAUTHORIZED)

    return Response({"message": "Login success"}, status=status.HTTP_200_OK)
