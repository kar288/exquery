import requests
from bs4 import BeautifulSoup
import re


def solr(request,title,author):

r = requests.get("http://katalog.stbib-koeln.de:8983/solr/select?rows=1&q="+title+"+"+author)

soup = BeautifulSoup(r.text)


PublicationDate = soup.find("arr", {"name": "DateOfPublication"}).find("str")

Author = soup.find("arr",{"name":"Author"}).find_all("str")
Authors = []
for a in Author:
  Authors.append(a.text)
  
MediaType = soup.find("arr",{"name":"MaterialType"}).find("str")

Keywords = []
Ky = soup.find("arr",{"name":"text_auto"}).find_all("str")
for k in Ky:
  Keywords.append(k.text)

Category = []
Catg = soup.find("arr",{"name":"SubjectHeading"}).find_all("str")
for c in Catg:
  Category.append(c.text)
  
return JsonResponse({'metadata':PublicationDate, Authors, MediaType, Keywords, Category })
