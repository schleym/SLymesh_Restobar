from django.core.management.base import BaseCommand
from django.db import transaction
from control.models import Mocktail


class Command(BaseCommand):
    help = 'Carga la carta inicial de mocktails en la base de datos'

    def handle(self, *args, **kwargs):

        lista_mocktails = [
            {
                "nombre_mocktail": "Limonada Menta",
                "precio": 2500,
                "descripcion": "Refrescante limonada natural con hojas de menta.",
                "imagen_url": "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62"
            },
            {
                "nombre_mocktail": "Piña Ginger",
                "precio": 2800,
                "descripcion": "Piña natural con un toque suave de jengibre.",
                "imagen_url": "https://images.unsplash.com/photo-1600271886742-f049cd451bba"
            },
            {
                "nombre_mocktail": "Frutos Rojos",
                "precio": 3000,
                "descripcion": "Mezcla de berries naturales con hielo frappé.",
                "imagen_url": "https://images.unsplash.com/photo-1544145945-f90425340c7e"
            },
            {
                "nombre_mocktail": "Maracuyá Fresh",
                "precio": 2900,
                "descripcion": "Pulpa de maracuyá natural con soda y limón.",
                "imagen_url": "https://images.unsplash.com/photo-1613478223719-2ab802602423"
            }
        ]

        try:
            with transaction.atomic():
                self.stdout.write("🍹 Iniciando carga de Mocktails...")

                for item in lista_mocktails:
                    mocktail, created = Mocktail.objects.get_or_create(
                        nombre_mocktail=item["nombre_mocktail"],
                        defaults={
                            "precio": item["precio"],
                            "descripcion": item["descripcion"],
                            "imagen_url": item["imagen_url"]
                        }
                    )

                    if created:
                        self.stdout.write(
                            self.style.SUCCESS(f'✔ Mocktail creado: {mocktail.nombre_mocktail}')
                        )
                    else:
                        self.stdout.write(
                            f'ℹ Mocktail ya existente: {mocktail.nombre_mocktail}'
                        )

                self.stdout.write(
                    self.style.SUCCESS('✅ Carga de mocktails completada exitosamente')
                )

        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'❌ Error al cargar mocktails: {str(e)}')
            )
