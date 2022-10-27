const express = require('express');
const router = express.Router();
const db = require('../db/db');
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
const promiseStrSim = (str1, str2) => (db.query(getQueryString('proto.search.similarity.string'),[str1,str2]))

/** ip values similarity promise **/
const promiseIpSim = (ip1, ip2) => (db.query(getQueryString('proto.search.similarity.ip'),[ip1,ip2]))

/** email values similarity promise **/
const promiseEmailSim = (email1, email2, domain1, domain2) => (db.query(getQueryString('proto.search.similarity.email'),[email1, email2, domain1, domain2]))

/** location values similarity promise **/
const promiseLocSim = (loc1, loc2) => (db.query(getQueryString('proto.search.similarity.location'),[loc1, loc2]))

/** Vertex to Properties similarity promise **/
const promisePropsSim = (label, value) => (db.query(makeQueryFn(getQueryString('proto.search.similarity.property'),{label}),[value]))

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

const calcEmailSim = (rslt, props) => makeSimRslt(
    props && props !== undefined? ((parseFloat(rslt.rows[0]['email_name_similarity'])*0.9+parseFloat(rslt.rows[0]['email_domain_similarity'])*0.1)*0.9+(props*0.1))
        : parseFloat(rslt.rows[0]['email_name_similarity'])*0.9+parseFloat(rslt.rows[0]['email_domain_similarity']), 'Email Similarity', props
)

const calcLocSim = (rslt, props) => makeSimRslt(props && props !== undefined ?((rslt.size===1 ? 1.0 : 0.0)*0.9+(props*0.1)):rslt.size===1 ? 1.0 : 0.0, 'Location Similarity', props)

function makeMatchVertex(pattern) {
  //console.log('pattern',pattern)
  if(pattern[0].params.length > 0) {
    return `(a:${pattern[0].label} {${pattern[0].params[0].name}:'${pattern[0].params[0].value}'})`
  }
  return `(a:${pattern[0].label})`
}

function makeCypherQuery2Vertex(pattern) {
    let whereClause = ''
    let matchClause = pattern.map(p=>{
        if(p.gtype == 'vertex'){
            whereClause += ` AND a.type = '${p.label}'`
            if(p.params.length>0){
                p.params.forEach((d,i)=>{
                    if(i==0) {
                        whereClause += ` AND a.${d.name} = '${d.value}'`
                    }else{
                        whereClause += ` OR a.${d.name} = '${d.value}'`
                    }
                })
            }
            return `(a:ioc)`
        }else{

        }
    })

    return {
        matchClause:matchClause,
        whereClause:whereClause
    }
}

function makeMatchPath(pattern) {
  console.log('pattern', pattern)

  return pattern.map((p)=>{
    if(p.gtype == 'vertex'){ //vertex
        if(p.params.length > 0){
          return `(:${p.label} {${p.params[0].name}:'${p.params[0].value}'})`
        }
        return `(:${p.label})`
    }else{ //edge
      if(p.direction == 'forward'){
        return `-[:${p.label}]->`
      }else{
        return `<-[:${p.label}]-`
      }
    }
  }).join(' ')
}

function makeCypherQuery(pattern) {
    let whereClause = ''
    let matchClause = pattern.map((p,idx)=>{
        if(p.gtype == 'vertex'){ //vertex
            if(p.params.length > 0) {
                p.params.forEach((d,i)=>{
                    if(i == 0){
                        whereClause += ` AND v${idx}.${d.name} = '${d.value}'`
                    }else{
                        whereClause += ` OR v${idx}.${d.name} = '${d.value}'`
                    }
                })
            }
            return `(v${idx}:${p.label})`
        }else{ //edge
            if(p.direction == 'forward'){
                return `-[:${p.label}]->`
            }else{
                return `<-[:${p.label}]-`
            }
        }
    }).join(' ')

    return {
        matchClause:matchClause,
        whereClause:whereClause
    }
}

