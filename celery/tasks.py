from random import random
from celery.decorators import task

@task
def add(x, y):
    return x + y

@task
def maybe_crash(prob=0.5):
    if random() < prob:
        raise Exception("exception in maybe_crash")
