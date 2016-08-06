from django.conf.urls import url
from django.conf import settings

from loadp5 import views

urlpatterns =[
    url(r'^$', views.index),
    url(r'ˆ(?P<type>[a-z]+)/$', views.index),
]