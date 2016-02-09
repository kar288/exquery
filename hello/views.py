from django.shortcuts import render
from django.http import HttpResponse
import os
from .models import Greeting
import json
import sys
from django.http import JsonResponse
import time

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

  #step4: get other data from solr (year, media type = BUC, keywords)
    #checkreq11 = soupreq1.find("arr",{"name":"DateOfPublication"})
    ##print(checkreq11)
    #checkreq12 =soupreq1.find("arr",{"name":"text_auto"})
    #nkeywords = []
    #it = checkreq12.find_all("str")
    #for i in it:
      #nkeywords.append(i.text)
    ##print(nkeywords)

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


    if ntitle == " ":
      ntitle = soupreq1.find("arr",{"name":"Title"}).find("str").text

    if nauthor == " ":
      nauthor = soupreq1.find("arr",{"name":"Author"}).find("str").text
    #if "items" in t2:
      #if "volumeInfo" in t2["items"][0]:
	#if "categories" in t2["items"][0]["volumeInfo"]:
	  #ncategories = t2["items"][0]["volumeInfo"]["categories"][0]
	#else:
	  #ncategories = " "
      #else:
	#ncategories = " "
    #else:
      #ncategories = " "

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

    if ndescription == " ":
      if soupreq1.find("arr",{"name":"Abstract"}) != None:
	nn = soupreq1.find("arr",{"name":"Abstract"}).find("str")
	ndescription = nn.text

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
    data['Category'] = ' ';
    data['Year'] = ' ';
    data['Media Type'] = 'book';
    data['Description'] = ndescription;
    data['Keywords'] = ' ';
    data['Thumbnail'] = nthumbnail;
    # json_data = json.dumps(data)
    print(data)
    results.append(data)

  return JsonResponse({'results': results})

def getBookRecommendationsWithISBN2(request, isbn):
    results = []
    r = requests.get("https://www.googleapis.com/books/v1/volumes?q=isbn:"+isbn)
    data = json.loads(r.text)
    print(data)
    if not 'totalItems' in data:
        return JsonResponse({'results': results})
    if data['totalItems'] < 1:
        return JsonResponse({'results': results})
    author = ''
    title = ''
    try:
        volumeInfo = data['items'][0]['volumeInfo']
        author = volumeInfo['authors'][0]
        title = volumeInfo['title']
    except KeyError: pass
    print(title)
    print(author)

    rlt = requests.get("http://www.librarything.com/title/"+ title + '+' + author)
    soup = BeautifulSoup(rlt.text)
    check = soup.find("ol", {"class": "memberrecommendations"})
    if check is not None:
      recommendations = check.find_all("a", href = re.compile("^(/work/)|^(/author/)"))
      for recommendation in recommendations:
          href = recommendation['href']
          if 'work' in href:
              print recommendation.text
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

  ##step5: get othe data from solr (year, media type = BUC, keywords)
    #checkreq11 = soupreq1.find("arr",{"name":"DateOfPublication"})
    ##print(checkreq11)
    #checkreq12 =soupreq1.find("arr",{"name":"text_auto"})
    #nkeywords = []
    #it = checkreq12.find_all("str")
    #for i in it:
      #nkeywords.append(i.text)
    ##print(nkeywords)

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

    if ntitle == " ":
      ntitle = soupreq1.find("arr",{"name":"Title"}).find("str").text

    if nauthor == " ":
      nauthor = soupreq1.find("arr",{"name":"Author"}).find("str").text

    #if "items" in t2:
      #if "volumeInfo" in t2["items"][0]:
	#if "categories" in t2["items"][0]["volumeInfo"]:
	  #ncategories = t2["items"][0]["volumeInfo"]["categories"][0]
	#else:
	  #ncategories = " "
      #else:
	#ncategories = " "
    #else:
      #ncategories = " "

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

    if ndescription == " ":
      if soupreq1.find("arr",{"name":"Abstract"}) != None:
	nn = soupreq1.find("arr",{"name":"Abstract"}).find("str")
	ndescription = nn.text

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
    data['Category'] = ' ';
    data['Year'] = ' ';
    data['Media Type'] = 'book';
    data['Description'] = ndescription;
    data['Keywords'] = ' ';
    data['Thumbnail'] = nthumbnail;
    # json_data = json.dumps(data)
    results.append(data)

  return JsonResponse({'results': results})


