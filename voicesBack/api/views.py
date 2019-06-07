from api.serializer import *
from rest_framework.decorators import *
from rest_framework.response import Response
from rest_framework import status, viewsets
from .models import *
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAuthenticatedOrReadOnly
from rest_framework.authentication import SessionAuthentication, BasicAuthentication, TokenAuthentication
from rest_framework_jwt.authentication import JSONWebTokenAuthentication
import uuid, base64, datetime

#doc para autenticacion jwt
#http://getblimp.github.io/django-rest-framework-jwt/
#https://django-rest-auth.readthedocs.io/en/latest/installation.html#jwt-support-optional

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class ConcursoList(viewsets.ModelViewSet):
    queryset = Concurso.objects.all()
    serializer_class = SerializerConcurso
    #authentication_classes = [JSONWebTokenAuthentication, TokenAuthentication, SessionAuthentication, BasicAuthentication]

    def list(self, request, *args, **kwargs):
        concursos = Concurso.objects.all().order_by( '-id' )
        serializer = SerializerConcurso( concursos, many=True )
        return Response( serializer.data)

    @action(methods=['put'], detail=False)
    def put(self, request, pk=None):
        concurso = Concurso.objects.get(pk=pk)
        serializer = SerializerConcurso(concurso, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @authentication_classes([JSONWebTokenAuthentication, TokenAuthentication])
    @permission_classes( [IsAuthenticated,] )
    @action(methods=['get'], detail=True)
    def getByUser(self, request, pk=None):
        concursos = Concurso.objects.filter(Owner_id=pk).order_by('-id')
        serializer = SerializerConcurso(concursos, many=True)
        return Response(serializer.data)

    @authentication_classes( [JSONWebTokenAuthentication, TokenAuthentication] )
    @permission_classes( [IsAuthenticated,] )
    def create(self, request):
        owner = request.data.get('Owner_id')
        imagen = request.data.get( 'Imagen')
        format, imgstring = imagen.split( ';base64,')
        ext = format.split( '/' )[-1]
        filename = "static/images/" + str( uuid.uuid4() ) + "."+ ext
        imgdata = base64.b64decode( imgstring )
        with open( filename, 'wb' ) as f:
            f.write( imgdata )

        # serializer = self.get_serializer( data=request.data )
        usuario = User.objects.get( id=owner )

         #if serializer.is_valid():
        Concurso.objects.create(Owner=usuario,
            Nombre=request.data['Nombre'], Url=request.data['Url'],
            Fecha_Fin=request.data['Fecha_Fin'], Fecha_Inicio=request.data['Fecha_Inicio'],
            Premio=request.data['Premio'], Guion=request.data['Guion'],
            Recomendaciones=request.data['Recomendaciones'],
            Imagen=filename
        )
        return Response({'status': 'Grabacion creada correctamente'}, status=status.HTTP_201_CREATED)
        #return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(methods=['delete'], detail=False)
    def delete(self, request, pk=None):
        concurso = Concurso.objects.get(pk=pk)
        concurso.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    @authentication_classes( [JSONWebTokenAuthentication, TokenAuthentication] )
    @permission_classes( [IsAuthenticated, ] )
    @action( methods=['get'], detail=True )
    def getByUrl(self, request, pk=None):
        concursos = Concurso.objects.filter(Url=pk).order_by('-id')
        if (concursos):
            serializer = SerializerConcurso( concursos, many=True )
            return Response( serializer.data[0], status=status.HTTP_200_OK)
        return Response(status=status.HTTP_204_NO_CONTENT)

class GrabacionList(viewsets.ModelViewSet):
    queryset = Grabacion.objects.all()
    serializer_class = SerializerGrabacion
    ##authentication_classes = [JSONWebTokenAuthentication, TokenAuthentication, SessionAuthentication, BasicAuthentication]
    ##permission_classes = [IsAuthenticated]

    @action(methods=['put'], detail=False)
    def put(self, request, pk=None):
        grabacion = Concurso.objects.get(pk=pk)
        serializer = SerializerGrabacion(grabacion, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(methods=['get'], detail=True)
    def getByConcurso(self, request, pk=None):
        grabaciones = Grabacion.objects.filter(Concurso_id=pk).order_by('-Fecha_Publicacion')
        serializer = SerializerGrabacion(grabaciones, many=True)
        return Response(serializer.data)

    @action(methods=['get'], detail=True)
    def getGrabacion(self, request, pk=None):
        grabacion = Concurso.objects.filter(pk=pk)
        serializer = SerializerGrabacion(grabacion, many=True)
        return Response(serializer.data)

    permission_classes([])
    def create(self, request, *args, **kwargs):
        concurso_id = request.data.get( 'Concurso_id' )
        concurso = Concurso.objects.get( id=concurso_id )

        audio = request.data.get( 'Archivo_Original' )
        format, imgstring = audio.split( ';base64,' )
        ext = format.split( '/' )[-1]
        filename = "static/voices/original/" + str( uuid.uuid4() ) + "." + ext
        imgdata = base64.b64decode( imgstring )

        serializer = SerializerGrabacion(data=request.data, many=True)
        if serializer.is_valid():
            with open( filename, 'wb' ) as f:
                f.write( imgdata )

            result = Grabacion.objects.create(Nombre_Autor=request.data['Nombre_Autor'],
                                     Apellido_Autor=request.data['Apellido_Autor'],
                                     Mail_Autor=request.data['Mail_Autor'],
                                     Fecha_Publicacion=datetime.datetime.now(),
                                     Archivo_Original=filename,
                                     Estado_Archivo=0,
                                     Observaciones=request.data['Observaciones'],
                                     Concurso=concurso)

            return Response( {'status': 'Grabacion creada correctamente'}, status=status.HTTP_201_CREATED )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(methods=['delete'], detail=False)
    def delete(self, request, pk=None):
        grabacion = Concurso.objects.get(pk=pk)
        grabacion.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

