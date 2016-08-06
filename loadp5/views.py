from django.shortcuts import render
from django.http import HttpResponse

# Create your views here.

def index(request, type=None):
    return render(request, 'loadp5/index.html', {
        'type': type,
    })