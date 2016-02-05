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

  #step1: title should have the format: title_item + author_item

  #step2: use librarything to get recommendations isbns list

  works = []
  r3 = requests.get("http://www.librarything.com/title/"+title)
  soup2 = BeautifulSoup(r3.text)
  check2 = soup2.find("ol", {"class": "memberrecommendations"})
  if check2 is not None:
    recommendations = check2.find_all("a", href = re.compile("^(/work/)|^(/author/)"))
    for x in recommendations[:6:2]:
      works.append((x.text, ""))
      index = 0
    for x in recommendations[1:6:2]:
      works[index] = (works[index][0], x.text)
      index += 1


  #step3: get isbns from solr
  results = []
  for w in works:
    work = []
    #work = (w[0]+"+"+w[1]).replace("[^0-9a-zA-Z]+"," ")
    work = re.sub("[^0-9a-zA-Z]+"," ",w[0])+"+"+re.sub("[^0-9a-zA-Z]+"," ",w[1])
    req = requests.get("http://katalog.stbib-koeln.de:8983/solr/select?indent=on&version=2.2&q="+work+"&fq=MaterialType%3ABuch&start=0&rows=1&fl=*%2Cscore&qt=standard&wt=standard&explainOther=&hl.fl=")
    soupreq1 = BeautifulSoup(req.text)
    checkreq1 = soupreq1.find("arr",{"name":"ISBN"})
    nisbn = checkreq1.text.rsplit(' ',1)[0]
    if " " in nisbn:
      nisbn = nisbn.rsplit(' ',1)[0]
    #print(nisbn)

  #step4: get othe data from solr (year, media type = BUC, keywords)
    checkreq11 = soupreq1.find("arr",{"name":"DateOfPublication"})
    #print(checkreq11)
    checkreq12 =soupreq1.find("arr",{"name":"text_auto"})
    nkeywords = []
    it = checkreq12.find_all("str")
    for i in it:
      nkeywords.append(i.text)
    #print(nkeywords)

  #step5: get other data from googleapis (author, title, categories, description, thumbnail)
    req2 = requests.get("https://www.googleapis.com/books/v1/volumes?q=isbn:"+nisbn)
    content2 = req2.text
    t2 = json.loads(content2)

    if "items" in t2:
      if "volumeInfo" in t2["items"][0]:
	if "authors" in t2["items"][0]["volumeInfo"]:
	  nauthor = t2["items"][0]["volumeInfo"]["authors"][0]
	else:
	  nauthor = " "
      else:
	nauthor = " "
    else:
      nauthor = " "

    if "items" in t2:
      if "volumeInfo" in t2["items"][0]:
	if "title" in t2["items"][0]["volumeInfo"]:
	  ntitle = t2["items"][0]["volumeInfo"]["title"]
	else:
	  ntitle = " "
      else:
	ntitle = " "
    else:
      ntitle = " "

    if "items" in t2:
      if "volumeInfo" in t2["items"][0]:
	if "categories" in t2["items"][0]["volumeInfo"]:
	  ncategories = t2["items"][0]["volumeInfo"]["categories"][0]
	else:
	  ncategories = " "
      else:
	ncategories = " "
    else:
      ncategories = " "

    if "items" in t2:
      if "volumeInfo" in t2["items"][0]:
	if "description" in t2["items"][0]["volumeInfo"]:
	  ndescription = t2["items"][0]["volumeInfo"]["description"]
	else:
	  ndescription = " "
      else:
	ndescription = " "
    else:
      ndescription = " "

    if "items" in t2:
      if "volumeInfo" in t2["items"][0]:
	if "imageLinks" in t2["items"][0]["volumeInfo"]:
	  if "thumbnail" in t2["items"][0]["volumeInfo"]["imageLinks"]:
	    nthumbnail = t2["items"][0]["volumeInfo"]["imageLinks"]["thumbnail"]
	  else:
	    nthumbnail = " "
	else:
	  nthumbnail = " "
      else:
	nthumbnail = " "
    else:
      nthumbnail = " "

  #step6: make json file with data
    data = {}
    data['Title'] = ntitle;
    data['ISBN'] = nisbn;
    data['Author'] = nauthor;
    data['Category'] = ncategories;
    data['Year'] = checkreq11.text;
    data['Media Type'] = 'book';
    data['Description'] = ndescription;
    data['Keywords'] = nkeywords;
    data['Thumbnail'] = nthumbnail;
    # json_data = json.dumps(data)
    print(data)
    results.append(data)

  return JsonResponse({'results': results})


