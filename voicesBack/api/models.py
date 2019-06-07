from django.db import models
from django.conf import settings
from django.core.files.storage import FileSystemStorage
from django.contrib.auth.models import User
import datetime

voices_storage = FileSystemStorage(location=settings.VOICES_ROOT)
media_storage = FileSystemStorage(location=settings.IMAGES_ROOT)


class Concurso(models.Model):
    Nombre = models.CharField(max_length=100, default='', null=False, blank=False)
    Imagen = models.CharField(max_length=1000)
    Url = models.CharField(max_length=200, default='', null=False, blank=False)
    Fecha_Inicio = models.DateField(default=datetime.date.today)
    Fecha_Fin = models.DateField(default=datetime.date.today)
    Premio = models.CharField(max_length=10, default='0')
    Guion = models.TextField(max_length=10000, blank=False)
    Recomendaciones = models.TextField(max_length=10000, default='', blank=True)
    Owner = models.ForeignKey(User, models.SET_NULL, blank=True, null=True, related_name='users_concurso')


class Grabacion(models.Model):
    Nombre_Autor = models.CharField(max_length=100)
    Apellido_Autor = models.CharField(max_length=100)
    Mail_Autor = models.EmailField(max_length=100, default='')
    Fecha_Publicacion = models.DateField(default=datetime.date.today)
    Estado_Archivo = models.IntegerField(editable=False, choices=((0,'En Proceso'), (1, 'Procesado')))
    Archivo_Original = models.CharField(max_length=1000)
    Archivo_Final = models.CharField(max_length=1000)
    Observaciones = models.TextField(default='', max_length=2000)
    Concurso = models.ForeignKey(Concurso, on_delete=models.CASCADE)


class BatchLog(models.Model):
    lastExec = models.DateTimeField(default=datetime.datetime.now)
    startDate = models.DateTimeField(default=datetime.datetime.now)
    totalFiles = models.IntegerField(default=0)
