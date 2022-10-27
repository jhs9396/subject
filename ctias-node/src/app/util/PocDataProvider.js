
import EventEmitter from "./EventEmitter";
import PocApiClient from './PocApiClient'


function path2GraphElemArray(pathArray) {
    let vertices = {}
    let edges = {}

    pathArray.forEach(path=>{
        path.p.vertices.forEach(vtx=>{
            vertices[`${vtx.id.oid}.${vtx.id.id}`] = {
                id:`${vtx.id.oid}.${vtx.id.id}`,
                label: vtx.label,
                props: vtx.props
            }
        })

        path.p.edges.forEach(edge=>{
            edges[`${edge.id.oid}.${edge.id.id}`] = {
                id:`${edge.id.oid}.${edge.id.id}`,
                label: edge.label,
                source:`${edge.start.oid}.${edge.start.id}`,
                target:`${edge.end.oid}.${edge.end.id}`,
                props: edge.props
            }
        })
    })

    return{
        vertices:Object.values(vertices),
        edges:Object.values(edges)
    }
}


export class PocDataProvider extends EventEmitter {
    constructor() {
        super('vertex', 'edge','end','begin', 'table')

        this.api = new PocApiClient('/')
        this.setPattern = this.query;

    }

    async queryByCypher(cypher, params) {

    }

    async queryByPattern(pattern) {
        let result = await this.api.searchPattern(pattern)

        if(result.embedded instanceof Array) {
            return {dataType: 'table', data: result.embedded }
        }else {
            return {dataType: 'graph', data: result.embedded }
        }
    }

    // async expand(vertexId, label) {
    //     let result = await this.api.expand(vertexId, label)
    //
    //     // console.log('result', result)
    //
    //     this.fire('begin')
    //
    //     result.embedded.vertices.forEach(v=>{
    //         this.fire('vertex', v )
    //     })
    //
    //     result.embedded.edges.forEach(e=>{
    //         this.fire('edge', e )
    //     })
    //
    //     this.fire('end')
    // }

    async expandAll(vertexId, label) {
        let result = await this.api.expandAll(vertexId, label)
        return result
    }




}
