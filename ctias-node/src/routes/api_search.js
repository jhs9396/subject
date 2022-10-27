const express = require('express');
const router = express.Router();
const db = require('../db/db');
const mongodb = require('../db/mongodb');
const _template = require('lodash.template');
const range = require('lodash.range');
let {getQueryString} = require("../db/query_repo");

/** dynamic query string by arguments**/
let makeQueryFn = (query, args) => (_template(query)(args))

/** response data format **/
let retValue    = (parameters, embedded) => ({'parameters':parameters, 'embedded':embedded})

/** getting to the similarity result object **/
const makeSimRslt = (sim, msg, props) => ({result:sim, used_method:msg ,used_formula: (props && props !== undefined?'Result = {(Value Similarity)*0.9}+{(Property Similarity)*0.1}':'Result = (Value Similarity)*1.0')})


/** string values similarity promise **/
const promiseStrSim = (str1, str2) => (db.query(getQueryString('api.search.cti.similarity.string'),[str1,str2]))

/** ip values similarity promise **/
const promiseIpSim = (ip1, ip2) => (db.query(getQueryString('api.search.cti.similarity.ip'),[ip1,ip2]))

/** email values similarity promise **/
const promiseEmailSim = (email1, email2, domain1, domain2) => (db.query(getQueryString('api.search.cti.similarity.email'),[email1, email2, domain1, domain2]))

/** location values similarity promise **/
const promiseLocSim = (loc1, loc2) => (db.query(getQueryString('api.search.cti.similarity.location'),[loc1, loc2]))

/** Vertex to Properties similarity promise **/
const promisePropsSim = (label, value) => (db.query(makeQueryFn(getQueryString('api.search.cti.similarity.property'),{label}),[value]))

const calcStrSim = (rslt, props) => makeSimRslt(props && props !== undefined?((rslt.rows[0]['cti_str_similarity'])*0.9)+(props*0.9):rslt.rows[0]['cti_str_similarity'], 'String Similarity', props)

const calcIpSim = (rslt, props) => {
    let ip2number = parseInt(rslt.rows[0]['ip_similarity'])
    let sim = null

    if(ip2number <= 256) sim = 1.0
    else if(256 < ip2number && ip2number <= 65536) sim = 0.2
    else if(65536 < ip2number && ip2number <= 16777216) sim = 0.1
    else sim =  0.0

    return makeSimRslt(props && props !== undefined?(sim*0.9)+(props*0.1):sim, 'IP Similarity', props)
}

const calcEmailSim = (rslt, props) => makeSimRslt(
    props && props !== undefined? ((parseFloat(rslt.rows[0]['email_name_similarity'])*0.9+parseFloat(rslt.rows[0]['email_domain_similarity'])*0.1)*0.9+(props*0.1))
        : parseFloat(rslt.rows[0]['email_name_similarity'])*0.9+parseFloat(rslt.rows[0]['email_domain_similarity']), 'Email Similarity', props
)

const calcLocSim = (rslt, props) => makeSimRslt(props && props !== undefined ?((rslt.size===1 ? 1.0 : 0.0)*0.9+(props*0.1)):rslt.size===1 ? 1.0 : 0.0, 'Location Similarity', props)

const calcPropsSim = (result1, result2) => result1 === result2 ? 1.0 : 0.0

function execSingleSimPromise(label, value1, value2, propsFlag) {
    let props = null
    if(propsFlag){
        promisePropsSim(label, value1).then(rslt=>{
            Promise.all([promisePropsSim(label, value2)]).then(aResult=>{
                props = calcPropsSim(rslt, aResult)
            })
        })
    }
    if('domain' === label.toLowerCase() || 'url' === label.toLowerCase()) return promiseStrSim(value1,value2).then(rslt=>calcStrSim(rslt, props))
    else if('ip' === label.toLowerCase()) return promiseIpSim(value1, value2).then(rslt=>calcIpSim(rslt, props))
    else if('email' === label.toLowerCase()) return promiseEmailSim(value1.split(/@/)[0], value2.split(/@/)[0], value1.split(/@/)[1], value2.split(/@/)[1]).then(rslt=>calcEmailSim(rslt, props))
    else if('location' === label.toLowerCase()) return promiseLocSim(value1, value2).then(rslt=>calcLocSim(rslt, props))
}

