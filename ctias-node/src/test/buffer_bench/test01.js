
global.buffer = new SharedArrayBuffer(4*1000000)
global.f32 = new Float32Array(global.buffer)

console.time('f32')

for(let v=1; v<=100; v++) {
    let vx = v

    for (let i = 0; i < 1000000; i++) {
        f32[i] = vx
    }

    let sum = 0.0

    for (let i = 0; i < 1000000; i++) {
        sum += f32[i]
    }

    // console.log('sum', sum)
}


console.timeEnd('f32')