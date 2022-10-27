from enum import Enum
from app.util.types import Type, Property


class Properties(Enum):
    """
    Used const variables in Flask Framework
    """
    METHODS = 'method'
    MODULE = 'module'
    ROUTER = 'router'
    APP = 'app'
    BASE_URL = 'base_url'
    USE = 'use'
    GET = 'GET'
    POST = 'POST'
    QUERY = 'query'
    BODY = 'body'
    SIZE = 1024 * 1024

    def __call__(self):
        """
        :return: When self called by callable object, itself (Enum)
        """
        return self

    def __get__(self, instance, owner):
        """
        :param instance: None
        :param owner: Enum Properties
        :return: self(Enum) value
        """
        return self.value


@DeprecationWarning
class PropertiesAdvanced(Enum):
    """
    Haven't used it yet, but will use it when an idea comes to mind.
    -> String, Integer, ArrayList, etc... as Java type checker will be used.
    """
    STRING = Type(
        type=str,
        datum=[Property(name=p, value=p.value) for p in Properties if isinstance(p.value, str)]
    )
    INTEGER = Type(
        type=int,
        datum=[Property(name=p, value=p.value) for p in Properties if isinstance(p.value, int)]
    )

    def __call__(self, prop):
        try:
            return [p for p in self.value.datum if p.name.value == prop][0].value
        except IndexError:
            raise Exception('Invalid data type or not exists {type} -> {value} Enum type object'.format(**{
                'type': self.value.type, 'value': prop
            }))