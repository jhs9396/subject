import * as d3 from "d3";

var sanitizeHtml = require('sanitize-html');

/**
 * 여러 개 path를 통합시켜야 함
 * @param pathListArray
 */
function pathListArr2PathArray(pathListArray) {
    let pathArray = []

    pathListArray.forEach(pathList=>{
        Object.values(pathList).filter(path=>path != null).forEach(path=>{
            let p = {}
            path.vertices.forEach(v=>{
                v.id = `${v.id.oid}.${v.id.id}`
            })
            path.edges.forEach(e=>{
                e.id = `${e.id.oid}.${e.id.id}`
                e.source = `${e.start.oid}.${e.start.id}`
                e.target = `${e.end.oid}.${e.end.id}`
                delete e.start
                delete e.end
            })
            p[`p`] = path
            pathArray.push(p)
        })
    })

    return pathArray
}

export default class PocApiClient {
    constructor(rootEndPoint) {
        this.rootEndPoint = rootEndPoint;
        // this.backEndPoint = "http://localhost:8080/"
        // this.backEndPoint = "http://27.117.163.21:16808/"
        // this.backEndPoint = "http://192.168.0.68:8081/"
        this.setEnvironment = this.setEnvironment.bind(this);
        this.setEnvironment()
    }
    async nodeByKeyword(keyword) {
        return fetch(this.rootEndPoint + 'api/proto/keyword', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({keyword})
        })
            .then(res=>res.json())
            .then(json=>{
                return json.embedded.reduce((memo,v)=>{
                    let obj = {}
                    obj['gtype'] = 'vertex'
                    obj['label'] = v.type
                    obj['params'] = [{name:'value', comp:'=', value:v.value}]

                    memo.push(obj)
                    return memo
                },[])
            })
    }

    async setEnvironment() {
        await fetch(this.rootEndPoint+`api/meta/environment`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({})
        })
            .then(res=>res.json())
            .then(json=>{
                this.backEndPoint = "http://"+
                    json.spring.datasource.host+":"+
                    json.server.port+"/"
                    // "127.0.0.1:"+
                    // "8080/"
            })
    }

    async iocByKeyword(keyword) {
        return fetch(this.rootEndPoint + 'api/proto/keyword', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({keyword})
        })
            .then(res=>res.json())
            .then(json=>{
                return json.embedded.reduce((memo,v)=>{
                    let obj = {}
                    obj['gtype'] = 'vertex'
                    obj['label'] = 'ioc'
                    obj['params'] = [
                        {name:'type',comp:'=',value:v.type},
                        {name:'value', comp:'=', value:v.value}
                    ]

                    memo.push(obj)
                    return memo
                },[])
            })
    }

    async labelByKeyword(keyword) {
        return fetch(this.rootEndPoint + 'api/proto/keyword', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({keyword})
        })
            .then(res=>res.json())
            .then(json=>{
                return json.embedded.reduce((memo,v)=>{
                    memo[v.type]=true;
                    return memo
                },{})
            })
    }

    async findKeywordCandidate(keyword) {
        var errMsg = '';
        return fetch(this.rootEndPoint + 'api/proto/keyword',{
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({keyword})
        })
            .then(res => { 
                if (res.status === 200 || res.status === 201) { // 성공을 알리는 HTTP 상태 코드면
                    return res.json();
                } else {
                    errMsg = 'syntax error in query'
                    if ( errMsg ) alert(errMsg);
                    errMsg = '';
                }
            })
            .then(json=>{
                return json.embedded.reduce((memo,v)=>{
                    let obj={}
                    obj['keyword']=v.value
                    obj['label']=v.type
                    memo.push(obj)
                    return memo
                },[])
            })
    }

    async getMetaGraph() {
        return fetch(this.rootEndPoint + 'api/proto/metagraph')
            .then(res=>res.json())
            .then(json=>{
                let vertexLabels = json.embedded.reduce((memo,p)=>{
                    memo[p.s_name] = true
                    memo[p.t_name] = true
                    return memo;
                },{});

                let nodes = Object.keys(vertexLabels).map(n=>({id:n}));
                let links = d3.nest()
                    .key(d=>d.s_name +':'+d.t_name)
                    .rollup(g=>{
                        let labels = g.map(d=>d.e_name)
                        return {source: g[0].s_name, target: g[0].t_name, labels};
                    })
                    .entries(json.embedded)
                    .map(l=>{
                        l = Object.assign(l, l.value)
                        delete l.value
                        return l
                    });

                return {nodes,links}
            })
    }

    /**
     *
     * @param pattern
     * @return {Promise<any | never>} array of path
     * @author Kwanmo Kim
     */
    async vertexSearch(pattern) {
        return fetch(this.rootEndPoint + 'api/proto/graph_as_vertex',{
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(pattern)
        }).then(res=>res.json()
        ).then(res=>{
            var clean = sanitizeHtml(JSON.stringify(res));
            return JSON.parse(clean);
            // return res;
        })
    }

    /**
     *
     * @param pattern
     * @return {Promise<any | never>} array of path
     */
    async searchPattern(pattern, hook) {
        return fetch(this.rootEndPoint + 'api/proto/graph_as_path',{
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(pattern)
        }).then(res=>res.json()
        ).then(res=>{
            var clean = sanitizeHtml(JSON.stringify(res));
            return JSON.parse(clean);
            // return res;
        })
    }




    async expand(vid, vlabel) {
        let url = this.rootEndPoint + `api/proto/graph/expand`

        return fetch(url,{
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({label:vlabel, id:vid})
        }).then(res=>res.json())
    }


    /**
     * oid + id => vertexId 변환을 이 함수 내에서 한다!!!
     * @param vid
     * @param vlabel
     * @return {Promise<*>}
     */
    async expandAll(vid, vlabel, convHookFn) {
        let url = this.rootEndPoint + `api/expand/all`
        return fetch(url,{
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({label:vlabel, id:vid})
        }).then(res=>res.json())
            .then(pathArr=>{
                return pathArr.map(p=>{
                    p.p.vertices.forEach(v=>{v.id = `${v.id.oid}.${v.id.id}`})
                    p.p.edges.forEach(v=>{
                        v.id = `${v.id.oid}.${v.id.id}`
                        v.source = `${v.start.oid}.${v.start.id}`
                        v.target = `${v.end.oid}.${v.end.id}`
                        delete v.start
                        delete v.end
                    })

                    // if(convHookFn) {
                    //     convHookFn(p.p)
                    // }

                    return p
                })
            })
    }


    async getRecommandPatterns(pattern) {
        let url = this.rootEndPoint + `api/pattern/similar`

        return fetch(url,{
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(pattern)
        }).then(res=>res.json())

    }

    async getCustomGroups(user_id, gid ) {
        let url = this.rootEndPoint + `api/bookmark/cg/list`

        gid = ''+gid

        return fetch(url,{
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({user_id, gid })
        }).then(res=>res.json())
    }

    /*  insert into public.bookmark
        (gid , user_id , group_id , create_datetime ) values ($1, $2, $3, now())
    */
    async addBookmark(gid, user_id, group_id) {
        let url = this.rootEndPoint + `api/bookmark/add`

        return fetch(url,{
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({gid:gid, user_id:user_id, group_id:group_id})
        }).then(res=>res.json())
    }

    async removeBookmark(gid, user_id, group_id) {
        let url = this.rootEndPoint + `api/bookmark/remove`

        return fetch(url,{
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({gid:gid, user_id:user_id, group_id:group_id})
        }).then(res=>res.json())
    }


    appendBlackListHistory(gid, user_id, reason, addOrRemove) {
        let url = this.rootEndPoint + `api/bookmark/bl/append`

        return fetch(url,{
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({gid, user_id, reason, addOrRemove})
        }).then(res=>res.json())

    }

    // target element is vertex
    getGraphElemExtraInfo(gid, user_id) {
        let url = this.rootEndPoint + `api/bookmark/getExtraInfo`

        return fetch(url,{
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({gid, user_id})
        }).then(res=>res.json())
            .then(arr=>{
                let extraInfo =  arr.reduce((memo,item)=>{
                    memo[item.caption] = item.value
                    return memo
                },{})

                return Object.assign({isblacklist: 'false'}, extraInfo)
            })
    }

    async findByPatternAndStartNode(pattern, id, convHookFn) {
        // todo :  rename api url
        let url = this.rootEndPoint + `api/pattern/fromxxx`

        return fetch(url,{
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({pattern, id})
        }).then(res=>res.json())
            .then(pathArr=>{
                // return pathListArr2PathArray(pathArr)
                return pathArr.map(p=>{
                    p.p.vertices.forEach(v=>{v.id = `${v.id.oid}.${v.id.id}`})
                    p.p.edges.forEach(v=>{
                        v.id = `${v.id.oid}.${v.id.id}`
                        v.source = `${v.start.oid}.${v.start.id}`
                        v.target = `${v.end.oid}.${v.end.id}`
                        delete v.start
                        delete v.end
                    })

                    if(convHookFn) {
                        convHookFn(p.p)
                    }

                    return p
                })
            })
    }

    async findMetaStat(label) {
        let url = this.rootEndPoint + `api/proto/graph/meta/stat`

        return fetch(url,{
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({label})
        })
    }

    findSimilar(id) {
        let url = this.rootEndPoint + `api/expand/similar`

        return fetch(url,{
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({id})
        }).then(res=>res.json())
            .then(pathArr=>{
                return pathArr.map(p=>{
                    p.p.vertices.forEach(v=>{v.id = `${v.id.oid}.${v.id.id}`})
                    p.p.edges.forEach(v=>{
                        v.id = `${v.id.oid}.${v.id.id}`
                        v.source = `${v.start.oid}.${v.start.id}`
                        v.target = `${v.end.oid}.${v.end.id}`
                        delete v.start
                        delete v.end
                    })
                    return p
                })
            })
    }

    findClusterMembers(id) {
        let url = this.rootEndPoint + `api/meta/cluster_members`

        return fetch(url,{
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({id})
        }).then(res=>res.json())
    }

    findSimilar2(id, weight, convHookFn) {
        let url = this.rootEndPoint + `api/expand/similar2`
        weight = weight + '';   // number to stirng
        return fetch(url,{
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({id,weight})
        }).then(res=>res.json())
            .then(pathArr=>{
                console.log('pathArr', pathArr);
                return pathArr.map(p=>{
                    p.p.vertices.forEach(v=>{v.id = `${v.id.oid}.${v.id.id}`})
                    p.p.edges.forEach(v=>{
                        v.id = `${v.id.oid}.${v.id.id}`
                        v.source = `${v.start.oid}.${v.start.id}`
                        v.target = `${v.end.oid}.${v.end.id}`
                        delete v.start
                        delete v.end
                    })

                    if(convHookFn) {
                        convHookFn(p.p)
                    }

                    return p
                })
            })
    }

    findIocLabel(value) {
        let url = this.backEndPoint + `api/search/cti/label?value=${value}`

        return fetch(url,{
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(res=>res.json())
    }

    findSimilarValue(value, label) {
        let url = this.rootEndPoint + `api/proto/ioc/similar`

        return fetch(url,{
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({value,label})
        }).then(res=>res.json())
    }

    async findRank(value,option) {
        let url = this.backEndPoint + `api/search/cti/rank?value=${value}&algoOption=${option}`

        return fetch(url,{
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(res=>res.json())
    }
}
