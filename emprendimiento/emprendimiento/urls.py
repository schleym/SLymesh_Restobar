"""
URL configuration for emprendimiento project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from control import views

urlpatterns = [
    path('',views.index, name="index"),
    path("tragos/", views.tragos, name="tragos"),
    path('mocktails/', views.mocktails, name='mocktails'),
    path('carta/', views.menu_cocteles, name='menu_cocteles'),
    path('crear_coctel/', views.crear_coctel, name="crear_coctel"),
]
