var ffi = require('ffi-napi');



var libstinger_net = ffi.Library('./libstinger_net.so',{
    'stream_connect':['string',['int']]
})


add_insert