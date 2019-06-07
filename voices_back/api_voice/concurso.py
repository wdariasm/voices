from __future__ import print_function
from flask import request, Response
from flask_restful import Resource
import uuid, os, base64
import boto3, datetime
from boto3.dynamodb.conditions import Key
import json, redis
from botocore.exceptions import ClientError

region = os.environ.get( 'AWS_DEFAULT_REGION' )
dynamodb = boto3.resource( 'dynamodb', region_name=region )
tabla_concurso = dynamodb.Table('Concurso' )
url_redis = os.environ.get( 'URL_REDIS' )

def ConexionRedis():
    r = redis.StrictRedis( host=url_redis, port=6379, db=0, decode_responses=True)
    return r

class Concurso( Resource ):
    def get(self, concurso_id):
        respuesta = tabla_concurso.get_item(
            Key={
                'id': concurso_id
            }
        )
        return respuesta['Item']

    def put(self, concurso_id):

        try:
            content = request.form
            imagen = content['Imagen']
            if (imagen):
                format, imgstring = imagen.split( ';base64,' )
                ext = format.split( '/' )[-1]
                filename = "static/images/" + concurso_id + "." + ext

                if os.path.exists( filename ):
                    os.remove( filename )

                img_data = base64.b64decode( imgstring )
                with open( filename, 'wb' ) as f:
                    f.write( img_data )

            respuesta = tabla_concurso.update_item(
                Key={
                    'id': concurso_id
                },
                UpdateExpression=" SET Nombre =:Nom, Url_Concurso=:Ur, Fecha_Fin=:FFin, Fecha_Inicio=:FInicio, "
                                 " Premio =:Pre, Guion =:Gui, Recomendaciones =:Recomen   ",
                ExpressionAttributeValues={
                    ':Nom': content['Nombre'],
                    ':Ur': content['Url'],
                    ':FFin': content['Fecha_Fin'],
                    ':FInicio': content['Fecha_Inicio'],
                    ':Pre': content['Premio'],
                    ':Gui': content['Guion'],
                    ':Recomen': content['Recomendaciones']
                },
                ReturnValues="UPDATED_NEW"
            )
            if (respuesta['ResponseMetadata']['HTTPStatusCode'] == 200):
                nombre_hash = 'concurso:' + concurso_id
                datos_concurso = {
                    'Nombre': content['Nombre'],
                    'Url_Concurso': content['Url'],
                    'Fecha_Fin': content['Fecha_Fin'],
                    'Fecha_Inicio': content['Fecha_Inicio'],
                    'Premio': content['Premio'],
                    'Guion': content['Guion'],
                    'Recomendaciones': content['Recomendaciones']
                }
                con_redis = ConexionRedis()
                con_redis.hmset( nombre_hash, datos_concurso )

            return respuesta

        except Exception as ex:
            print(ex)

    def delete(self, concurso_id):
        try:
            respuesta = tabla_concurso.delete_item(
                Key={'id': concurso_id}
            )

            if (respuesta['ResponseMetadata']['HTTPStatusCode'] == 200):
                con_redis = ConexionRedis()
                nombre_hash = 'concurso:' + concurso_id
                con_redis.delete(nombre_hash)

            return respuesta
        except Exception as ex:
            print(ex)


class ConcursoList( Resource ):
    def get(self):
        try:
            con_redis = ConexionRedis()
            #"""
            list_data = []
            for key in con_redis.scan_iter( "concurso:*" ):
                datos = con_redis.hgetall( key )
                list_data.append( datos ) 

            #respuesta = tabla_concurso.scan()
            #return respuesta['Items']

            return list_data
            #"""
        except ClientError as error:
            print(error)
            response = Response(
                response=json.dumps( dict( error= error.response['Error']['Message'], url=url_redis, mensaje='boto3', region=region) ),
                status=502, mimetype='application/json' )
            return response
        except Exception as ex:
            response = Response(
                response=json.dumps( dict( error=  str(ex) , url = url_redis, mensaje = 'Generico', region=region ) ),
                status=503, mimetype='application/json' )
            return response

    def post(self):

        try:
            content = request.form
            imagen = content['Imagen']
            format, imgstring = imagen.split(';base64,')
            ext = format.split('/')[-1]

            # Generar identificador unico
            id = str( uuid.uuid4() )
            filename = "static/images/" + id + "." + ext
            img_data = base64.b64decode(imgstring)
            with open(filename, 'wb') as f:
                f.write(img_data)

            fecha = datetime.datetime.now().strftime( '%Y-%m-%d %H:%M:%S.%f' )

            datos_concurso = {
                'Nombre': content['Nombre'],
                'Url_Concurso': content['Url'],
                'Fecha_Fin': content['Fecha_Fin'],
                'Fecha_Inicio': content['Fecha_Inicio'],
                'Premio': content['Premio'],
                'Guion': content['Guion'],
                'Recomendaciones': content['Recomendaciones'],
                'Imagen': filename,
                'Owner_id': content['Owner_id'],
                'id': id,
                'Fecha_Creacion': fecha
            }

            #Guardar en Dynamodb
            respuesta = tabla_concurso.put_item(
                Item= datos_concurso
            )

            print(respuesta['ResponseMetadata']['HTTPStatusCode'])

            if (respuesta['ResponseMetadata']['HTTPStatusCode'] == 200):
                nombre_hash = 'concurso:' + id
                con_redis = ConexionRedis()
                con_redis.hmset( nombre_hash, datos_concurso)

            return respuesta

        except ClientError as error:
            print( error )

        except Exception as ex:
            print( ex )


class ConcursoUrl( Resource ):
    def get(self, url):
        response_url = tabla_concurso.query(
            IndexName='concurso_url_index',
            KeyConditionExpression=Key( 'Url_Concurso' ).eq( url )
        )

        if (response_url['Count'] > 0):
            return response_url['Items'][0]

        response = Response(
            response=json.dumps( dict( error='Url no Existe' ) ),
            status=204, mimetype='application/json' )
        return response


class ConcursoUser( Resource ):
    def get(self, user_id):
        response_users = tabla_concurso.query(
            IndexName='concurso_owner_index',
            KeyConditionExpression=Key( 'Owner_id' ).eq( user_id )
        )
        return response_users['Items']


class ConcursoCache(Resource):
    def get(self):
        respuesta = tabla_concurso.scan()
        return respuesta['Items']