function add2ArrPushByCompare(arr1, arr2) {
    if(arr1.length !== arr2.length) {
        for(let i=0; i<Math.abs(arr1.length-arr2.length); i++) {
            if(arr1.length > arr2.length) arr2.push(arr2[i])
            else arr1.push(arr1[i])
        }
    }
}

function push2ArrayByStrChk(label, value, domainArr, ipArr, urlArr, emailArr, locArr) {
    value = value.split(',')
    label.split(',').forEach((v,i)=>{
        'domain' === v.toLowerCase() ? domainArr.push(value[i]) : null
        'ip' === v.toLowerCase() ? ipArr.push(value[i]) : null
        'url' === v.toLowerCase() ? urlArr.push(value[i]) : null
        'email' === v.toLowerCase() ? emailArr.push(value[i]) : null
        'location' === v.toLowerCase() ? locArr.push(value[i]) : null
    })
}

function createMuitlSimVariables (label1, label2, value1, value2, nxmFlag) {
    let domainArr1=[], domainArr2=[], ipArr1=[], ipArr2=[], urlArr1=[], urlArr2=[], emailArr1=[], emailArr2=[], locationArr1=[], locationArr2=[]

    push2ArrayByStrChk(label1, value1, domainArr1, ipArr1, urlArr1, emailArr1, locationArr1)
    push2ArrayByStrChk(label2, value2, domainArr2, ipArr2, urlArr2, emailArr2, locationArr2)

    add2ArrPushByCompare(domainArr1, domainArr2)
    add2ArrPushByCompare(ipArr1, ipArr2)
    add2ArrPushByCompare(urlArr1, urlArr2)
    add2ArrPushByCompare(emailArr1, emailArr2)
    add2ArrPushByCompare(locationArr1, locationArr2)

    return {domainArr1, domainArr2, ipArr1, ipArr2, urlArr1, urlArr2, emailArr1, emailArr2, locationArr1, locationArr2}
}

// todo : properties similar, formula 추가 예정
/**
 * Multi Similarity function by label, value
 *
 * @param req request parameters
 * @param res response object
 * @param next error page
 */
function execMultiSimPromise(req, res, next) {
    let {label1, value1, label2, value2, use_prop_sim, enable_nm_analysis, nxm_flag} = req.query
    let resList = {}
    let pArray = []
    let {domainArr1, domainArr2, ipArr1, ipArr2, urlArr1, urlArr2, emailArr1, emailArr2, locationArr1, locationArr2} = createMuitlSimVariables(label1, label2, value1, value2, nxm_flag)

    domainArr1 && domainArr2 ? domainArr1.map((value,index)=>{ pArray.push(promiseStrSim(domainArr1[index], domainArr2[index])) }) : undefined
    ipArr1 && ipArr2 ? ipArr1.map((value,index)=>{ pArray.push(promiseIpSim(ipArr1[index], ipArr2[index])) }) : undefined
    urlArr1 && urlArr2 ? urlArr1.map((value,index)=>{ pArray.push(promiseStrSim(urlArr1[index], urlArr2[index])) }) : undefined
    emailArr1 && emailArr2 ? emailArr1.map((value,index)=>{ pArray.push(promiseEmailSim(emailArr1[index], emailArr2[index])) }) : undefined
    locationArr1 && locationArr2 ? locationArr1.map((value,index)=>{ pArray.push(promiseLocSim(locationArr1[index], locationArr2[index])) }) : undefined

    Promise.all(pArray).then(resultArray=>{
        resList['result'] = 0
        resultArray.forEach(aResult=>{
            let chkStr = aResult.rows[0]
            if(chkStr.hasOwnProperty('cti_str_similarity')) resList['result'] += calcStrSim(aResult).result
            else if(chkStr.hasOwnProperty('ip_similarity')) resList['result'] += calcIpSim(aResult).result
            else if(chkStr.hasOwnProperty('email_name_similarity')) resList['result'] += calcEmailSim(aResult).result
            else resList['result'] += calcLocSim(aResult).result
        })
        resList['result'] = resList['result'] / resultArray.length
        res.send(retValue(req.query, resList))
    }).catch(err=>next(err))
}

