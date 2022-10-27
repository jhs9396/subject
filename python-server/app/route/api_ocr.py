import sys

from app.util.enum import Properties
from app.util.router import router
from PIL import Image
from pytesseract import image_to_string
from pyocr import get_available_tools
from pyocr import builders
import os


def image(req, next):
    config = '--psm 6 -c preserve_interword_spaces=1'
    file_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), '../static/img/picture1.png')
    image01 = Image.open(file_path)
    print01 = image_to_string(image01, lang='kor+eng', config=config)
    print('print01', print01)
    return '<div>image. 테스트</div>'


def py_ocr(req, next):
    config = '--psm 11 -c preserve_interword_spaces=1'
    tools = get_available_tools()
    tool = tools[0]
    file_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), '../static/img/picture1.png')
    image01 = Image.open(file_path)
    print01 = tool.image_to_string(image01, lang='kor+eng', builder=builders.TextBuilder())
    print('print01', print01)
    return '<div>image pyocr. 테스트</div>'


router.get('/image', image)
router.get('/pyocr', py_ocr)

sys.modules[__name__] = {
    Properties.ROUTER: router,
    Properties.MODULE: __name__
}