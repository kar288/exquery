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

def getBookRecommendations(request, isbn):
    return JsonResponse({'recommendations': [
          '9780312422288',
          '9781429902526',
          '9780312315948']
    })

def getBookRecommendationsWithTitle(request, title):

  import pdb

  work = title
  works = []
  if not work == "":
    r = requests.get("http://www.librarything.com/title/"+work)
    print(r.text)
    soup = BeautifulSoup(r.text)
    check = soup.find("ol", {"class": "memberrecommendations"})
    if check is not None:
      recommendations = check.find_all("a", href = re.compile("^(/work/)|^(/author/)"))
      for x in recommendations[:6:2]:
	works.append((x.text, ""))
	index = 0
      for x in recommendations[1:6:2]:
	works[index] = (works[index][0], x.text)
	index += 1
  else:
    print("Empty title!")
    print None

  PublicationDate = []
  Authors = []
  Category = []
  MediaType = []
  Keywords = []

  for w in works:
    work = ""
    work = w[0].replace(" ", "+") + "+" + w[1].replace(" ", "+")
    r = requests.get("http://katalog.stbib-koeln.de:8983/solr/select?indent=on&version=2.2&q="+work+"&fq=MaterialType%3ABuch&start=0&rows=1&fl=*%2Cscore&qt=standard&wt=standard&explainOther=&hl.fl=")
    soup2 = BeautifulSoup(r.text)
    check = soup2.find("arr",{"name":"DateOfPublication"})
    if check != None:
      counter = 0;
      for item in check:
	if item != None and counter < 1:
	  PublicationDate.append(item.text)
	  counter += 1

    check = soup2.find("arr",{"name":"Author"})
    if check != None:
      counter = 0;
      for item in check:
	if item != None and counter < 1:
	  Authors.append(item.text)
	  counter += 1

    check = soup2.find("arr",{"name":"SubjectHeading"})
    if check != None:
      counter = 0;
      for item in check:
	if item != None and counter < 1:
	  Category.append(item.text)
	  counter += 1

    check = soup2.find("arr",{"name":"MaterialType"})
    if check != None:
      counter = 0;
      for item in check:
	if item != None and counter < 1:
	  MediaType.append(item.text)
	  counter += 1

    check = soup2.find("arr",{"name":"text_auto"})
    if check != None:
      it = check.find_all("str")
      for item in it:
	if item != None:
	  Keywords.append(item.text)



  return JsonResponse({'recommendations': works, 'PublicationDate': PublicationDate, 'Authors': Authors, 'Category': Category, 'MediaType': MediaType, 'Keywords': Keywords})


def getBookRecommendationsWithISBN(request, isbn):

  import pdb
  print("You reqeusted" + str(isbn))

  work = str(isbn)
  works = []
  if not work == "":
    r = requests.get("http://www.librarything.com/isbn/"+work)
    soup = BeautifulSoup(r.text)
    check = soup.find("ol", {"class": "memberrecommendations"})
    if check is not None:
      recommendations = check.find_all("a", href = re.compile("^(/work/)|^(/author/)"))
      for x in recommendations[:6:2]:
	works.append((x.text, ""))
	index = 0
      for x in recommendations[1:6:2]:
	works[index] = (works[index][0], x.text)
	index += 1
  else:
    print("Empty title!")

  katalog_query_url = "http://katalog.stbib-koeln.de:8983/solr/select/?q="
  PublicationDate = []
  Authors = []
  Category = []
  MediaType = []
  Keywords = []

  for w in works:
    work = ""
    work = w[0].replace(" ", "+") + "+" + w[1].replace(" ", "+")
    r = requests.get("http://katalog.stbib-koeln.de:8983/solr/select?indent=on&version=2.2&q="+work+"&fq=MaterialType%3ABuch&start=0&rows=1&fl=*%2Cscore&qt=standard&wt=standard&explainOther=&hl.fl=")
    soup2 = BeautifulSoup(r.text)
    check = soup2.find("arr",{"name":"DateOfPublication"})
    if check != None:
      counter = 0;
      for item in check:
	if item != None and counter < 1:
	  PublicationDate.append(item.text)
	  counter += 1

    check = soup2.find("arr",{"name":"Author"})
    if check != None:
      counter = 0;
      for item in check:
	if item != None and counter < 1:
	  Authors.append(item.text)
	  counter += 1

    check = soup2.find("arr",{"name":"SubjectHeading"})
    if check != None:
      it = check.find_all("str")
      for item in it:
	if item != None:
	  Category.append(item.text)

    check = soup2.find("arr",{"name":"MaterialType"})
    if check != None:
      counter = 0;
      for item in check:
	if item != None and counter < 1:
	  MediaType.append(item.text)
	  counter += 1

    check = soup2.find("arr",{"name":"text_auto"})
    if check != None:
      it = check.find_all("str")
      for item in it:
	if item != None:
	  Keywords.append(item.text)

  return JsonResponse({'recommendations': works, 'PublicationDate': PublicationDate, 'Authors': Authors, 'Category': Category, 'MediaType': MediaType, 'Keywords': Keywords})