function makePath2Distance(distance, label) {
    if(!distance || distance === 0) {
        return {matchPath: `(v0:${label})`, whereClause: `v0.value = $1`}
    }

    //let matchPath = `(v0:${label})-[r*..${distance+1}]-()`
    let matchPath   = `(v0:${label})`
    let whereClause = `v0.value = $1 `

    for(let i=0; i<distance; i++) {
        matchPath += `-[r${i}]-(v${i+1})`
        whereClause += `AND label(v${i+1}) <> 'groups' AND label(v${i+1}) <> 'indicator' `
    }

    return {matchPath, whereClause}
}

const flatSingle = arr => [].concat(...arr);


// result table
router.get('/result/table', (req, res, next) => {
    let {value,label} = req.query
    let qstr = makeQueryFn(getQueryString("api.search.result.table"), {label})

    db.query(qstr, [value])
        .then((rslt) => {
            res.send(retValue(req.query, rslt.rows))
        })
        .catch(err=>next(err))
});

// Attacker group graph
router.get('/group/graph', (req, res, next) => {
    let {value} = req.query
    let qstr = getQueryString("api.search.group.graph")

    db.query(qstr, [value])
        .then(rslt=>(rslt.rows))
        .then(rows=>{
            let retValue = {}
            qstr = getQueryString("api.search.group.graph1")
            retValue.parameters = req.query;
            retValue.embedded = [];

            let pArray = rows.map(aRow=>db.query(qstr, [aRow.res]))

            Promise.all(pArray).then(resultArray=>{
                resultArray.forEach(aResult=>{
                    retValue.embedded.push(aResult.rows)
                })

                retValue.embedded = flatSingle(retValue.embedded)
                res.send(retValue)
            })
        })
        .catch(err=>next(err))
});


// Attacker group graph
router.get('/group/graph', (req, res, next) => {
    let {value} = req.query
    let qstr = getQueryString("api.search.group.graph_ng")

    db.query(qstr, [value])
        .then(rslt=>{
            retValue.parameters = req.query;
            retValue.embedded = rslt.rows;

            res.send(retValue)
        })
        .catch(err=>next(err))
});

// campaign graph
router.get('/campaign/graph', (req, res, next) => {
    let {value} = req.query
    let qstr = getQueryString('api.search.campaign.graph')

    db.query(qstr, [value])
        .then(rslt=>{
            res.send(retValue(req.query, db.all2GraphElemArray(rslt.rows)))
        })
        .catch(err=>next(err))
})

// mitre attack pattern
router.get('/pattern', (req, res, next) => {
    let {value} = req.query
    let qstr = getQueryString('api.search.pattern.root')

    db.query(qstr, [value])
        .then(rslt=>{
            res.send(retValue(req.query, rslt.rows))
        })
        .catch(err=>next(err))
})

