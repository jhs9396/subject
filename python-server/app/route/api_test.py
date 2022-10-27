import sys

from app.util.enum import Properties
from app.util.router import router


def root(req, next):
    return '<div>hi test. 테스트</div>'


router.get('/', root)
router.get('/ttt', root)

sys.modules[__name__] = {
    Properties.ROUTER: router,
    Properties.MODULE: __name__
}