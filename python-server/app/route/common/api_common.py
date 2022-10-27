from app.util.store import stored_path
from app.util.tool import concat_dict_words


class ApiCommon:
    """
    Child class method executor in parent class similar constructor(ApiCommon)
    """
    def __init__(self):
        for f_name in [f for f in dir(self) if not f.startswith('__') and callable(getattr(self, f))]:
            function = getattr(self, f_name)

            try:
                if concat_dict_words(**{'module': self.__module__, 'func': f_name}) in stored_path:
                    function()
            except AttributeError:
                continue