// cti attack pattern graph
router.get('/pattern/graph', (req, res, next) => {
    let {value} = req.query
    let qstr = getQueryString('api.search.pattern.graph2')

    db.query(qstr, [value])
        .then(rslt=>{
            //벡터 사전 키-밸류 값:{backdoor:0,downloader:1,dropper:2,hacktool:3,injector:4,keylogger:5,msil:6,remoteadmin:7,rootkit:8,wiper:9}
            console.log(rslt.rows)
            let vertices = {}
            let edges = {}

            rslt.rows.forEach(row => {
                // intrusion_set vertex
                vertices[`${row.intrusion_set_gid}`] = {
                    id:`${row.intrusion_set_gid}`,
                    label: 'intrusion_set',
                    props: {value:`${row.intrusion_set_name}`}
                }

                row.malware_list.forEach(malware=>{
                    // attack pattern을 가리키는 vertex
                    vertices[malware.code] = {
                        id: malware.code,
                        label: 'pattern',
                        props: {type: malware.type}
                    };

                    // malware vertex
                    vertices[malware.gid] = {
                        id: malware.gid,
                        label: 'malware',
                        props: {value:malware.hash}
                    };

                    // intrusion_set -> malware
                    edges[`${row.intrusion_set_gid}.${malware.code}`] = {
                        id:`${row.intrusion_set_gid}.${malware.code}`,
                        label:'uses',
                        source:`${row.intrusion_set_gid}`,
                        target:malware.code,
                        props: {}
                    };

                    // pattern -> malware
                    edges[`${malware.gid}.${malware.code}`] = {
                        id:`${malware.gid}.${malware.code}`,
                        label:'uses',
                        source:malware.code,
                        target:malware.gid,
                        props: {}
                    }
                })
            })
            res.send(retValue(req.query, {vertices, edges}))
        })
        .catch(err=>next(err))
})

// distance를 기준으로 그래프 조회
// 원래 로직과는 조금 상이하지만 전체 결과를 합쳐서 전달하는게 더 의미가 있을 것
router.get('/cti/info', (req, res, next)=>{
    let {value, label, scope, distance} = req.query

    scope = +scope // type cast

    //pre condition  check
    // fixme : 추가로 필요한 파라메터 체크로직 여기에 ...
    if(scope < 0 || scope > 2) {
        return next(new Error('scope must one of 0,1  or 2'))
    }
    //end of pre condition  check

    switch(scope) {
        case 0:
            Promise.all([
                getGraphData(distance, label, value),
                getMongo2Resrc(value)
            ]).then(([grpRslt, mongoRslt])=>{
                res.send(retValue(req.query, {graphdata:grpRslt, mongodb:mongoRslt}))
            }).catch(err=>next(err))
            break;
        case 1:
            getGraphData(distance, label, value)
                .then(grpRslt=>{
                    res.send(retValue(req.query, {graphdata:grpRslt}))
                }).catch(err=>next(err))
            break;
        case 2:
            getMongo2Resrc(value)
                .then(mongoRslt=>{
                    res.send(retValue(req.query, { mongodb:mongoRslt}))
                }).catch(err=>next(err));
            break;
    }
})


/**
 *
 * @param distance
 * @param label
 * @param value
 * @return {Promise<any[] | never>}
 */
function getGraphData(distance, label, value) {
    let promiseList = range(1,distance)
        .map(i=>{
            makeQueryFn(getQueryString('api.search.cti.info'), makePath2Distance(i,label));
        })
        .map(qstr=>{
            db.query(qstr, [value]);
        })

    return Promise.all(promiseList)
        .then(rsltList=>{
            let pathList = []

            rsltList.forEach(rslt=>{
                pathList.push(db.path2GraphElemArray(rslt.rows))
            })

            return pathList
        })
}

/**
 *
 * @param value
 * @return {Promise<any[] | never>}
 */
function getMongo2Resrc(value) {
    return mongodb.query({value})
}


// cti node search
router.get('/cti/node', (req, res, next) => {
    let {value,pattern,label} = req.query
    let qstr        = null
    let matchPath   = null
    let whereClause = null

    if(pattern !== undefined) {
        let re = /\w+/
        matchPath   = pattern
        whereClause = pattern.match(re)!==null?pattern.match(re)+'.value = $1 ':null
        qstr = makeQueryFn(getQueryString('api.search.cti.node.pattern'), {matchPath, whereClause})
    }else {
        matchPath   = ` (a:${label}) `
        whereClause = ` a.value = $1 `
        qstr = makeQueryFn(getQueryString('api.search.cti.node.other'), {matchPath, whereClause})
    }

    db.query(qstr, [value])
        .then(rslt=>{
            pattern !== undefined ? res.send(retValue(req.query, db.path2GraphElemArray(rslt.rows))) : res.send(retValue(req.query, db.all2GraphElemArray(rslt.rows)))
        })
        .catch(err=>next(err))
})