function makePatternSignature(pattern) {
  return pattern.map((p)=>{
    if(p.gtype == 'vertex'){ //vertex
      return `(:${p.label})`
    }else{ //edge
      if(p.direction == 'forward'){
        return `-[:${p.label}]->`
      }else{
        return `<-[:${p.label}]-`
      }
    }
  }).join(' ')
}

/**
 * 1차 goals : (얘 찾기)-[]->()-[]->(얘 찾기)
 * 2차 goals : (얘찾기)-[]-()-[]->()-[]-(얘찾기) // 1차에서 찾아진 노드를 중심으로 1 path 연결된 노드 찾기
 * ip : 13 oid   -- id가 들어갈 곳은 source / target
 *
 * @param id
 * @param meta
 * @returns {*[]}
 */
function searchNodes(id, meta) {
  let nodes = []
  let nodesId2Phase = []

  let format = (node, path) => ({'node':node, 'path':path})

  nodesId2Phase = meta.map(obj=>{
    obj.source==id ? nodes.push(format(obj.t_name,1)) : (obj.target==id ? nodes.push(format(obj.s_name,1)) : undefined)
    return obj.source==id ? obj.target : (obj.target==id ? obj.source : undefined)
  })

  meta.forEach(obj=>{
    nodesId2Phase.filter(distinct).forEach(value=>{
      obj.source == value ? nodes.push(format(obj.t_name,2)) : (obj.target == value ? nodes.push(format(obj.s_name,2)) : undefined)
    })
  })

  return nodes.filter(distinctObj)
}

function searchEdges(source, target, meta) {
  let edges = []
  let format = (id, label, start, end) => ({'id':id, 'label':label, 'source': start, 'target':end})

  meta.forEach(obj=>{
    if(obj.source == source && obj.target == target) {
      edges.push(format(obj.edge, obj.e_name, source, target))
    }else if(obj.source == target && obj.target == source) {
      edges.push(format(obj.edge, obj.e_name, target, source))
    }
  })

  return edges
}

const distinct = (value, index, self) => self.indexOf(value) === index
const distinctObj = (value, index, self) => self.map(obj=>obj['node']).indexOf(value['node']) === index


/* TEST DB CONNECTION. */
router.get('/test', (req, res, next) => {
  let qstr = getQueryString('test')
  db.query(qstr).then(rslt=>{console.log(rslt.rows)})
})

/**
 * keyword별 label 조회 api
 */
router.post('/keyword', (req,res,next)=>{
  let {keyword} = req.body
  keyword = keyword.split(":").join("\\:")
  keyword = keyword.split(" ").join("\\ ")
  keyword = keyword.split("\t").join("\\t")

  let qstr = makeQueryFn(getQueryString('proto.search.keyword'),{keyword})
  qstr += ' LIMIT 50';
  console.log('qstr >>>>>>>>>>', qstr);

  db.query(qstr)
    .then(rslt=>rslt.rows)
    .then(rslt=>{
      res.send(retValue(req.query, rslt))
    })
    .catch(err=>next(err))
})

router.get('/metagraph', (req,res,next)=>{
    let qstr = getQueryString('proto.search.metagraph')
    db.query(qstr)
    .then(rslt=>rslt.rows)
    .then(rslt=>{
        res.send(retValue(req.query, rslt))
    })
    .catch(err=>next(err))
})


// todo : pattern 에 1개만 넘어왔을경우 처리
// todo : pattern 에 아무것도 없을경우 처리

router.post('/graph', (req,res,next)=>{
  let pattern = req.body

  console.log(req.body)
  // query string 생성
  let matchClause =  makeMatchPath(pattern)
  let qstr = makeQueryFn(getQueryString('proto.search.graph.root'), {matchClause})
  console.log('qstr',qstr)

  db.query(qstr)
  .then(rslt=>rslt.rows)
  .then(rslt=>{
    res.send(retValue(req.query, db.path2GraphElemArray(rslt)))
  })
  .catch(err=>next(err))
})

