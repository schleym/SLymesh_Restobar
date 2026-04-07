from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class Usuario(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    rol = models.CharField(max_length=50)

    def __str__(self):
        return self.user.username
    
class Coctel(models.Model):
    nombre = models.CharField(max_length=100)
    precio = models.IntegerField()
    alcohol = models.BooleanField(default=True)
    descripcion = models.TextField(blank=True, null=True)
    imagen_url = models.URLField(blank=True, null=True)

    def __str__(self):
        return self.nombre

class Receta(models.Model):
    coctel = models.ForeignKey(Coctel, on_delete=models.CASCADE)
    medidas_lemon = models.CharField(max_length=50)
    medidas_goma = models.CharField(max_length=50)
    medidas_adicionales = models.CharField(max_length=100, blank=True, null=True)
    medidas_alcohol = models.CharField(max_length=50)

    def __str__(self):
        return f"Receta de {self.coctel.nombre}"
    
class VariableCoctel(models.Model):
    coctel = models.ForeignKey(
        Coctel,
        on_delete=models.CASCADE,
        related_name="variedades"
    )

    nombre_variable = models.CharField(max_length=100)
    cantidad_variables = models.IntegerField()
    aumento_precio = models.DecimalField(max_digits=6, decimal_places=2)

    def __str__(self):
        return f"{self.nombre_variable} - {self.coctel.nombre}"
    
class Producto(models.Model):
    MARCA_CHOICES = [
        ('natura', 'Natura'),
        ('avon', 'Avon'),
    ]

    nombre = models.CharField(max_length=100)
    version = models.CharField(max_length=50)
    categoria = models.CharField(max_length=100)
    precio = models.DecimalField(max_digits=8, decimal_places=2)
    puntos_requeridos = models.IntegerField()
    marca = models.CharField(max_length=20, choices=MARCA_CHOICES)
    
class Pedido(models.Model):
    ESTADO_CHOICES = [
        ('pendiente', 'Pendiente'),
        ('pagado', 'Pagado'),
        ('cancelado', 'Cancelado'),
    ]

    fecha = models.DateTimeField(auto_now_add=True)
    total = models.DecimalField(max_digits=10, decimal_places=2)
    pasaje = models.DecimalField(max_digits=8, decimal_places=2)
    nombre_persona = models.CharField(max_length=100)
    telefono = models.CharField(max_length=20)
    cantidad = models.IntegerField()
    estado = models.CharField(max_length=20, choices=ESTADO_CHOICES)

    def __str__(self):
        return f"Pedido #{self.id} - {self.nombre_persona}"
    
class Mocktail(models.Model):
    nombre_mocktail = models.CharField(max_length=50)
    precio = models.IntegerField()
    descripcion = models.CharField(max_length=100)
    imagen_url = models.URLField(blank=True, null=True)