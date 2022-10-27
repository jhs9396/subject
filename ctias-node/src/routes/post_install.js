var express = require('express');
var router = express.Router();
const db = require('../db/db')
const _template = require('lodash.template');
const range = require('lodash.range');
let {getQueryString} = require("../db/query_repo")

/*
* 가정:
*   - agens graph는 설치만 되어 있고 아무 데이타도 없는 상태
*   - node.js application 도 설치만 되어있고 아무것도 설정되어있지 않음
*
* 위 상태에서 node.js 어플리케이션을 실행 시키고 최초에 브라우저에서 서버에 접속했을때 실행해야할 절차들을 이곳에 정리
*
*   - (우선순위 상) connection setting 과 graph path 설정.
*   - (우선순위 상) meta, internal, augmented data 의 DDL 실행
*   - (우선순위 하) etl process
*   - (우선순위 하) etl 이 실행된 경우 meta 에 통계정보를 계산해서 넣는 스크립트 실행
*
*
*
*
*
*  */
router.get('/post_install', function(req, res, next) {

    db.query(qstr)
        .then(rslt=>rslt.rows)
        .then(rslt=>{
            res.send(retValue(req.query, rslt))
        })
        .catch(err=>next(err))


});

/**
 *
 * meta init sql
 *
 *
 with aaa as (
 select jsonb_each_text(p.p) as pp
 from (
 match()-[n]-()
 where label(n) = 'in_group'
 return properties(n) as p
 limit 1
 ) as p
 )
 insert into _CTIAS_META_ATTR_BY_LABEL(graph_type, label, attr_name, attr_type)
 select
 'edge' as graph_type,
 'malware_type' as label,
 (aaa.pp).key as attr_name,
 pg_typeof( (aaa.pp).value )::text::attr_type as attr_type
 from aaa

 ;


 select distinct trim( both ' ' from t1.ctry->>0 ) from (
 match(n:location)
 return n.country as ctry
 ) as t1
 ;



 update _CTIAS_META_ATTR_BY_LABEL
 set enum = (
 with tt01 as (select distinct trim(both ' ' from t1.ctry ->> 0)
 from (
 match(n:ip)
 return n.class as ctry
 ) as t1)
 select array_agg(tt01.btrim)
 from tt01
 where tt01.btrim is not null
 )
 where
 label = 'ip'
 and attr_name = 'class'





 *
 *
 * @type {Router}
 */

module.exports = router;
