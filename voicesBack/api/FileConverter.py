import subprocess
import psycopg2
import multiprocessing
import threading
import os
import pathlib
import sendgrid
import datetime
import shutil
import boto3
from botocore.exceptions import ClientError
from boto3.dynamodb.conditions import Key, Attr
from sendgrid.helpers.mail import *

MAX_WORKERS = 1
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
VOICES_ROOT = os.path.join(PROJECT_ROOT, 'static')
dynamodb = boto3.resource('dynamodb')



def ConvertAudio(fileImput):
    #validar fileImput
    inFile = GetOrginalPath(fileImput[1])
    outputFileName = VOICES_ROOT + '/voices/processed/' + GetFileName(inFile) + '.mp3'
    if IsMp3(fileImput[1]):
        print("--mp3Detected--")
        shutil.copy(inFile, outputFileName)
        PostProcessFile(fileImput[0], outputFileName, fileImput[2], fileImput[3])
        return True
    else:
        print("--NonMp3Detected--")
        result = subprocess.run(['ffmpeg', '-i', inFile, '-acodec', 'libmp3lame', outputFileName])
        #command = "ffmpeg -i {0} -acodec libmp3lame {1}".format(fileImput, outputFileName)
        #result = os.system(command)
        if result.returncode is 0:
            PostProcessFile(fileImput[0], outputFileName, fileImput[2], fileImput[3])
            return True
        else:
            return False


def PostProcessFile(fileId, outFile, mail, url):
    UpdateProcessedFile(fileId, outFile)
    #SendEmailSendgrid(mail, url)
    SendEmailSeS(mail, url)


def GetOrginalPath(relativepath):
    file = pathlib.PurePath(relativepath).name
    return VOICES_ROOT + '/voices/original/' + file


def IsMp3(filePath):
    file_extension = pathlib.PurePath(filePath).suffix
    if file_extension == '.mp3':
        return True
    else:
        return False


def GetFileName(filePath):
    return pathlib.PurePath(filePath).stem


def UpdateProcessedFile(fileId, filePath):
    print("updatefile--" + str(fileId))
    conn = None
    with threading.Lock():
        try:
            outputFileDB = 'voices/processed/' + GetFileName(filePath) + '.mp3'
            table = dynamodb.Table('grabacion')
            table.update_item(
                Key={
                    'Archivo_Original': fileId
                },
                UpdateExpression='SET Estado_Archivo=:val1, Archivo_Final=:val2',
                ExpressionAttributeValues={
                    ':val1': 1,
                    ':val2': outputFileDB
                }
            )
        except(Exception, psycopg2.DatabaseError) as error:
            print(error)
        finally:
            if conn is not None:
                conn.close()


def SendEmailSendgrid(mail, url):
    print("usendmail--" + mail)
    sg = sendgrid.SendGridAPIClient(
        apikey=os.environ.get('SENDGRID_API_KEY')
    )
    from_email = Email("noreply@voices.com")
    to_email = Email(mail)
    subject = "La voz ya esta disponible"
    WS_IP = os.environ.get('IP_HOST')
    content = Content(
        "text/plain", "La voz ya se encuentra disponible en la página principal del concurso " +
                      WS_IP + "/concursar/" + url
    )
    mail = Mail(from_email, subject, to_email, content)
    response = sg.client.mail.send.post(request_body=mail.get())


def SendEmailSeS(mail, url):
    print("usendmai2--" + mail)
    client = boto3.client('ses')
    WS_IP = os.environ.get('IP_HOST') + '/concursar/' + url
    mensaje = '<html><head></head><body><p>La voz ya se encuentra disponible en la página principal del ' +\
              'concurso, visite</p> <a href="' + WS_IP + '">Supervoices</a> ' +\
              '<p>para mas informacion</p></body></html>'

    # Try to send the email.
    try:
        # Provide the contents of the email.
        response = client.send_email(
            Destination={
                'ToAddresses': [
                    mail,
                ],
            },
            Message={
                'Body': {
                    'Html': {
                        'Charset': 'UTF8',
                        'Data': mensaje,
                    },
                },
                'Subject': {
                    'Charset': 'UTF8',
                    'Data': 'La voz ya esta disponible',
                },
            },
            Source='info.supervoice@gmail.com',
            #ConfigurationSetName='UTF8',
        )
    # Display an error if something goes wrong.
    except ClientError as e:
        print("catchSeS" + mail)
        print(e.response['Error']['Message'])
    else:
        print("Email sent! Message ID:"),
        print(response['MessageId'])


def GetPendingFiles():
    conn = None
    files = None
    try:
        table = dynamodb.Table('grabacion')
        response = table.query(
            KeyConditionExpression=Key('Estado_Archivo').eq(0)
        )
        items = response['Items']
        #cur.execute("""SELECT gr.id, gr."Archivo_Original", gr."Mail_Autor", co."Url" FROM api_grabacion gr, api_concurso co WHERE gr."Estado_Archivo" = 0 and gr."Concurso_id" = co.id""")
    except (Exception, psycopg2.DatabaseError) as error:
        print(error)
    finally:
        if conn is not None:
            conn.close()
    return items


def UpdateLogTable(startTime, endTime, totalFiles):
    conn = None
    try:
        table = dynamodb.Table('grabacion')
        table.put_item(
            Item={
                'startDate': startTime,
                'endDate': endTime,
                'totalFiles': totalFiles
            }
        )
    except(Exception, psycopg2.DatabaseError) as error:
        print(error)
    finally:
        if conn is not None:
            conn.close()


def StartJob():
    startTime = datetime.datetime.now(datetime.timezone.utc)
    pendingFiles = GetPendingFiles()
    if pendingFiles is not None:
        with multiprocessing.Pool(MAX_WORKERS) as pool:
            results = pool.imap(ConvertAudio, pendingFiles)
            totalFiles = sum(results)
            endTime = datetime.datetime.now(datetime.timezone.utc)
            UpdateLogTable(startTime, endTime, totalFiles)
    else:
        UpdateLogTable(startTime, startTime, 0)
        print("No files to Tansform")


if __name__ == '__main__':
    StartJob()
