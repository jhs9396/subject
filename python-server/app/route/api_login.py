from flask import request

from app.route.common.api_common import ApiCommon
from app.util.annotation import request_mapping
from app.vo.user import user


class ApiLogin(ApiCommon):
    def __init__(self):
        super().__init__()

    @request_mapping(url='/setter', methods=['POST'])
    def load_4_user(self):
        user.set_user(request.get_json()['user'])
        return {'state': True}