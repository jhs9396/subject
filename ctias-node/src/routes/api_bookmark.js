const express = require('express');
const router = express.Router();
const db = require('../db/db')
const _template = require('lodash.template');
let {getQueryString} = require("../db/query_repo")




// custom group =============================

router.post('/cg/add', (req,res,next)=> {
    let {group_id, group_name} = req.body

    let qstr = getQueryString('bookmark.custom_group.add')
    console.log('query string ', qstr)

    db.query(qstr, [group_id, group_name]).then(rslt=>rslt.rows).then(rslt=>{
        res.send( rslt )
    })
    .catch(err=>next(err))
})

router.post('/cg/remove', (req,res,next)=> {
    let {group_id} = req.body

    let qstr = getQueryString('bookmark.custom_group.remove')
    console.log('query string ', qstr)

    db.query(qstr, [group_id]).then(rslt=>rslt.rows).then(rslt=>{
        res.send( rslt )
    })
    .catch(err=>next(err))
})

router.post('/cg/list', (req,res,next)=> {
    let {user_id, gid} = req.body
    let qstr = getQueryString('bookmark.custom_group.list')
    console.log('query string ', qstr)

    db.query(qstr,[user_id, gid]).then(rslt=>rslt.rows).then(rslt=>{
        res.send( rslt )
    })
    .catch(err=>next(err))
})




// bookmark =============================

/**
 *
 */
router.post('/add', (req,res,next)=> {
    let {gid , user_id , group_id} = req.body

    let qstr = getQueryString('bookmark.bookmark.add')

    console.log('query string ', qstr)

    db.query(qstr, [gid,user_id,group_id]).then(rslt=>rslt.rows).then(rslt=>{
        res.send( rslt )
    }).catch(err=>next(err))
})

router.post('/remove', (req,res,next)=> {
    let {gid , user_id , group_id} = req.body

    let qstr = getQueryString('bookmark.bookmark.remove')

    console.log('query string ', qstr)

    db.query(qstr, [gid,user_id,group_id]).then(rslt=>rslt.rows).then(rslt=>{
        res.send( rslt )
    }).catch(err=>next(err))
})

router.post('/list', (req,res,next)=> {

})



// blacklist =============================

router.post('/bl/append', (req,res,next)=> {
    let {gid, user_id, reason, addOrRemove} = req.body

    let qstr = null
    if(addOrRemove == 'add') {
        qstr = getQueryString('bookmark.blacklist.add')
    }else {
        qstr = getQueryString('bookmark.blacklist.remove')
    }

    console.log('query string ', qstr)

    db.query(qstr, [ gid, user_id, reason]).then(rslt=>rslt.rows).then(rslt=>{
        res.send( rslt )
    }).catch(err=>next(err))
})



router.post('/bl/list', (req,res,next)=> {
    let {gid} = req.body


})


//==========

router.post('/getExtraInfo', (req,res,next)=> {
    let {gid, user_id} = req.body

    qstr = getQueryString('bookmark.getExtraInfo')


    console.log('query string ', qstr)

    db.query(qstr, [ gid, user_id]).then(rslt=>rslt.rows).then(rslt=>{
        res.send( rslt )
    }).catch(err=>next(err))
})

module.exports = router;
