from collections import namedtuple

# For advanced Java type checking... now deprecated
Property = namedtuple('Property', 'name value')

# For advanced Java type checking... now deprecated
Type = namedtuple('Type', 'type datum')

# Router get, post fixed properties
RouterProperties = namedtuple('RouterProperties', 'module url function')

GetObject = namedtuple('GetObject', 'query')
PostObject = namedtuple('PostObject', 'query')