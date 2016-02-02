from django.shortcuts import render
from django.http import HttpResponse
import os
from .models import Greeting
import json
import sys
from django.http import JsonResponse

from django.conf import settings
from django.conf.urls.static import static

import requests
from bs4 import BeautifulSoup
import cgi
import re

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

def getBookRecommendations(request, work):

 import pdb
 r = requests.get("http://www.librarything.com/title/"+work)
 soup = BeautifulSoup(r.text)
 recommendations = soup.find("ol", {"class": "memberrecommendations"}).find_all("a", href = re.compile("^(/work/)|^(/author/)"))
 works = []
 for x in recommendations[:6:2]:
	works.append((x.text, ""))
 index = 0
 for x in recommendations[1:6:2]:
	works[index] = (works[index][0], x.text)
	index += 1
  
    return JsonResponse({'recommendations': works })

def getResults(request, works):
    import pdb
    
    works = works.split(',')
    for work in works:
      r = requests.get("http://www.librarything.com/title/"+work )
      soup = BeautifulSoup(r.text)
      recommendations = soup.find("ol", {"class": "memberrecommendations"}).find_all("a", href = re.compile("^(/work/)|^(/author/)"))
      works = []
      for x in recommendations[::2]:
	works.append((x.text, ""))
	index = 0
      for x in recommendations[1::2]:
	works[index] = (works[index][0], x.text)
	index += 1
    return JsonResponse({'results': works})
