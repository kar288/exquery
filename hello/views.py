from django.shortcuts import render
from django.http import HttpResponse
import os
from .models import Greeting
import json
import sys
from django.http import JsonResponse

from django.conf import settings
from django.conf.urls.static import static

# Create your views here.
def index(request):
    # return HttpResponse('Hello from Python!')
    path = settings.STATICFILES_DIRS[0] + '/build'  # insert the path to your directory
    file_list = sorted(os.listdir(path))
    # file_list = '';
    print(file_list)
    # for (f in file_list):
        # f = path +
    return render(request, 'index.html', {'static_files': file_list})


def db(request):
    greeting = Greeting()
    greeting.save()

    greetings = Greeting.objects.all()

    return render(request, 'db.html', {'greetings': greetings})

def getBookInfo(request, isbn):
    return JsonResponse({'foo':'bar'})

def getBookRecommendations(request, isbn):
    return JsonResponse({'recommendations': ['9780312422288', '9781429902526', '9780312315948']})

def getResults(request, isbns):
    isbns = isbns.split(',')
    for isbn in isbns:
        print(isbn)
    return JsonResponse({'results': [
        '9780312422288',
        # '9781429902526',
        # '9780312315948',
        # '9788420405384',
        # '9789681902902',
        # '9781400032716',
        '9781473205321',
        '9783453601024'
    ]})
