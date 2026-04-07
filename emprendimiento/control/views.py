from django.shortcuts import render
from .models import Coctel, Mocktail

# Create your views here.

def index(request):
    return render(request, "index.html")

def tragos(request):
    cocteles = Coctel.objects.all()
    return render(request, "coctails.html", {
        "cocteles": cocteles
    })
def mocktails(request):
    mocktails = Mocktail.objects.all()
    return render(request, 'mocktails.html', {
        'mocktails': mocktails
    })

def menu_cocteles(request):
    cocteles = Coctel.objects.prefetch_related('variedades').all()
    return render(request, 'coctails.html', {
        'cocteles': cocteles
    })

def crear_coctel(request):
    return render(request, 'crear_coctel.html')