router.post('/graph_as_vertex', (req,res,next)=>{
  let pattern = req.body
    console.log('pattern',pattern[0][`params`])
  // query string 생성
  // let matchClause =  makeMatchVertex(pattern)
  let {matchClause,whereClause} = makeCypherQuery2Vertex(pattern)
  let signaturePattern = makePatternSignature(pattern)

  let qstr = makeQueryFn(getQueryString('proto.search.graph.single'), {matchClause,whereClause})
  // let cntQry = getQueryString('internal.pattern_count')
  //console.log('cntQry',cntQry)

  // SELECT pattern list
  /**
   * 일단은 pattern_signature 값이 중복되지 않도록
   * SELECT count(*) AS cnt FROM _CTIAS_INTERNAL_SEARCH_PATTERN WHERE pattern_signature = $1
   */
  //console.log("here#1")
  // Promise.all(
  //     [db.query(cntQry,[signaturePattern])]
  // ).then(aResult=>{
  //   if(aResult[0].rows[0].cnt==0) {
  //     let qstr2 = getQueryString('internal.pattern_insert')
  //     db.query(qstr2, [signaturePattern, pattern])
  //   }
  //
  //   console.log('qstr',qstr)
  //   db.query(qstr)
  //       .then(rslt=> rslt.rows)
  //       .then(rslt=>{
  //         console.log('rslt',rslt)
  //         res.send(retValue(req.query, rslt))
  //       })
  //       .catch(err=>next(err))
  // })
  db.query(qstr)
      .then(rslt=> rslt.rows)
      .then(rslt=>{
          res.send(retValue(req.query, rslt))
      })
      .catch(err=>next(err))
})

router.post('/graph_as_path', (req,res,next)=>{
  let pattern = req.body

  // query string 생성
  // let matchClause =  makeMatchPath(pattern)
  let {matchClause, whereClause} = makeCypherQuery(pattern)
  let signaturePattern = makePatternSignature(pattern)

  let qstr = makeQueryFn(getQueryString('proto.search.graph.root'), {matchClause,whereClause})
  console.log('qstr',qstr)
  let cntQry = getQueryString('internal.pattern_count')
  console.log('cntQry',cntQry)
  // SELECT pattern list
  /**
   * 일단은 pattern_signature 값이 중복되지 않도록
   * SELECT count(*) AS cnt FROM _CTIAS_INTERNAL_SEARCH_PATTERN WHERE pattern_signature = $1
   */
  Promise.all(
      [db.query(cntQry,[signaturePattern])]
  ).then(aResult=>{

    if(aResult[0].rows[0].cnt==0) {
      let qstr2 = getQueryString('internal.pattern_insert')
      db.query(qstr2, [signaturePattern, pattern])
    }

    db.query(qstr)
        .then(rslt=>rslt.rows)
        .then(rslt=>{
          res.send(retValue(req.query, rslt))
        })
        .catch(err=>next(err))

  })
})




router.post('/graph/expand', (req,res,next)=>{
  let {label, id} = req.body

  let qstr = makeQueryFn(getQueryString('proto.search.graph.expand'),{label,id})

  db.query(qstr).then(rslt=>rslt.rows).then(rslt=>{
    res.send(retValue(req.body, db.path2GraphElemArray(rslt)))
  })
  .catch(err=>next(err))
})




/**
 * fixme : expand summary 1차 개발 완료
 * // vertex 누르면 expand -> group by label distinct (vertex)
 * 1 depth expand 의
 * edge_label, vertex_label, count 를 리턴
 *
 * embedded : [
 *    { elabel: "send_to", vlabel: "email_address", count: 100 }
 * ]
 *
 */
