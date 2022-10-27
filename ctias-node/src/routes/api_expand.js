const express = require('express');
const router = express.Router();
const db = require('../db/db')
const _template = require('lodash.template');
const range = require('lodash.range');
let {getQueryString} = require("../db/query_repo")


/**
 * 전체 expand count 를 조회
 */
router.post('/count', (req,res,next)=>{

})

/**
 * taget vertex label 별 페이징
 */
router.post('/pagingbylabel', (req,res,next)=> {

})

/**
 *
 */
router.post('/all', (req,res,next)=> {
    let {label, id} = req.body

    let qstr = _template(getQueryString('expand.all'))({label, id})

    db.query(qstr, [id])
    .then(rslt=>rslt.rows)
    .then(rslt=>{
        res.send( rslt )
    })
    .catch(err=>next(err))
})

router.post('/similar', (req,res,next)=> {
    let { id} = req.body

    let qstr = getQueryString('expand.similar')

    console.log('query string ', qstr)

    db.query(qstr, [id]).then(rslt=>rslt.rows).then(rslt=>{
        res.send( rslt )
    })
    .catch(err=>next(err))
})

router.post('/similar2', (req,res,next)=> {
    let {id,weight} = req.body

    let qstr = getQueryString('expand.similar2')

    console.log('query string ', qstr)

    db.query(qstr, [id,weight])
    .then(rslt=>rslt.rows)
    .then(rslt=>{
        res.send( rslt )
    })
    .catch(err=>next(err))
})

module.exports = router;
