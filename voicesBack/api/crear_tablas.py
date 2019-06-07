from __future__ import print_function
import boto3
import os

region = os.environ.get('AWS_DEFAULT_REGION')

dynamodb = boto3.resource('dynamodb', region_name=region, endpoint_url="http://localhost:8000")

"""
tablaUsuario = dynamodb.create_table(
    TableName='Usuario',
    KeySchema=[
        {
            'AttributeName': 'id',
            'KeyType': 'HASH' #Partition key
        }
    ],
    AttributeDefinitions=[
        {
            'AttributeName': 'id',
            'AttributeType': 'N'
        }
    ],
    ProvisionedThroughput={
        'ReadCapacityUnits': 10,
        'WriteCapacityUnits': 10
    }
) """


tabla_concurso = dynamodb.create_table(
    TableName='Concurso',
    KeySchema=[
        {
            'AttributeName': 'id',
            'KeyType': 'HASH' #Partition key
        }
    ],
    AttributeDefinitions=[
        {
            'AttributeName': 'id',
            'AttributeType': 'N'
        }
    ],
    ProvisionedThroughput={
        'ReadCapacityUnits': 10,
        'WriteCapacityUnits': 10
    }
)

tabla_grabacion = dynamodb.create_table(
    TableName='Grabacion',
    KeySchema=[
        {
            'AttributeName': 'id',
            'KeyType': 'HASH' #Partition key
        }
    ],
    AttributeDefinitions=[
        {
            'AttributeName': 'id',
            'AttributeType': 'N'
        }
    ],
    ProvisionedThroughput={
        'ReadCapacityUnits': 10,
        'WriteCapacityUnits': 10
    }
)

tabla_batchLog = dynamodb.create_table(
    TableName='BatchLog',
    KeySchema=[
        {
            'AttributeName': 'id',
            'KeyType': 'HASH' #Partition key
        }
    ],
    AttributeDefinitions=[
        {
            'AttributeName': 'id',
            'AttributeType': 'N'
        }
    ],
    ProvisionedThroughput={
        'ReadCapacityUnits': 10,
        'WriteCapacityUnits': 10
    }
)




#print("Tabla Usuario status:", tablaUsuario.table_status)

print("Tabla Concurso status:", tabla_concurso.table_status)

print("Tabla Grabacion status:", tabla_grabacion.table_status)

print("Tabla BatchLog status:", tabla_batchLog.table_status)

