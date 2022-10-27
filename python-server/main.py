# coding=utf-8
# from flask import Flask
#
# from app.util.annotation import request_mapping
#
#
# class T:
#     def __init__(self):
#         self.app = 1
#
#     @request_mapping
#     def test(self):
#         return self.app

#
# def use(self, base_url, router):
#     self.base_urls = dict() if not getattr(self, 'base_urls') else self.base_urls
#     # setattr(self, base_url, dict() if self.base_urls is None else self.base_urls)
#     # self.base_urls = dict() if self.base_urls is None else self.base_urls
#     print('self', self.base_urls)
#     self.base_urls[base_url] = router

from app.util.enum import Properties, PropertiesAdvanced


if __name__ == '__main__':
    # t = T()
    print('start')
    print(Properties.METHODS)
    print(PropertiesAdvanced.STRING(Properties.METHODS))

    # setattr(Flask, 'use', use)
    # app = Flask(__name__)
    # app.use('/dddd', 'cccccc')
    # print(app.base_urls)