const express = require('express');
const router = express.Router();
const db = require('../db/db')
const _template = require('lodash.template');
const range = require('lodash.range');
let {getQueryString} = require("../db/query_repo")
let makeQueryFn = (query, args) => (_template(query)(args))



/**
 * keyword별 label 조회 api
 */
router.post('/latest', (req,res,next)=>{
    let qstr = getQueryString('keyword.latest')

    db.query(qstr)
        .then(rslt=>rslt.rows)
        .then(res.send.bind(res))
        .catch(err=>next(err))
})

/**
 * 타이핑한 키워드와 유사한 키워드 목록 조회 api
 *
 */
router.post('/similar', (req,res,next)=>{
    let {keyword} = req.body
    keyword = keyword.split(":").join("\\:")
    keyword = keyword.split(" ").join("\\ ")
    keyword = keyword.split("\t").join("\\t")

    let qstr = makeQueryFn(getQueryString('keyword.similar'),{keyword})
    db.query(qstr)
        .then(rslt=>rslt.rows)
        .then(res.send.bind(res))
        .catch(err=>next(err))
})

/**
 * 키워드 Enter 입력 시 키워드를 포함한 label 리스트의 element 개수 조회 api
 */
router.post('/label/count', (req,res,next)=>{
    let {keyword} = req.body
    keyword = keyword.split(":").join("\\:")
    keyword = keyword.split(" ").join("\\ ")
    keyword = keyword.split("\t").join("\\t")

    let qstr = makeQueryFn(getQueryString('keyword.label.count'),{keyword})
    db.query(qstr)
        .then(rslt=>rslt.rows)
        .then(res.send.bind(res))
        .catch(err=>next(err))
})

module.exports = router;
