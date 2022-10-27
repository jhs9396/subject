const express = require('express');
const router = express.Router();
const db = require('../db/db')
const _template = require('lodash.template');
const range = require('lodash.range');
let {getQueryString,environmentRepo} = require("../db/query_repo")



/**
 * find attr name & type by graph label
 */
router.post('/attr', (req,res,next)=>{
    let {label} = req.body
    let graph_type = 'vertex'

    console.log(req.body)

    let qstr = getQueryString('meta.find_attr')
    console.log('qstr',qstr)
    db.query(qstr,[label, graph_type])
        .then(rslt=>rslt.rows)
        .then(res.send.bind(res))
        .catch(err=>next(err))

})

/**
 * find attr name & type by graph label
 */
router.post('/cluster_members', (req,res,next)=>{
    let {id} = req.body

    let qstr = getQueryString('meta.cluster_members')
    console.log('qstr',qstr)
    db.query(qstr,[id])
        .then(rslt=>rslt.rows)
        .then(rows=>{
            return rows.map(r=>{
                r.nodes = r.nodes.slice(1,-1).split(',')
                return r
            })
        })
        .then(res.send.bind(res))
        .catch(err=>next(err))

})

router.post('/environment', (req,res,next)=>{
    res.send(environmentRepo)
})


module.exports = router;
