from flask import Flask
from flask_login import LoginManager
from flask_cors import CORS

from app.route import api_test, api_test2, api_ocr, api_analysis
from app.route.api_execute import ApiExecute
from app.route.api_login import ApiLogin
from app.route.api_main import ApiMain
from app.util.enum import Properties


def use(self, base_url, router) -> None:
    """
    similar to Node.js Express app by Python Flask Framework

    :param self: Flask instance
    :param base_url: router `base url`
    :param router: class or method file
    """
    module = None
    if isinstance(router, dict):
        module = router.get(Properties.MODULE)
        router = router.get(Properties.ROUTER)
    try:
        self.base_urls = dict() if self.base_urls is None else self.base_urls
    except AttributeError:
        self.base_urls = dict()

    setattr(router, Properties.APP, self)
    setattr(router, Properties.BASE_URL, base_url)
    setattr(router, Properties.MODULE, module)
    self.base_urls[base_url] = router()


# Added to method in Flask object similar to use `Express.js`, `SpringBoot @RestController`
setattr(Flask, 'use', use)

app = Flask(__name__)
CORS(app)
app.config['DEBUG'] = True

login_manager = LoginManager()
login_manager.init_app(app)

# similar to `Express.js` router
app.use('/', ApiMain)
app.use('/login', ApiLogin)
app.use('/exec', ApiExecute)
app.use('/test', api_test)
app.use('/test2', api_test2)
app.use('/ocr', api_ocr)
app.use('/analysis', api_analysis)