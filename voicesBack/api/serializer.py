from rest_framework import serializers
from .models import Concurso, Grabacion
from django.contrib.auth.models import User


class SerializerConcurso(serializers.ModelSerializer):
    class Meta:
        model = Concurso
        fields = ('Nombre', 'Url', 'Fecha_Inicio', 'Fecha_Fin', 'Premio', 'Guion', 'Recomendaciones', 'id', 'Owner_id', "Imagen")


class SerializerGrabacion(serializers.ModelSerializer):
    class Meta:
        model = Grabacion
        fields = ('Nombre_Autor', 'Apellido_Autor', 'Fecha_Publicacion', 'Estado_Archivo', 'Archivo_Original',
                   'Observaciones', 'Concurso', 'Mail_Autor', 'Archivo_Final', 'id')


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True )
    class Meta:
        model = User
        fields = ('url', 'email', 'password', 'username', 'id', 'first_name', 'last_name')

    def create(self, validated_data):
        user = super( UserSerializer, self).create( validated_data )
        user.set_password( validated_data['password'] )
        user.save()
        return user
