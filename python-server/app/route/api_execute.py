from flask import request

from app.route.common.api_common import ApiCommon
from app.util.annotation import request_mapping
from app.util.executor import execute


class ApiExecute(ApiCommon):
    """
    execute test
    similar to SpringBoot `@RestController`
    """
    def __init__(self):
        super().__init__()

    @request_mapping(url='/script', methods=['POST'])
    def script_execute(self) -> dict:
        """
        execute test method

        :return: script execute result defined key by api caller, used to script.
        """
        res = dict()
        res[request.get_json()['variable']] = ''
        res = execute(res, request.get_json()['script'])

        return res