// CTI graphid search
router.get('/cti/find/graphid', (req, res, next) => {
    let {value,label} = req.query
    let qstr          = makeQueryFn(getQueryString('api.search.cti.find.graphid'), {label})

    db.query(qstr, [value])
        .then(rslt=>(res.send(retValue(req.query, rslt.rows))))
        .catch(err=>next(err))
})

// CTI clusterId search
router.get('/cti/find/clusterid', (req, res, next) => {
    let {graphid} = req.query
    let qstr      = getQueryString('api.search.cti.find.clusterid')

    db.query(qstr, [graphid])
        .then(rslt=>(res.send(retValue(req.query, rslt.rows))))
        .catch(err=>next(err))
})

// CTI regExp similarity search
router.get('/cti/find', (req, res, next) => {
    let {label, value} = req.query
    let regexp         = value.split(/\./).length > 2 ?  value.split(/\./)[0]+"."+value.split(/\./)[1] : null
    let qstr           = makeQueryFn(getQueryString('api.search.cti.find.root'), {label,value,regexp})

    db.query(qstr, [regexp,value])
        .then(rslt=>(res.send(retValue(req.query, rslt.rows))))
        .catch(err=>next(err))
})

// CTI algorithm (page rank, betweenness centrality)
router.get('/cti/rank', (req, res, next) => {
    let {algoOption, value} = req.query
    let qstr = makeQueryFn(getQueryString('api.search.cti.rank.query'), {algoOption})

    db.query(qstr, [value])
        .then(rslt=>(res.send(retValue(req.query, rslt.rows))))
        .catch(err=>next(err))
})

// CTI similarity search
// todo : prop_sim option 추가 필요
// todo : multi similarity 추가 필요
router.get('/cti/similarity', (req, res, next) => {
    let {label1, label2, value1, value2, use_prop_sim, enable_nm_analysis, nxm_flag} = req.query
    if(label1.split(',').length > 1 || label2.split(',').length > 1) return execMultiSimPromise(req, res, next)
    if(label1 !== label2) return next(new Error('label1, label2 must be equal.'))

    execSingleSimPromise(label1, value1, value2, use_prop_sim)
        .then(rslt=>(res.send(retValue(req.query, rslt))))
        .catch(err=>next(err))
})

// cypher query search
router.get('/cypher', (req, res, next) => {
    let {query} = req.query
    db.query(query)
        .then(rslt=>(res.send(retValue(req.query, rslt.rows))))
        .catch(err=>next(err))
})

// fixme : pool 개선 확인
router.get('/cluster', (req, res, next) => {
    let {cluster_id} = req.query
    let q2 = getQueryString("api.search.cluster.root2");

    db.query(getQueryString('api.search.cluster.root'), [cluster_id])
        .then(rslt=>(rslt.rows))
        .then(rows=> {
            let pArray = rows.map(aRow => db.query(q2, [aRow.res]))
            let intrusionSetId = null
            let vertices = {}
            let edges = {}

            Promise.all(pArray).then(resultArray=>{
                resultArray.forEach(aResult=>'intrusion_set' === aResult.rows[0].n.label ? intrusionSetId=`${aResult.rows[0].n.id.oid}.${aResult.rows[0].n.id.id}` : null)
                resultArray.forEach((aResult,idx)=>{
                    let row = aResult.rows[0].n
                    vertices[`${row.id.oid}.${row.id.id}`] = db.makeGraphData(`${row.id.oid}.${row.id.id}`, row.label, row.props)
                    edges[`${row.id.oid}.${row.id.id}.${idx}`] = db.makeGraphData(`${row.id.oid}.${row.id.id}.${idx}`, 'bridge', row.props, `${row.id.oid}.${row.id.id}`, intrusionSetId)
                })
                res.send(retValue(req.query, {vertices, edges}))
            })
        })
        .catch(err=>next(err))
})

