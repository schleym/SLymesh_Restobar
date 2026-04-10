from django.contrib import admin
from .models import Coctel, Mocktail, Pedido, Producto, Receta, Usuario, VariableCoctel

admin.site.register(Coctel)
admin.site.register(Mocktail)
admin.site.register(Pedido)
admin.site.register(Producto)
admin.site.register(Receta)
admin.site.register(Usuario)
admin.site.register(VariableCoctel)