router.post('/graph/expand_summary', (req,res,next)=>{
  let {label, id} = req.body
  let qstr = makeQueryFn(getQueryString('proto.search.graph.expand_info'), {label,id})

  db.query(qstr)
  .then(rslt=>rslt.rows)
  .then(rslt=>{
    res.send(retValue(req.body, rslt))
  })
});

/**
 * todo
 * label  입력받으면
 * 해당 라벨이 가진 속성과 속성의 타입과 관련 통계정보를 리탄한다.
 * 속성이 number 인경우
 * 전체 db에서 해당속성의 min, max, avg 를 리턴한다
 *
 * 해당속성의 타입이 date-time 인경우
 * 전체 db에서 해당속성의 min, max 를 리턴한다
 *
 * 해당속성의 타입이 string(enum) 인경우
 * 전체 db에서 해당속성의 distinct 및 count 를 리턴한다.
 * enum : {}
 *
 * @param body.label string vertex or edge  label
 *
 *
 *
 *
 * embeded : [
 * {name: "address" , type: "string", enum: false},
 * {name: "send_date" , type: "date", min: "2018/12/12 23:33:10" , max: "2019/02/01 12:11:30" },
 * {name: "send_day" , type: "string", enum: {"월":1200,"화":3000,"수":50,"목","금","토","일"}},
 * {name: "delay_time" , type: "number", min: 2 , max: 2300, avg: 14},
 * ]
 *
 *  CREATE TABLE cti_meta_props (
 *     label text,
 *     attr_name text,
 *     attr_type text,
 *     enum json
 *   );
 *   INSERT INTO cti_meta_props(
 *   SELECT t1.label, t1.key, t1.type, json_object_agg(t1.value, t1.cnt)
 *   FROM (SELECT to_string(g1.label) AS label, j.key AS key, json_typeof(j.value) AS type, to_string(j.value::text::jsonb) AS value, count(*) AS cnt FROM (MATCH (a:groups) RETURN label(a) AS label, properties(a) AS prop) g1, json_each(g1.prop::json) j WHERE j.key = 'risk_level' GROUP BY g1.label, j.key, json_typeof(j.value), j.value::text) t1
 *   GROUP BY t1.label, t1.key, t1.type
 *   );
 */

// fixme : node meta stat 1차 개발 완료
router.post('/graph/meta/stat', (req,res,next)=>{
    let {label} = req.body
    let qstr = getQueryString('proto.search.graph.meta.stat')

    db.query(qstr, [label])
        .then(rslt=>rslt.rows)
        .then(rslt=>{
            res.send(retValue(req.body, rslt))
        })
});


router.post('/ioc/vertex', (req,res,next)=>{
    // let {label} = req.body
    let qstr = getQueryString('proto.ioc.indicator')
    let pArr = []

    db.query(qstr)
    .then(rslt=>rslt.rows)
    .then(rslt=>{
        rslt.forEach(row=>{
            // console.log('row', row)
            if(row[`ip_list`].length > 0){
                row[`ip_list`].forEach(ip=>{
                    let id = row[`id`]
                    let insertQuery = makeQueryFn(getQueryString('proto.ioc.vertex'),{id,ip})
                    // pArr.push(db.query(insertQuery))
                    console.log(insertQuery+';')
                })
            }
        })
    })

    // Promise.all(pArr)
    // .then(rslt=>{
    //   console.log(rslt)
    // })
});

router.post('/ioc/similar', (req,res,next)=>{
    let {value,label} = req.body
    let regxVal = null
    if(value.split('\.').length > 2) regxVal = value.split('\.')[0]+'.'+value.split('\.')[1];
    let qstr = makeQueryFn(getQueryString('proto.search.ioc.similar'),{regxVal})
    console.log('qstr',qstr)

    db.query(qstr, [label,value])
        .then(rslt=>rslt.rows)
        .then(res.send.bind(res))
        .catch(err=>next(err))
})


const flatSingle = arr => [].concat(...arr);


module.exports = router;
