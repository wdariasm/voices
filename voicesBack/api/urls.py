from django.urls import path
from rest_framework import routers
from api.views import *
from django.conf.urls import *
from rest_framework_jwt.views import obtain_jwt_token, refresh_jwt_token

router = routers.DefaultRouter()


router.register(r'concursos', ConcursoList)
router.register(r'grabaciones', GrabacionList)
router.register(r'users', UserViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('concursos/user/<int:pk>/', ConcursoList.as_view({"get": "getByUser"})),
    path('concursos/<int:pk>/grabaciones/', GrabacionList.as_view({"get": "getByConcurso"})),
    path('concursos/validar/<str:pk>/', ConcursoList.as_view({"get": "getByUrl"})),
    url(r'^rest-auth/', include('rest_auth.urls')),
    url(r'^api-token-auth/', obtain_jwt_token),
    url(r'^api-token-refresh/', refresh_jwt_token),
]