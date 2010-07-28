BROKER_HOST = "kirishima.wrk.lsn.camptocamp.com"
BROKER_PORT = 5672
BROKER_USER = "myuser"
BROKER_PASSWORD = "mypassword"
BROKER_VHOST = "myvhost"

CELERY_RESULT_BACKEND = "amqp"

# workers config:
CELERY_IMPORTS = ("tasks", )
CELERY_DISABLE_RATE_LIMITS = True
