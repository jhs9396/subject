debugger

global.buffer = new SharedArrayBuffer(4*100000)
global.f32 = new Float32Array(global.buffer)


global.f32array = []

console.time('f32')

for(let v=0; v < 100; v++) {
    global.f32array.push( new Float32Array(global.buffer,v*4,1))
}


debugger

console.timeEnd('f32')