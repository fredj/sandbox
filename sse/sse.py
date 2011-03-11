#!/usr/bin/env python
#
# Server-Side Events
# http://www.html5rocks.com/tutorials/eventsource/basics/
#
import time
import random
from pyramid.config import Configurator
from pyramid.response import Response
from paste.httpserver import serve

def produce():
    while True:
        time.sleep(1)
        yield "data: %d %f\n\n"%(random.randint(0, 100), time.time())

def stream(request):
    response = Response()
    response.content_type = 'text/event-stream'
    response.cache_expires(0)

    response.app_iter = produce()
    return response

if __name__ == '__main__':
    config = Configurator()
    config.add_view(stream)
    serve(config.make_wsgi_app(), host='0.0.0.0')
