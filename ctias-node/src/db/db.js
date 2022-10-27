const ag = require('agensgraph');
let {getEnvironment} = require('./query_repo')

// var environment = process.env.CTIAS_ENV
// console.info('environment', environment)

let pool = null;
let connInfo;

let host = getEnvironment('spring.datasource.host')
let port = getEnvironment('spring.datasource.port')
let user = getEnvironment('spring.datasource.username')
let database = getEnvironment('spring.datasource.database')

connInfo = {
    host:host,port:port,user:user,database:database
}
//console.log(connInfo)
// if(environment == 'seoul') {
//     connInfo = {
//         /* 1차모델링 */// host:"211.34.4.19",port:5555,user:"bitnine",database:"ctias"
//         // host:"211.34.4.19",port:6666,user:"ctias",database:"ctias"
//         host:"192.168.0.68",port:5555,user:"ctias",database:"ctias"
//     }
// }else if(environment == 'jeju') {
//     connInfo = {
//         host:"localhost",port:15555,user:"ctias",database:"ctias"
//         // host:"211.34.4.19",port:5555,user:"bitnine",database:"ctias"
//     }
// }
pool = new ag.Pool(connInfo);
pool.on('connect', (client) => {
    client.query(`SET graph_path = ctias `);
});

pool.connect()

function query(qstr, param) {
    let q1 = qstr
    const client = new ag.Client(connInfo);
    client.connect();
    client.query(`SET graph_path = ctias `)

    return new Promise((resolve, reject)=>{
        client.query(qw(q1, param),(err,resp)=>{
            client.end()

            if(err) {
                reject(err)
            }else {
                resolve(resp)
            }
        })
    })
}

function queryWithPool(qstr, param) {
    return pool.query(qw(qstr, param))
}

//===============
function param2Type(param) {

    console.log('param, ', param)

    return param.map(p=>{
        const tstr = typeof p

        switch(tstr) {
            case 'string':
                return 25
                break;

            case 'number':
                if(p%1 === 0) {
                    return 23;
                }else {
                    return 701;
                }
                break;

            case 'boolean':
                return 16;
                break;

            case 'object':
                if(p instanceof Array) {

                    switch(typeof p[0]) {
                        case 'string':
                            return 1009
                            break;

                        case 'number':
                            if(p[0]%1 === 0) {
                                return 1007;
                            }else {
                                return 1022;
                            }
                            break;

                        case 'boolean':
                            return 1000;
                            break;

                        case 'object':
                            return 3807;
                            break;

                        default:
                            throw new Error("unsupported type." + p)

                    }
                }else {
                    return 3802;
                }

                break;

            default:
                throw new Error("unsupported type." + p)
        }
    })
}

const typeCache = {}

function qw(query, param) {
    let t = null;

    if( !param){
        return {
            name: 'aa',
            text:query
        }
    }else if(!(t = typeCache[query] )) {
        if ( param[0] == null ) {
            t = param2Type(param)
        }
        else {
            typeCache[query] = t = param2Type(param)
        }
    }

    return {
        name: 'aa',
        text:query,
        values:param,
        types: t
    }
}

function path2GraphElemArray(pathArray) {
    let vertices = {}
    let edges = {}
    pathArray.forEach(path=>{
        path.p.vertices.forEach(vtx=>{
            vertices[`${vtx.id.oid}.${vtx.id.id}`] = {
                id:`${vtx.id.oid}.${vtx.id.id}`,
                label: vtx.label,
                props: vtx.props
            }
        })

        path.p.edges.forEach(edge=>{
            edges[`${edge.id.oid}.${edge.id.id}`] = {
                id:`${edge.id.oid}.${edge.id.id}`,
                label: edge.label,
                source:`${edge.start.oid}.${edge.start.id}`,
                target:`${edge.end.oid}.${edge.end.id}`,
                props: edge.props
            }
        })
    })
    return{
        vertices:Object.values(vertices),
        edges:Object.values(edges)
    }
}

/**
 * pattern이 아닌 그래프 데이터 vertex, edge 조회용 method
 *
 * @param graph   vertex, edge list
 * @returns {{vertices: any[], edges: any[]}}
 */
function all2GraphElemArray(graph) {
    let vertices = {}
    let edges = {}

    graph.forEach(rows => {
        for(idx in rows){
            if(rows[idx] !== null) {
                if(!rows[idx].hasOwnProperty('start') && !rows[idx].hasOwnProperty('end')) {
                    vertices[`${rows[idx].id.oid}.${rows[idx].id.id}`] = makeGraphData(`${rows[idx].id.oid}.${rows[idx].id.id}`, rows[idx].label, rows[idx].props)
                }else{
                    edges[`${rows[idx].id.oid}.${rows[idx].id.id}`] = makeGraphData(
                        `${rows[idx].id.oid}.${rows[idx].id.id}`,
                        rows[idx].label,
                        rows[idx].props,
                        `${rows[idx].start.oid}.${rows[idx].start.id}`,
                        `${rows[idx].end.oid}.${rows[idx].end.id}`
                        )
                }
            }
        }
    })

    return{
        vertices:Object.values(vertices),
        edges:Object.values(edges)
    }
}

// const makeGraphData = (...args) => args.reduce((previous, current) => Object.assign(previous, current))
const makeGraphData = (id,label,props, start, end) => Object.assign({id: id, label: label, props: props}, start ? {source:start}: null, end ? {target:end}: null)

function Graph () {
    this.vertices = {}
    this.edges = {}
    this.getGraph = () => {
        return {
            vertices:Object.values(this.vertices),
            edges:Object.values(this.edges)
        }
    }

    this.addVertex = (id,label,props) => this.vertices[`${id}`] = makeGraphData(id,label,props)
    this.addEdge = (id,label,props,start,end) => (this.edges[`${id}`] = makeGraphData(id,label,props,start,end))

    this.clear = () => {
        this.vertices.clear()
        this.edges.clear()
    }
}

module.exports = {
    query,
    queryWithPool,
    path2GraphElemArray,
    all2GraphElemArray,
    makeGraphData,
    Graph
}
