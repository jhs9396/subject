from functools import partial

import flask

from app.util.enum import Properties


def query(r):
    print('req', r)
    return r


def bind(request=flask.request):
    setattr(request, Properties.QUERY, partial(query, request))