def getResults2(request, isbns):
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

def getResults3(request, isbns):
    return JsonResponse({'results': []})

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
    ISBNs = []
    results = []
    new_isbns = []
    words = isbns.split(",")
    for word in words:
      new_isbns.append(word)


    for isbn in new_isbns:

      nkeywords = []

    #step 1-1: from isbn to title+author
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


    #step 1-2: after having the title+author we search in solr for the item and then get all other item fields through solr and googleapis of the initial isbns

      work = re.sub("[^0-9a-zA-Z]+"," ",title)+"+"+re.sub("[^0-9a-zA-Z]+"," ",author)
      req = requests.get("http://katalog.stbib-koeln.de:8983/solr/select?indent=on&version=2.2&q="+work+"&fq=MaterialType%3ABuch&start=0&rows=1&fl=*%2Cscore&qt=standard&wt=standard&explainOther=&hl.fl=")
      soupreq1 = BeautifulSoup(req.text)

      if soupreq1.find("arr",{"name":"ISBN"}) != None:
	  checkreq1 = soupreq1.find("arr",{"name":"ISBN"})
	  nisbn = checkreq1.text.rsplit(' ',1)[0]
	  if " " in nisbn:
	    nisbn = nisbn.rsplit(' ',1)[0]
	  nisbn = checkreq1.text.rsplit(' ',1)[0]
	  if " " in nisbn:
	    nisbn = nisbn.rsplit(' ',1)[0]
	  checkreq11 = soupreq1.find("arr",{"name":"DateOfPublication"})
	  year = checkreq11.text
	  checkreq12 =soupreq1.find("arr",{"name":"text_auto"})
	  it = checkreq12.find_all("str")
	  for i in it:
	    nkeywords.append(i.text)
	  checkreq13 = soupreq1.find("arr",{"name":"MaterialType"}).find("str")
	  mediatype = checkreq13.text

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

	  keywordsn = ""
	  for n in nkeywords:
	    n = re.sub("[^0-9a-zA-Z]+"," ",n)
	    keywordsn += n + "+"
	  keywordsn = keywordsn[:-1]
	  ntitle = re.sub("[^0-9a-zA-Z]+"," ",ntitle)


    #step2: search by every field in solr
	  #search solr by titles
	  checks1 = []
	  checks2 = []
	  checks3 = []
	  query1 = requests.get("http://katalog.stbib-koeln.de:8983/solr/select?rows=10&q="+ntitle)
	  soup1 = BeautifulSoup(query1.text)
	  check1 = soup1.find_all("arr",{"name":"ISBN"})
	  if check1 != None and (char.isdigit() for char in check1):
	    for item1 in check1:
	      ISBNs.append(item1.text)
	      c11 =soup1.find("arr",{"name":"text_auto"})
	      nkeywords2 = []
	      it2 = c11.find_all("str")
	      for i2 in it2:
		nkeywords2.append(i2.text)
	      checks2.append(nkeywords2)
	      c111 = soup1.find("arr",{"name":"MaterialType"}).find("str")
	      #if " " in c111.text:
		#c111.text = c111.text.split(' ')[0]
		#checks3.append(c111.text)
	      #elif "/" in c111.text:
		#c111.text = c111.text.split('/')[0]
		#checks3.append(c111.text)
	      #else:
		#checks3.append(c111.text)
	      checks3.append(c111.text)

	  #search solr by keywords
	  query2 = requests.get("http://katalog.stbib-koeln.de:8983/solr/select?rows=10&q="+keywordsn)
	  soup2 = BeautifulSoup(query2.text)
	  check2 = soup2.find_all("arr",{"name":"ISBN"})
	  if check2 != None and (c.isdigit() for c in check2):
	    for item2 in check2:
	      ISBNs.append(item2.text)
	      c22 =soup2.find("arr",{"name":"text_auto"})
	      nkeywords3 = []
	      it3 = c22.find_all("str")
	      for i3 in it3:
		nkeywords3.append(i3.text)
	      checks2.append(nkeywords3)
	      c222 = soup2.find("arr",{"name":"MaterialType"}).find("str")
	      checks3.append(c222.text)

	  #search solr by authors
	  query3 = requests.get("http://katalog.stbib-koeln.de:8983/solr/select?rows=10&q="+nauthor)
	  soup3 = BeautifulSoup(query3.text)
	  check3 = soup3.find_all("arr",{"name":"ISBN"})
	  if check3 != None and (char.isdigit() for char in check3):
	    for item3 in check3:
	      ISBNs.append(item3.text)
	      c33 =soup3.find("arr",{"name":"text_auto"})
	      nkeywords4 = []
	      it4 = c33.find_all("str")
	      for i4 in it4:
		nkeywords4.append(i4.text)
	      checks2.append(nkeywords4)
	      c333 = soup3.find("arr",{"name":"MaterialType"}).find("str")
	      checks3.append(c333.text)

	  #search solr Buch and filter by year
	  query4 = requests.get("http://katalog.stbib-koeln.de:8983/solr/select?indent=on&version=2.2&q=buch&fq="+year+"&start=0&rows=10&fl=*%2Cscore&qt=standard&wt=standard&explainOther=&hl.fl=")
	  soup4 = BeautifulSoup(query4.text)
	  check4 = soup4.find_all("arr",{"name":"ISBN"})
	  if check4 != None and (char.isdigit() for char in check4):
	    for item4 in check4:
	      ISBNs.append(item4.text)
	      c44 =soup4.find("arr",{"name":"text_auto"})
	      nkeywords5 = []
	      it5 = c44.find_all("str")
	      for i5 in it5:
		nkeywords5.append(i5.text)
	      checks2.append(nkeywords5)
	      c444 = soup4.find("arr",{"name":"MaterialType"}).find("str")
	      checks3.append(c444.text)

	  #search solr by titles and filter by media type
	  query5 = requests.get("http://katalog.stbib-koeln.de:8983/solr/select?indent=on&version=2.2&q="+ntitle+"&fq=MaterialType:"+mediatype+"&start=0&rows=10&fl=*%2Cscore&qt=standard&wt=standard&explainOther=&hl.fl=")
	  soup5 = BeautifulSoup(query5.text)
	  check5 = soup5.find_all("arr",{"name":"ISBN"})
	  if check5 != None and (char.isdigit() for char in check5):
	    for item5 in check5:
	      ISBNs.append(item5.text)
	      c55 =soup5.find("arr",{"name":"text_auto"})
	      nkeywords6 = []
	      it6 = c55.find_all("str")
	      for i6 in it6:
		nkeywords6.append(i6.text)
	      checks2.append(nkeywords6)
	      c555 = soup5.find("arr",{"name":"MaterialType"}).find("str")
	      checks3.append(c555.text)

    nISBNs = []
    for i in ISBNs:
      i = i.split(' ')[0]
      nISBNs.append(i)

    ###merge list (remove duplicate entries/isbs)
    result_isbn = []
    result_isbn = list(set(nISBNs))

    #step3: get metadata for new isbn list
    for i in result_isbn:
      #time.sleep(1);
      r = requests.get("https://www.googleapis.com/books/v1/volumes?q=isbn:"+i)
      content = r.text
      t3 = json.loads(content)
      if "items" in t3:
	if "volumeInfo" in t3["items"][0]:
	  if "authors" in t3["items"][0]["volumeInfo"]:
	    authorr = t3["items"][0]["volumeInfo"]["authors"][0]
	  else:
	    authorr = " "
	else:
	  authorr = " "

	if "volumeInfo" in t3["items"][0]:
	  if "title" in t3["items"][0]["volumeInfo"]:
	    titlee = t3["items"][0]["volumeInfo"]["title"]
	  else:
	    titlee = " "
	else:
	  titlee = " "

	#rep = requests.get("http://www.librarything.com/title/"+titlee+authorr)
	#soups1 = BeautifulSoup(rep.text)

	#check_rep = soups1.find("link", {"rel": "canonical"})

	q = requests.get("http://katalog.stbib-koeln.de:8983/solr/select?indent=on&version=2.2&q="+titlee+authorr)
	soupn = BeautifulSoup(q.text)
	ch = soupn.find_all("arr",{"name":"ISBN"})
	if ch != None and (char.isdigit() for char in ch):
	  for itemm in ch:
	    cn =soupn.find("arr",{"name":"text_auto"})
	    ky = []
	    ii = cn.find_all("str")
	    for inn in ii:
	      ky.append(inn.text)
	    cnn = soupn.find("arr",{"name":"MaterialType"}).find_all("str")
	    cnn2 = cnn[1].text
	    date = soupn.find("arr",{"name":"DateOfPublication"}).find("str")
	    ncateg = soupn.find("arr",{"name":"BibLevel"}).find_all("str")
	    ncategoriess = ncateg[1].text


	#if "volumeInfo" in t3["items"][0]:
	  #if "categories" in t3["items"][0]["volumeInfo"]:
	    #ncategoriess = t3["items"][0]["volumeInfo"]["categories"][0]
	  #else:
	    #ncategoriess = " "
	#else:
	  #ncategoriess = " "


	if "volumeInfo" in t3["items"][0]:
	  if "description" in t3["items"][0]["volumeInfo"]:
	    ndescriptionn = t3["items"][0]["volumeInfo"]["description"]
	  else:
	    ndescriptionn = " "
	else:
	  ndescriptionn = " "

	if ndescriptionn == " ":
	  if soupn.find("arr",{"name":"Abstract"}) != None:
	    nn2 = soupn.find("arr",{"name":"Abstract"}).find("str")
	    ndescriptionn = nn2.text
	#check if description in googleapis
	#if "volumeInfo" in t3["items"][0]:
	  #if "description" in t3["items"][0]["volumeInfo"]:
	    #ndescriptionn = t3["items"][0]["volumeInfo"]["description"]
	    ## if librarything contains the page then get description from librarything
	  #elif check_rep != None:
	    #link = check_rep['href']

	    #rep2 = requests.get(link+"/descriptions")
	    #soups2 = BeautifulSoup(rep2.text)
	    #check_rep2 = soups2.find("div",{"class":"qelcontent"}).find_all("p")
	    #ndescriptionn = check_rep2[1].text
	  ##then get description from solr
	  #elif soupn.find("arr",{"name":"Abstract"}) != None:
	    #mm = soupn.find("arr",{"name":"Abstract"}).find("str")
	    #ndescriptionn = mm.text
	  #else:
	    #ndescriptionn = " "


	if "volumeInfo" in t3["items"][0]:
	  if "imageLinks" in t3["items"][0]["volumeInfo"]:
	    if "thumbnail" in t3["items"][0]["volumeInfo"]["imageLinks"]:
	      nthumbnaill = t3["items"][0]["volumeInfo"]["imageLinks"]["thumbnail"]
	    else:
	      nthumbnaill = " "
	  else:
	    nthumbnaill = " "
	else:
	  nthumbnaill = " "


    #step4: make json file with data
	data = {}
	data['Title'] = titlee;
	data['ISBN'] = i;
	data['Author'] = authorr;
	data['Category'] = ncategoriess;
	data['Year'] = date.text;
	data['Media Type'] = cnn2;
	data['Description'] = ndescriptionn;
	data['Keywords'] = ky;
	data['Thumbnail'] = nthumbnaill;
	results.append(data)



    return JsonResponse({'results': results})