// cluster graph search
router.get('/cluster/graph', (req, res, next) => {
    let {value} = req.query
    let graph = new db.Graph

    db.query(getQueryString('api.search.cluster.graph'), [value])
        .then(rslt=>(rslt.rows))
        .then(rows=>{
            let pArray = rows.map(aRow => {
                graph.addVertex(`${aRow.n.id.oid}.${aRow.n.id.id}`, aRow.n.label, aRow.n.props)
                return db.query(getQueryString('api.search.cluster.graph2'), [`${aRow.n.id.oid}.${aRow.n.id.id}`])
            })

            Promise.all(pArray).then(resultArray=>{
                resultArray.forEach(aResult=>{
                    aResult.rows.forEach((row,idx)=>{
                        graph.addVertex(row.cluster_id, 'cluster', {})
                        for(key in graph.vertices) {
                            graph.vertices[key].label !== 'cluster' ? graph.addEdge(`${row.cluster_id}.${idx}`, `bridge`, {}, key, row.cluster_id) : null
                        }
                    })
                })
                res.send(retValue(req.query, graph.getGraph()))
            })
        })
        .catch(err=>next(err))
})

router.get('/cluster/details', (req, res, next) => {
    let {value} = req.query
    let graph = new db.Graph
    let centerId = null

    db.query(getQueryString('api.search.cluster.details'),[value])
        .then(rslt=>rslt.rows)
        .then(rows=>{
            let pArray = rows.map(aRow=>db.query(getQueryString('api.search.cluster.root2'),[aRow.res])
            )

            Promise.all(pArray).then(resultArray=>{
                resultArray.forEach(aResult=>{
                    aResult.rows.forEach(row=>{
                        graph.addVertex(`${row.n.id.oid}.${row.n.id.id}`, row.n.label, row.n.props)
                        row.n.props.value === value ? centerId=`${row.n.id.oid}.${row.n.id.id}` : null
                    })
                })
                for(let key in graph.vertices) key !== centerId ? graph.addEdge(`${key}_edge`, graph.vertices[key].label, {}, key, centerId) : null
                res.send(retValue(req.query, graph.getGraph()))
            })
        })
        .catch(err=>next(err))
})



router.get('/summary/campaign', (req, res, next) => {
    let {cluster_id} = req.query

    db.query(getQueryString('api.search.summary.campaign'), [cluster_id])
        .then(rslt=>res.send(retValue(req.query, rslt.rows)))
        .catch(err=>next(err))
})

router.get('/summary/entropy', (req, res, next) => {
    let {cluster_id} = req.query

    db.query(getQueryString('api.search.summary.entropy'), [cluster_id])
        .then(rslt=>res.send(retValue(req.query, rslt.rows)))
        .catch(err=>next(err))
})

router.get('/summary/attacktype', (req, res, next) => {
    let {campaign_name} = req.query

    db.query(getQueryString('api.search.summary.attacktype'), [campaign_name])
        .then(rslt=>res.send(retValue(req.query, rslt.rows)))
        .catch(err=>next(err))
})

router.get('/summary/size', (req, res, next) => {
    let {cluster_id} = req.query

    db.query(getQueryString('api.search.summary.size'), [cluster_id])
        .then(rslt=>res.send(retValue(req.query, rslt.rows)))
        .catch(err=>next(err))
})

router.get('/summary/ctitype', (req, res, next) => {
    let {label,value} = req.query
    let qstr = makeQueryFn(getQueryString('api.search.summary.ctitype'), {label})

    db.query(qstr, [value])
        .then(rslt=>res.send(retValue(req.query, rslt.rows)))
        .catch(err=>next(err))
})

module.exports = router;
