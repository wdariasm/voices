from crontab import CronTab

my_cron = CronTab(user='roy')
job = my_cron.new(command='python3 /home/SIS/wd.arias/django-apps/Grupo11/voicesBack/api/FileConverter.py')
job.hour.every(1)

my_cron.write()