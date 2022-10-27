/**
 * dot notation으로 queryId 를 입력받아 해당하는 query 문을 반환하는 모듈
 * @type {yaml}
 */

const yaml = require('js-yaml');
const fs   = require('fs');

var environmentRepo = null
var queryRepo = null

try {
    queryRepo = yaml.safeLoad(fs.readFileSync('./src/db/query.yaml', 'utf8'));
    environmentRepo = yaml.safeLoad(fs.readFileSync('./veridato-config.yml', 'utf8'))
} catch (e) {
    console.log(e)
    throw e
}

module.exports  = {
    getQueryString(queryId) {
        return queryId.split('.').reduce((memo, key) => memo[key], queryRepo)
    },
    getEnvironment(id) {
        return id.split('.').reduce((memo,key)=>memo[key], environmentRepo)
    },
    environmentRepo
}
