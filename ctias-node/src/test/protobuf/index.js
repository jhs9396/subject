var protobuf = require("protobufjs");

var net  = require('net')


protobuf.load("./stinger-batch.proto").then(( root) => {
    console.log(root)

    // Obtain a message type
    var StingerBatch = root.lookupType("gt.stinger.StingerBatch");
    var EdgeInsertion = root.lookupType("gt.stinger.EdgeInsertion");

    var insertion = EdgeInsertion.fromObject({
        source_str: 'z1',
        destination_str: 'x1',
        weight: 1,
        time: Date.now()
    })

    var batch = StingerBatch.fromObject({
        make_undirected: false,
        type: 1,
        keep_alive: true,
        insertions: [
            insertion
        ]
    })


    var buffer = StingerBatch.encode(batch).finish()

    console.log(buffer)


    var sock = new net.Socket()

    sock.connect({
        host:'localhost',
        port:10102
    },(err) => {
        sock.write(buffer)


        var batch2 = StingerBatch.fromObject({
            make_undirected: true,
            type: 1,
            keep_alive: false,
        })

        var buffer2 = StingerBatch.encode(batch2).finish()
        sock.write(buffer2)


        sock.end()
    })

    sock.on('data',  data=>{
        console.log('bbb', data)
    })

    sock.on('close',  ()=>{
        console.log('closed!')
    })








}).catch(err=>{
    console.error(err)
});