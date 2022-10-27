import sys
import types

from app.util.annotation import request_mapping
from app.util.types import RouterProperties


class Router(types.ModuleType):
    """
    Router class for module type
    """
    # class variable for get method key-value
    gets = {}
    # class variable for post method key-value
    posts = {}

    @request_mapping
    def __call__(self):
        """
        When router called by Flask custom `use` method, decorator function(request_mapping) is executed.
        """
        pass

    @classmethod
    def get(cls, url, func):
        """
        request method for get logic execute

        :param url: detail url
        :param func: function mapped to detail url for get method
        """
        cls.gets['%s|%s' % (func.__module__, url)] = RouterProperties(module=func.__module__, url=url, function=func)

    @classmethod
    def post(cls, url, func):
        """
        request method for post logic execute

        :param url: detail url
        :param func: function mapped to detail url for post method
        """
        cls.posts['%s|%s' % (func.__module__, url)] = RouterProperties(module=func.__module__, url=url, function=func)


sys.modules[__name__].__class__ = Router