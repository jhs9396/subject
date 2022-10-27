const express = require('express');
const router = express.Router();
const db = require('../db/db')
const _template = require('lodash.template');
const range = require('lodash.range');
let makeQueryFn = (query, args) => (_template(query)(args))
let {getQueryString} = require("../db/query_repo")

function makeCypherQuery(pattern) {
    // match ().. where ...

    let matchStr = pattern.map((p,idx)=>{
        if(p.gtype == 'vertex'){ //vertex
            return `(v${idx}:${p.label})`
        }else{ //edge
            if(p.direction == 'forward'){
                return `-[:${p.label}]->`
            }else{
                return `<-[:${p.label}]-`
            }
        }
    }).join(' ')

    let whereStr = pattern.filter((p,idx)=>{
        p.arrIndex = idx
        return p.gtype=='vertex' && p.params.length >0
    }).map(v=>{
        return v.params.map(p=>{
            switch(p.name) {
                case '$id' :
                    return `and id(v${v.arrIndex}) = ${p.value} `
                    break;
                default:
                    return `and v${v.arrIndex}.${p.name} = ${p.value} `
            }
        }).join('\n')
    })

    return 'MATCH p='+matchStr+' WHERE 1=1 '+whereStr+' RETURN p limit 50'
}

function makeAttackDetectionQuery(pattern) {
    let coreNode = null
    const matchFormat = "MATCH "
    const optionalMatchFormat = "OPTIONAL MATCH "

    let matchStr = matchFormat +'p='+ Object.values(pattern["1"]).map((p,idx)=>{
        if(p.gtype == 'vertex'){ //vertex
            if(idx === pattern["1"].length-1) {
                coreNode = `(v${idx})`
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
    let matchArr = []
    Object.keys(pattern).filter(key=>{
        return key != 1
    }).forEach((key,idx)=>{
        matchArr.push(optionalMatchFormat + `p${idx}=` + coreNode + pattern[key].map((p,idx)=>{
            if(p.gtype == 'vertex'){ //vertex
                return `(:${p.label})`
            }else{ //edge
                if(p.direction == 'forward'){
                    return `-[:${p.label}]->`
                }else{
                    return `<-[:${p.label}]-`
                }
            }
        }).join(' '))
    })

    matchArr.forEach(str=>{
        matchStr += '\n'+str
    })

    let whereStr = pattern["1"].filter((p,idx)=>{
        p.arrIndex = idx
        return p.gtype=='vertex' && p.params.length >0
    }).map(v=>{
        return v.params.map(p=>{
            switch(p.name) {
                case '$id' :
                    return `and id(v${v.arrIndex}) = ${p.value} `
                    break;
                default:
                    return `and v${v.arrIndex}.${p.name} = ${p.value} `
            }
        }).join('\n')
    })

    return matchStr+' WHERE 1=1 '+whereStr+' RETURN p '+ matchArr.map((str,idx)=>`,p${idx}`).join(' ') +' limit 50'
}

/**
 * 최근 사용한 패턴 조회
 */
router.post('/latest', (req,res,next)=>{
    let qstr = getQueryString('pattern.latest.root')

    db.query(qstr)
    .then(rslt=>rslt.rows)
    .then(res.send.bind(res))
    .catch(err=>next(err))
})

/**
 * 키워드를 포함한 최근 패턴 조회 api
 * 단일 키워드에 대해서만 조회 가능
 */
router.post('/latest/keyword', (req,res,next)=> {
    let {keyword} = req.body
    let qstr = getQueryString('pattern.latest.keyword')

    db.query(qstr, [keyword])
    .then(rslt=>rslt.rows)
    .then(res.send.bind(res))
    .catch(err=>next(err))
})

function makePatternSignature(pattern) {
    console.log('pattern', pattern)

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
 * todo : implement , test http
 */
router.post('/similar', (req,res,next)=> {
    let pattern = req.body

    let pattern_str = makePatternSignature(pattern)

    // pattern_str = pattern_str.split(":").join("\\:")
    // pattern_str = pattern_str.split(" ").join("\\ ")
    // pattern_str = pattern_str.split("\t").join("\\t")

    pattern_str = pattern_str.replace(/(\W)/g, '\\$1')

    let qstr = makeQueryFn(getQueryString('pattern.similar'),{pattern_str})

    db.query(qstr)
        .then(rslt=>rslt.rows)
        .then(res.send.bind(res))
        .catch(err=>next(err))
})

// second page에서 attack detection을 하는 경우
// label에 따라 구분되는 pattern과 id를 전달받아 pattern 조회 결과 반환
router.post('/fromxxx', (req,res,next)=> {
    let {pattern,id} = req.body

    // console.log(makeAttackDetectionQuery(pattern))
    // let qstr  = makeAttackDetectionQuery(pattern)
    // let qstr = makeCypherQuery(pattern)
    let pArr = Object.values(pattern).map(p=>{
        console.log('qqq', makeCypherQuery(p))
        return db.query(makeCypherQuery(p))
    })

    Promise.all(pArr)
    .then(resultArr=>{
        let resArr = []
        resultArr.forEach(result=>{
            result.rows.forEach(row=>{
                resArr.push(row)
            })
        })
        res.send(resArr)
    })

    // db.query(qstr)
    // .then(rslt=>rslt.rows)
    // .then(res.send.bind(res))
    // .catch(err=>next(err))
})

module.exports = router;
