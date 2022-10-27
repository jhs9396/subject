const MongoClient = require('mongodb').MongoClient;
const Promise = require("bluebird");
const util = require('util');

var using = Promise.using;
var connect = util.promisify(MongoClient.connect);

const url = 'mongodb://118.223.123.214:4101';

function query2(qobjb, collectionName='resources', dbName='THREAT_RS', ) {

    // see :  http://bluebirdjs.com/docs/api/resource-management.html

    // return using(
    //     connect(url, { useNewUrlParser: true }),
    //     function(client) {
    //         var orgClosefn = client.close
    //         orgClosefn = orgClosefn.bind(client)
    //         client.close = function(...arg){
    //             console.log('xxxxx')
    //             orgClosefn(...arg)
    //         }
    //
    //         const db = client.db(dbName);
    //         const collection = db.collection(collectionName);
    //
    //         return new Promise((resolve,reject)=>{
    //             collection.find(qobjb).toArray((err, docs) => {
    //                 if(err) {
    //                     return reject(err)
    //                 }
    //                 resolve(docs)
    //             })
    //         })
    //     }
    // );


    return MongoClient.connect(url, { useNewUrlParser: true })
    .then((client) => {
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        return util.promisify(collection.find(qobjb).toArray)()

        // collection.find(qobjb).toArray((err, docs) => {
        //     if(err) {
        //         client.close()
        //         throw err;
        //     }
        //     return docs
        //     // client.close()
        // })
    })

}

function query(qobjb, collectionName='resources', dbName='THREAT_RS', ) {

    return new Promise((resolve,reject)=>{

        MongoClient.connect(url, { useNewUrlParser: true },(err, client) => {
            if(err) {
                client.close()
                return reject(err)
            }

            const db = client.db(dbName);
            const collection = db.collection(collectionName);

            collection.find(qobjb).toArray((err, docs) => {
                if(err) {
                    client.close()
                    return reject(err)
                }
                resolve(docs)
                client.close()
            })
        })
    })
}


module.exports = {
    query
}
