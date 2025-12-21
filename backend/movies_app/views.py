from django.http import JsonResponse

def movie_list(request):
    return JsonResponse({"message": "movies endpoint working"})
