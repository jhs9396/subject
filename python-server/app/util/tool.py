def concat_dict_words(delimiter='.', **words) -> str:
    """
    {
        'keyword': value,
        'keyword2': value2,
        'keyword3': value3,
        ...
    } => value.value2.value3
     
    
    :param delimiter: for appending to words by delimiter
    :param words:
    :return: 
    """
    return delimiter.join(['{%s}' % key for key in words.keys()]).format(**words)


def endpoint(base_url, url) -> str:
    """
    make base url + url endpoint.
    so that it can be processed even if `/` is appended to the endpoint

    :param base_url:
    :param url:
    :return:
    """
    return url if base_url == '/' else base_url + (url if url != '/' else '')


def add_url_rule(app, url, func, **options) -> None:
    app.add_url_rule(url, url, func, **options)
    app.add_url_rule(url + '/', url + '/', func, **options)

# -*- coding: utf-8 -*-
import datetime as dt

def to_list(text):
    """
    set string { ... } to list
    """
    return text.replace('{','').replace('}','').split(',')

def to_time(text):
    """
    convert year, month, day
    """
    return dt.datetime.strptime(text.split(' ')[0], '%Y-%m-%d')