def getBookRecommendationsWithISBN(request, isbn):

  import pdb
  #step1: from isbn to title+author

  # r = urllib.urlopen("https://www.googleapis.com/books/v1/volumes?q=isbn:"+isbn)
  r = requests.get("https://www.googleapis.com/books/v1/volumes?q=isbn:"+isbn)
  content = r.text
  t = json.loads(content)
  if "items" in t:
    if "volumeInfo" in t["items"][0]:
      if "authors" in t["items"][0]["volumeInfo"]:
	author = t["items"][0]["volumeInfo"]["authors"][0]
      else:
	author = " "
    else:
      author = " "
  else:
    author = " "

  if "items" in t:
    if "volumeInfo" in t["items"][0]:
      if "title" in t["items"][0]["volumeInfo"]:
	title = t["items"][0]["volumeInfo"]["title"]
      else:
	title = " "
    else:
      title = " "
  else:
    title = " "

  searchfield = title+"+"+author

  #step2: use searchfield with librarything and get new work link
  #r2 = requests.get("http://www.librarything.com/title/"+searchfield)
  #soup = BeautifulSoup(r2.text)

  #check = soup.find("link", {"rel": "canonical"})
  #if check is not None:
  # link = check['href']

  #step3: use librarything to get recommendations isbns list

  works = []
  r3 = requests.get("http://www.librarything.com/title/"+searchfield)
  soup2 = BeautifulSoup(r3.text)
  check2 = soup2.find("ol", {"class": "memberrecommendations"})
  if check2 is not None:
    recommendations = check2.find_all("a", href = re.compile("^(/work/)|^(/author/)"))
    for x in recommendations[:6:2]:
      works.append((x.text, ""))
      index = 0
    for x in recommendations[1:6:2]:
      works[index] = (works[index][0], x.text)
      index += 1


  #step4: get isbns from solr
  results = []
  for w in works:
    work = []
    #work = (w[0]+"+"+w[1]).replace("[^0-9a-zA-Z]+"," ")
    work = re.sub("[^0-9a-zA-Z]+"," ",w[0])+"+"+re.sub("[^0-9a-zA-Z]+"," ",w[1])
    req = requests.get("http://katalog.stbib-koeln.de:8983/solr/select?indent=on&version=2.2&q="+work+"&fq=MaterialType%3ABuch&start=0&rows=1&fl=*%2Cscore&qt=standard&wt=standard&explainOther=&hl.fl=")
    soupreq1 = BeautifulSoup(req.text)
    checkreq1 = soupreq1.find("arr",{"name":"ISBN"})
    nisbn = checkreq1.text.rsplit(' ',1)[0]
    if " " in nisbn:
      nisbn = nisbn.rsplit(' ',1)[0]
    #print(nisbn)

  #step5: get othe data from solr (year, media type = BUC, keywords)
    checkreq11 = soupreq1.find("arr",{"name":"DateOfPublication"})
    #print(checkreq11)
    checkreq12 =soupreq1.find("arr",{"name":"text_auto"})
    nkeywords = []
    it = checkreq12.find_all("str")
    for i in it:
      nkeywords.append(i.text)
    #print(nkeywords)

  #step6: get other data from googleapis (author, title, categories, description, thumbnail)
    req2 = requests.get("https://www.googleapis.com/books/v1/volumes?q=isbn:"+nisbn)
    content2 = req2.text
    t2 = json.loads(content2)

    if "items" in t2:
      if "volumeInfo" in t2["items"][0]:
	if "authors" in t2["items"][0]["volumeInfo"]:
	  nauthor = t2["items"][0]["volumeInfo"]["authors"][0]
	else:
	  nauthor = " "
      else:
	nauthor = " "
    else:
      nauthor = " "

    if "items" in t2:
      if "volumeInfo" in t2["items"][0]:
	if "title" in t2["items"][0]["volumeInfo"]:
	  ntitle = t2["items"][0]["volumeInfo"]["title"]
	else:
	  ntitle = " "
      else:
	ntitle = " "
    else:
      ntitle = " "

    if "items" in t2:
      if "volumeInfo" in t2["items"][0]:
	if "categories" in t2["items"][0]["volumeInfo"]:
	  ncategories = t2["items"][0]["volumeInfo"]["categories"][0]
	else:
	  ncategories = " "
      else:
	ncategories = " "
    else:
      ncategories = " "

    if "items" in t2:
      if "volumeInfo" in t2["items"][0]:
	if "description" in t2["items"][0]["volumeInfo"]:
	  ndescription = t2["items"][0]["volumeInfo"]["description"]
	else:
	  ndescription = " "
      else:
	ndescription = " "
    else:
      ndescription = " "

    if "items" in t2:
      if "volumeInfo" in t2["items"][0]:
	if "imageLinks" in t2["items"][0]["volumeInfo"]:
	  if "thumbnail" in t2["items"][0]["volumeInfo"]["imageLinks"]:
	    nthumbnail = t2["items"][0]["volumeInfo"]["imageLinks"]["thumbnail"]
	  else:
	    nthumbnail = " "
	else:
	  nthumbnail = " "
      else:
	nthumbnail = " "
    else:
      nthumbnail = " "

#step7: make json file with data
    data = {}
    data['Title'] = ntitle;
    data['ISBN'] = nisbn;
    data['Author'] = nauthor;
    data['Category'] = ncategories;
    data['Year'] = checkreq11.text;
    data['Media Type'] = 'book';
    data['Description'] = ndescription;
    data['Keywords'] = nkeywords;
    data['Thumbnail'] = nthumbnail;
    # json_data = json.dumps(data)
    results.append(data)

  return JsonResponse({'results': results})

def getResults2(request):
    els = [{
        'Title': 'title5',
        'ISBN': '21421',
        'Author': 'some author',
        'Category': 'category3',
        'Year': 4,
        'Media Type': 'book',
        'Description': 'blajdklfjadkljffda',
        'Keywords': ['key1', 'words', 'here'],
        'Thumbnail': 'http://books.google.de/books/content?id=6uLtnQEACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api',
    }, {
        'Title': 'title',
        'ISBN': '214213',
        'Author': 'some author2',
        'Year': 3,
        'Category': 'category1',
        'Media Type': 'book',
        'Description': 'blajdklfjadkljffda',
        'Keywords': ['key1', 'words', 'here1'],
        'Thumbnail': 'http://books.google.de/books/content?id=6uLtnQEACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api',
    }, {
        'Title': 'title2',
        'ISBN': '214212',
        'Author': 'some autho3r',
        'Category': 'category2',
        'Year': 2,
        'Media Type': 'book',
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
        'Media Type': 'book',
        'Description': 'blajdklfjadkljffda',
        'Thumbnail': 'http://books.google.de/books/content?id=6uLtnQEACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api',
    }]
    return JsonResponse({'results': els})

def getResults(request, isbns):
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


    return JsonResponse({'results': list})