def getResults2(request):
    els = [{
        'Title': 'title5',
        'ISBN': '21421',
        'Author': 'some author',
        'Category': 'category3',
        'Year': 4,
        # 'Media Type': 'book',
        'Description': 'blajdklfjadkljffda',
        'Keywords': ['key1', 'words', 'here'],
        'Thumbnail': 'http://books.google.de/books/content?id=6uLtnQEACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api',
    }, {
        'Title': 'title',
        'ISBN': '214213',
        'Author': 'some author2',
        'Year': 3,
        'Category': 'category1',
        # 'Media Type': 'book',
        'Description': 'blajdklfjadkljffda',
        'Keywords': ['key1', 'words', 'here1'],
        'Thumbnail': 'http://books.google.de/books/content?id=6uLtnQEACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api',
    }, {
        'Title': 'title2',
        'ISBN': '214212',
        'Author': 'some autho3r',
        'Category': 'category2',
        'Year': 2,
        # 'Media Type': 'book',
        'Description': 'blajdklfjadkljffda',
        'Keywords': ['key2', 'words2', 'here'],
        'Thumbnail': 'http://books.google.de/books/content?id=6uLtnQEACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api',
    }, {
        'Title': 'title1',
        'ISBN': '214213',
        'Author': 'some au2thor',
        'Keywords': ['key1', 'words1', 'here1'],
        'Category': 'category1',
        'Year': 1,
        # 'Media Type': 'book',
        'Description': 'blajdklfjadkljffda',
        'Thumbnail': 'http://books.google.de/books/content?id=6uLtnQEACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api',
    }]
    return JsonResponse({'results': els})

def getResults(request, PublicationDate, Authors, Category, MediaType, Keywords):
   #import pdb

    #works = works.split(',')
    #for work in works:
     # r = requests.get("http://www.librarything.com/title/"+work )
      #soup = BeautifulSoup(r.text)
      #recommendations = soup.find("ol", {"class": "memberrecommendations"}).find_all("a", href = re.compile("^(/work/)|^(/author/)"))
      #works = []
      #for x in recommendations[::2]:
	#works.append((x.text, ""))
	#index = 0
      #for x in recommendations[1::2]:
	#works[index] = (works[index][0], x.text)
	#index += 1

    alls = ""
    keywords = ""

    if PublicationDate != None:
      for item in PublicationDate:
	alls += "DateOfPublication:"+item+"+"
    alls = alls[:-1]

    if Authors != None:
      for item in Authors:
	alls +="Author:"+item+"+"
    alls = alls.replace(", "," ")
    alls = alls[:-1]

    if Category != None:
      for item in Category:
	alls += "SubjectHeading:"+item+"+"
    alls = alls[:-1]

    if MediaType != None:
      for item in MediaType:
	alls += "MaterialType:"+item+"+"
    alls = alls[:-1]

    if Keywords != None:
      for item in Keywords:
	keywords += item+"+"
    keywords = keywords.replace(", ","+")
    keywords = keywords[:-1]

    ISBNs = []
    query = requests.get("http://katalog.stbib-koeln.de:8983/solr/select?indent=on&version=2.2&q="+keywords+"&fq="+alls+"&start=0&rows=10&fl=*%2Cscore&qt=standard&wt=standard&explainOther=&hl.fl=")
    soup = BeautifulSoup(query.text)
    check = soup.find("arr",{"name":"ISBN"})
    if check != None:
      for item in check:
	ISBNs.append(item.text)


    return JsonResponse({'results': ISBNs})
