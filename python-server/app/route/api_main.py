from app.route.common.api_common import ApiCommon
from app.util.annotation import request_mapping


class ApiMain(ApiCommon):
    def __init__(self):
        super().__init__()

    @request_mapping(url='/')
    def root(self):
        if self.app is not None:
            return '<div>Hello, World</div>'
        else:
            pass