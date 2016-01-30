from django.shortcuts import render
from django.http import HttpResponse
import os
from .models import Greeting
import json
import sys
from isbntools.app import *

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
    meta_dict = meta(isbn, service='goob')
    return HttpResponse(json.dumps(meta_dict), content_type="application/json")
