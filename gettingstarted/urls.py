from django.conf.urls import include, url

from django.contrib import admin
admin.autodiscover()

import hello.views

# Examples:
# url(r'^$', 'gettingstarted.views.home', name='home'),
# url(r'^blog/', include('blog.urls')),

urlpatterns = [
    url(r'^$', hello.views.index, name='index'),
    url(r'^db', hello.views.db, name='db'),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^getBookInfo/(?P<isbn>\d+)/$', hello.views.getBookInfo, name='getBookInfo'),
    url(r'^getBookRecommendations/(?P<isbn>\d+)$', hello.views.getBookRecommendations, name='getBookRecommendations'),
    url(r'^getResults/(?P<isbns>[\d,]+)$', hello.views.getResults, name='getResults'),
]
