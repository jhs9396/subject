from functools import partial
from types import FunctionType

from flask import request

from app.util.store import stored_path
from app.util.tool import concat_dict_words, endpoint, add_url_rule


def request_mapping(url=str(), **options):
    """
    Similar to Spring annotation `@RequestMapping`
    added to add_url_rule|@app.route into logic.

    :param url: api url endpoint
    :param options: methods, etc options dictionary
    :return: original class method to wrapping function
    """
    if isinstance(url, FunctionType):
        """
        case1. @request_mapping is used without arguments  
        """
        def decorator(*args):
            for sub_url, func in [(get.url, get.function) for get in args[0].gets.values() if get.module == args[0].module]:
                add_url_rule(
                    args[0].app,
                    endpoint(args[0].base_url, sub_url),
                    partial(func, request, lambda err: print('error 원인 >> ', err)),
                    methods=['GET']
                )

            for sub_url, func in [(post.url, post.function) for post in args[0].posts.values() if post.module == args[0].module]:
                add_url_rule(
                    args[0].app,
                    endpoint(args[0].base_url, sub_url),
                    partial(func, request, lambda err: print('error 원인 >> ', err)),
                    methods=['POST']
                )

        return decorator
    else:
        """
        case2. @request_mapping(url, **options) is used arguments
        """
        def decorator(func):
            stored_path.append(concat_dict_words(**{'module': func.__module__, 'func': func.__name__}))

            def arguments(*args):
                add_url_rule(args[0].app, endpoint(args[0].base_url, url), partial(func, args[0]), **options)

            return arguments

        return decorator