import sys

from app.util.enum import Properties
from app.util.executor import execute
from app.util.router import router


def test1(req, next):
    res = dict()
    try:
        res[req.get_json()['variable']] = ''
        res = execute(res, req.get_json()['script'])

        return res
    except Exception as e:
        next(e)
        raise


router.post('/execute', test1)

sys.modules[__name__] = {
    Properties.ROUTER: router,
    Properties.MODULE: __name__
}