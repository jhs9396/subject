

let workerid = null

let vertexArrayBuffer = null
let edgeArrayBuffer = null
let fromIdx = 0
let toIdx   = 0

let computeChunks = new Map()

let isBusy = false


const Engine = {
    init(index, vertexBuff, edgeBuff) {
        // console.log('index, vertexBuff, edgeBuff', index, vertexBuff, edgeBuff)

        vertexArrayBuffer = vertexBuff
        edgeArrayBuffer = edgeBuff
        workerid = index
    },

    registerCoputeChunk(chunkName, chunkSrc) {

    },

    unregisterComputeChunk(chunkName) {

    },

    map() {

    },

    reduce() {

    }
}

self.addEventListener('message', (event) => {
    Engine[event.data.fncname].apply(undefined, event.data.params)


})




