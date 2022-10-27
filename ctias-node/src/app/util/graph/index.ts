// @ts-ignore
import * as d3 from "d3";

// import GWorker from 'worker-loader!./g.worker.js';
// let GWorker = require('worker-loader!./g.worker.js');
let GWorker = require('./g.worker.js');

/**
 * todo :
 * 1. vertext gid index
 * 2. edge gid index
 * 3. string dictionary
 * 4. vertex arraybuffer
 *  4.1. arraybuffer 1 vertex data layout   => ok
 *  4.2  gpu layout test
 *  4.3  gpu rendering test
 * 5. vertex, edge getter for d3
 * 6. filter by string value performance test (ex: ip, domain)
 */

 const MAX_THREAD_COUNT = navigator.hardwareConcurrency


const GraphStrDict = (function() {
    this._dictLastIndex = 1

    this.StrDict = new Map<string,number>()
    this.IdxDict = new Map<number,string>()

    this.str2Index = (str: string)=>{
        let idx = this.StrDict.get(str)
        if(!idx) {
            this.StrDict.set(str, this._dictLastIndex++ )
            this.IdxDict.set(this._dictLastIndex-1, str )
            return this._dictLastIndex-1
        }else {
            return idx;
        }
    }

    this.index2Str = (idx: number) =>{
        return this.IdxDict.get(idx)
    }

    return this;
}).call({})

/**
 * how many float32 data per vertex
 */
const VERTEX_ITEM_F32_COUNT = 19;
/**
 * how many bytes per vertex
 */
const VERTEX_ITEM_SIZE_BYTE = VERTEX_ITEM_F32_COUNT * 4;
const MAX_VERTEX_COUNT = 1024 * 1024

const EDGE_ITEM_F32_COUNT = 7
const EDGE_ITEM_SIZE_BYTE = EDGE_ITEM_F32_COUNT * 4;
const MAX_EDGE_COUNT = 1024 * 1024

const DELETED_MASK = 1;
const selected_MASK = 2;

// const XXXXXX_MASK = 4;
// ...

/**
 * @startuml
 * class VertexArrayItem {

  x float32
  y float32
  z float32
  vx float32
  vy float32

  vz float32
  color uint8[4]
  vertexSize float32
  label uint32
  value uint32

  domain_x float32
  domain_y float32
  domain_z float32
  domain_color float32
  domain_size float32

  flags uint32
  fx float32
  fy float32
  fz float32
}

 *
 *
 * @enduml
 */

const VTX_X_OFFSET = 0
const VTX_Y_OFFSET = 1
const VTX_Z_OFFSET = 2
const VTX_VX_OFFSET = 3
const VTX_VY_OFFSET = 4

const VTX_VZ_OFFSET = 5
const VTX_COLOR_OFFSET = 6
const VTX_SIZE_OFFSET = 7

const VTX_LABEL_OFFSET = 8
const VTX_VALUE_OFFSET = 9

const VTX_DOMAIN_ATTR1_OFFSET = 10
const VTX_DOMAIN_ATTR2_OFFSET = 11
const VTX_DOMAIN_ATTR3_OFFSET = 12
const VTX_DOMAIN_ATTR4_OFFSET = 13
const VTX_DOMAIN_ATTR5_OFFSET = 14

const VTX_FLAGS_OFFSET = 15
const VTX_FX_OFFSET = 16
const VTX_FY_OFFSET = 17
const VTX_FZ_OFFSET = 18




type FoldingPredicates = (any)=>string
type FoldingConfig = Object
type FoldingParam = FoldingPredicates | FoldingConfig





class EventEmitter {
    listeners: any
    supportEvents: any
    constructor(...evtNames) {
        this.listeners = {};
        this.supportEvents = {};

        this.addSupportEvent(evtNames)
    }
    /**
     *
     * @param {string|string[]} evtName
     */
    addSupportEvent(evtName) {
        if (evtName instanceof Array)
            evtName.forEach(evtnm => this.addSupportEvent(evtnm));
        else
            this.supportEvents[evtName] = true;
    }
    /**
     *
     * @param {string} evtName event name
     * @returns {boolean} 이벤트 지원 여부.
     */
    checkSupport(evtName) {
        return !!this.supportEvents[evtName];
    }
    /**
     *
     * @param {string} eventName
     * @param {Callback} callback
     * @param ctx
     */
    on(eventName, callback, ctx) {
        if (!this.checkSupport(eventName)) {
            console.error(`${eventName}은 지원하지 않는 event 입니다. 제공되는 이벤트는 ${Object.keys(this.supportEvents).join(',')} 입니다.`);
            return;
        }
        ctx = ctx ? ctx : this;
        let evtListeners = this.listeners[eventName];
        if (evtListeners) {
            evtListeners.push({ cb: callback, ctx: ctx });
        }
        else {
            this.listeners[eventName] = [{ cb: callback, ctx: ctx }];
        }
    }

    off(eventName, callback) {
        let evtListeners = this.listeners[eventName];
        if (!evtListeners)
            return;
        let idx = evtListeners.findIndex((v) => v.cb == callback);
        if (idx < 0)
            return;
        evtListeners.splice(idx, 1);
    }

    fire(eventName, ...param) {
        let evtListeners = this.listeners[eventName];
        if (!evtListeners)
            return;
        evtListeners.forEach((v) => v.cb.apply(v.ctx, param));
    }
}


let Config = {
    kisa_spamsniper: {
        value_prop_name: 'dtime'
    },
    kisa_ddei: {
        value_prop_name: 'dtime'
    },
    kisa_waf: {
        value_prop_name: 'dtime'
    },
    kisa_osint: {
        value_prop_name: 'dtime'
    },
    network_info: {
        value_prop_name: 'dtime'
    },
    url: {
        value_prop_name: 'value'
    },
    file: {
        value_prop_name: 'value'
    },
    // email: {
    //     value_prop_name: 'source_ip'
    // },
    indicator: {
        value_prop_name: 'name'
    },
    intrusion_set: {
        value_prop_name: 'name'
    },
    malware: {
        value_prop_name: 'md5'
    },
    meta : {
        value_prop_name: 'value'
    },
    attack_pattern: {
        value_prop_name: 'name'
    },
    sender: {
        value_prop_name: 'source_email_address'
    },
    receiver: {
        value_prop_name: 'target_email_address'
    },
    ioc: {
        value_prop_name: 'value'
    },
    ip: {
        value_prop_name: 'value'
    },
    domain: {
        value_prop_name: 'value'
    },
    email: {
        value_prop_name: 'value'
    },
    md5_hash: {
        value_prop_name: 'value'
    },
    unknown: {
        value_prop_name: 'value'
    }


    // email: {
    //     value_prop_name : 'email_address',
    //     default_group_by_attr: 'email_address',
    // },
    //
    // domain: {
    //     value_prop_name: 'value'
    // },
    //
    // ip: {
    //     value_prop_name: 'value'
    // },
    //
    // email_message : {
    //     value_prop_name: 'subject'
    // },
    //
    // email_address : {
    //     value_prop_name: 'value'
    // },
    //
    // url : {
    //     value_prop_name: 'value'
    // },
    //
    // groups : {
    //     value_prop_name: 'dtime'
    // },
    //
    // location : {
    //     value_prop_name: 'value'
    // },
    //
    // malware_type : {
    //     value_prop_name: 'value'
    // },
    //
    // meta : {
    //     value_prop_name: 'value'
    // }

}


class Path {
    edgeList: Link[]
    vertexList: Vertex[]

    constructor() {

    }

    setPaths(agensPathArr) {

    }

}

/**
@startsalt
{
    {T
    + id
    + label
    + props
    + x <<view>>
    + y <<view>>
    + z <<view>>
    + size <<view>>
    + color <<view>>

    + attr1 [float32]
    + attr2 [float32]
    + attr3 [float32]
    + attr4 [float32]
    + attr5 [float32]

    }
}
@endsalt
 */
class Vertex {
    private _parentG: Graph
    id: string
    data: any
    private va_index: number
    private f32Arr: Float32Array
    // 현재 화면에 표시되는 link만 가지고 있다.
    edgeList: Link[]

    // 모든
    neighbors:  Path[]

    // 현재 화면에 표시되는 link중에서 나가고 들어오는거 갯수를 가지고 있는다.
    inDegree: number
    outDegree: number

    cluster_id: number | number[]

    private _fx: number
    private _fy: number

    get label(): string {
        return GraphStrDict.index2Str(this.f32Arr[VTX_LABEL_OFFSET])
    }

    get value(): string {
        return GraphStrDict.index2Str(this.f32Arr[VTX_VALUE_OFFSET])
    }

    get props():number {
        return this.data.props
    }

    get x():number {
        return this.f32Arr[VTX_X_OFFSET]
    }
    set x(v:number) {
        this.f32Arr[VTX_X_OFFSET] = v
    }

    get y():number {
        return this.f32Arr[VTX_Y_OFFSET]
    }
    set y(v:number) {
        this.f32Arr[VTX_Y_OFFSET] = v
    }

    get vx():number {
        return this.f32Arr[VTX_VX_OFFSET]
    }
    set vx(v:number) {
        this.f32Arr[VTX_VX_OFFSET] = v
    }

    get vy():number {
        return this.f32Arr[VTX_VY_OFFSET]
    }
    set vy(v:number) {
        this.f32Arr[VTX_VY_OFFSET] = v
    }

    // todo : how to check fx,fy
    get fx():number |undefined {
        // console.log('----', this._fx)
        return this._fx
        // return this.f32Arr[this.va_index * VERTEX_ARRAY_ITEM_COUNT + 16]
    }
    set fx(v:number) {
        // console.log('vvvv', v)
        this._fx = v

        // this._parentG._forceSimul.restart()
    }

    get fy():number |undefined{
        return this._fy
        // return this.f32Arr[this.va_index * VERTEX_ARRAY_ITEM_COUNT + 17]
    }
    set fy(v:number) {
        this._fy = v
    }


    constructor(g, nodeId, data, va_index, f32Arr) {
        // console.log(data)

        this._parentG = g
        this.id = nodeId;
        this.data = data;
        this.va_index = va_index;
        this.f32Arr = f32Arr;
        this.edgeList = [];

        //
        this.inDegree = 0;
        this.outDegree = 0

        this.cluster_id = []
        // // todo :
        // data = {
        //     label : 'ip',
        //     value : '0.0.0.1'
        // }

        // console.log(data.label, data )

        let labelStrIndex : number = GraphStrDict.str2Index(data.label)
        let valueStrIndex : number = GraphStrDict.str2Index(  data[    Config[data.label].value_prop_name ]  )

        // console.log(data.label, labelStrIndex, GraphStrDict.index2Str(labelStrIndex))

        this.x = Math.random() * 1400;
        this.y = Math.random() * 900;

        // console.log('this.xy' , this.x, this.y)

        this.f32Arr[ VTX_LABEL_OFFSET]  = labelStrIndex;
        this.f32Arr[ VTX_VALUE_OFFSET]  = valueStrIndex;

    }


    getVaIndex(): number {return this.va_index}


    /**
     * todo : domain_x,y,z 를 다시 계산해서 arraybuffer에 반영해야 한다.
     * @param data
     */
    setData(data) {
        this.data = data;
    }

    addLink(link: Link, degreeCount: false) {
        if(this.edgeList.findIndex(l=>l === link) >= 0) {
            // 이미 있는 링크임
            console.warn('Link already exists', link)
            return
        }

        this.edgeList.push(link);
        
        if ( degreeCount ) {
            if(link.fromId == this.id) {
                this.outDegree++
            }else {
                this.inDegree++
            }
        }
    }

    /**
     * 링크 그 자체를 지우는것이 아님 노드내부에 저장하고 있는 링크정보에서 삭제하는 것임
     * @param linkId 노드에 연결된 링크줄 삭제할 링크의 아이디 또는 링크객체
     * @return 삭제된 링크들
     */
    removeLink(linkId : Link | string): Link[] {
        let linkIndex = -1;
        if(linkId instanceof Link ) {
            linkIndex = this.edgeList.findIndex(l=>l === linkId);
        } else {
            linkIndex = this.edgeList.findIndex(l=>l.linkId == linkId);
        }

        return this.edgeList.splice(linkIndex,1);
    }
}


/**
 * 동일 라벨에 대해서만 우선 고려
 */
class FoldedVertex extends Vertex {
    static instanceCnt: number  = 1

    constructor(g,data, va_index, f32Arr ) {
        let nodeId = 'FV.'+ FoldedVertex.instanceCnt++

        super(g, nodeId, data, va_index, f32Arr)


        // this.vertices = []
        // this.rm_edged = []
        // this.cr_edged = []


    }


}


class Link {
    private _parentG: Graph
    fromId: string
    toId: string
    data: any
    linkId: string
    label: string

    /*constructor(g, fromId, toId, data, linkId) {
        this._parentG = g
        this.fromId = fromId;
        this.toId = toId;
        this.data = data;
        this.linkId = linkId
    }*/

    constructor(g, fromId, toId, data, linkId, label) {
        this._parentG = g
        this.fromId = fromId;
        this.toId = toId;
        this.data = data;
        this.linkId = linkId;
        this.label = label;
    }

    setData(data) {
        this.data = data
    }

    get source(): Vertex {
        return this._parentG.getNode(this.fromId)
    }

    get target(): Vertex {
        return this._parentG.getNode(this.toId)
    }

    remove() {
        this.source.removeLink(this.linkId)
        this.target.removeLink(this.linkId)
        this._parentG._linkIndexById.delete(this.linkId)
    }

}


const iterationPerTick = 1

/**
 * 요구사항 및 제약조건
 * node 갯수 max 10만개
 * edge 갯수 max 10만개
 * zero copy
 */
export class Graph extends EventEmitter {

    _nodeIndexById: Map<string,Vertex>
    _foldesNodeIndexById: Map<string,Vertex>
    _linkIndexById: Map<string,Link>

    _nodeArrayBuffer: SharedArrayBuffer
    _edgeArrayBuffer: SharedArrayBuffer

    _nodeF32Array: Float32Array
    _edgeF32Array: Float32Array

    _nodeUint32Array: Uint32Array
    _edgeUint32Array: Uint32Array
    bulkUpdate: boolean
    dirty: boolean // graph 에  layout tick 에 반영이 안된 데이타변경이 있을경우 (force simul에의한 위치변경은 제외) true

    _latestAvailableNodeIndex: number
    _vertextHighWaterMarkIndex: number
    _forceSimul: any
    private forces: any
    private workerPool: any[]

    alpha: number = 1
    alphaTarget: number  = 0
    alphaDecay: number = 0.0228
    velocityDecay: number = 0.4

    private _xScaleDict: Map<string,any>
    private _yScaleDict: Map<string,any>
    private _statistic: any;
    private _graphExtraInfo: any;
    private _forceFactoryFunctDict: any;

    constructor(graphExtraInfo:any = {}) {
        super('changed','tick');

        this.dirty = false
        this._nodeIndexById = new Map();
        this._foldesNodeIndexById = new Map();
        this._linkIndexById = new Map();
        this._xScaleDict = new Map();
        this._yScaleDict = new Map();
        this._forceFactoryFunctDict = {};
        this._graphExtraInfo = graphExtraInfo
        this._statistic = {};
        this.initStatistic()
        this._nodeArrayBuffer = new SharedArrayBuffer(VERTEX_ITEM_SIZE_BYTE * MAX_VERTEX_COUNT);
        this._edgeArrayBuffer = new SharedArrayBuffer(EDGE_ITEM_SIZE_BYTE * MAX_EDGE_COUNT);
        this._nodeF32Array = new Float32Array(this._nodeArrayBuffer);
        this._edgeF32Array = new Float32Array(this._edgeArrayBuffer);
        this._nodeUint32Array = new Uint32Array(this._nodeArrayBuffer);
        this._edgeUint32Array = new Uint32Array(this._edgeArrayBuffer);
        this.bulkUpdate = false

        this.xscalePerLabel = this.xscalePerLabel.bind(this);
        this.yscalePerLabel = this.yscalePerLabel.bind(this);

        /**
         * 현재 사용 가능한 vertex array index
         * @type {number}
         * @private
         */
        this._latestAvailableNodeIndex = 0;
        this._vertextHighWaterMarkIndex = 0

        this._forceSimul = d3.forceSimulation()

        this._forceSimul.force("collide", d3.forceCollide(35))
        this._forceSimul.force("charge", d3.forceManyBody().strength(-200))

        let width = 1280
        let height = 800

        this._forceSimul.force('x', null);

        // this.linkForce.strength(0.001).distance(200)

        //let xs = d3.scaleOrdinal( d3.range(100,10000,400))
        //let xs = d3.scaleOrdinal( d3.range(200,2*(window.innerWidth+window.outerWidth),150))
        let xs = d3.scaleOrdinal( d3.range(350,10000,400))
        // console.log('innerWidth',window.innerWidth)
        // console.log('outerWidth',window.outerWidth)
        // todo : kisa_* -> threat_event
        // let labelArr = ['kisa_spamsniper','kisa_ddei', 'kisa_waf' ,'network_info', 'url', 'email', 'file','sender','receiver','indicator','intrusion_set','attack_pattern','malware']
        // let labelArr = ['ioc','threat_event' ,'network_info', 'url' ,'sender' , 'email', 'file','receiver','indicator','intrusion_set','attack_pattern','malware']
        let labelArr = ['ip','domain','email','md5_hash']

        // labelArr.forEach(v=>xs(v)) // pattern 에 나온 라벨을 먼저 호출해서 화면 왼쪽부터 배치 되도록

        this._forceSimul.force("x", d3.forceX(d=>{
                // if(d.label == 'kisa_spamsniper' || d.label == 'kisa_ddei' || d.label == 'kisa_waf' ) {
                //     return xs('threat_event')
                // }
                // return xs(d.label)
                if(d.data.props.src == 'kisa_spamsniper' || d.data.props.src == 'kisa_ddei' || d.data.props.src == 'kisa_waf') {
                    return xs('threat_event')
                }
                return xs(d.data.props.src)
            }).strength(0.5))

        // this._forceSimul.stop()
        this._forceSimul.on('tick',()=>{
            if(this.dirty) {
                this.fire('tick', {nodes:this.getD3Nodes(),edges: this.getD3Edges()})
                this.dirty = false
            }else {
                this.fire('tick', null)
            }
        })

        this.workerPool = []

        // for(let i=0;i<16;i++) {
        //     let _w: Worker = new GWorker()
        //     _w.postMessage({fncname: 'init',  params:[i, this._nodeArrayBuffer, this._edgeArrayBuffer]})
        //     this.workerPool.push(_w)
        //     _w.addEventListener('message', this.handleEachWorkerDone )
        // }
    }

    /**
     *
     * @param {string} name
     * @param forceFactoryFunc  (xScaleFindFunc, yScaleFindFunc) => d3.force
     * @return {any}
     */
    force(name: string, forceFactoryFunc?: any) {
        this._forceFactoryFunctDict[name] = forceFactoryFunc

        let force = forceFactoryFunc(this.xscalePerLabel, this.yscalePerLabel)
        return this._forceSimul.force(name, force)
    }

    /**
     *
     * @param category 'x' | 'y' | 'angle' | 'distance' ...
     * @param label graph label
     * @param scaleFactoryFunc function which return d3 scale
     */
    setScale(category, label, scaleFactoryFunc) {
        switch(category) {
            case 'x':
                let prevxScale = this._xScaleDict.get(label)
                this._xScaleDict.set(label, scaleFactoryFunc(this._statistic, prevxScale))
                break;

            case 'y':
                let prevyScale = this._yScaleDict.get(label)
                this._yScaleDict.set(label, scaleFactoryFunc(this._statistic, prevyScale))
                break;

            default:
                console.error('unknown category ', category)
                break;

        }
    }

    xscalePerLabel(label) {
        console.log('_xScaleDict',this._xScaleDict)
        return this._xScaleDict.get(label)
    }

    yscalePerLabel(label) {
        return this._yScaleDict.get(label)
    }

    handleEachWorkerDone(evt) {
        console.log('handleEachWorkerDone', evt)
    }

    /**
     * do one cycle of
     * @private
     */
    _tick() {
        var i, nodeCnt = this.getNodesCount(), node;

        for (var k = 0; k < iterationPerTick; ++k) {
            this.alpha += (this.alphaTarget - this.alpha) * this.alphaDecay;

            this.forces.forEach(function(force) {
                force(this.alpha);
            });

            for (i = 0; i < nodeCnt; ++i) {
                // let node = nodes[i];
                let node;
                if (node.fx == null) node.x += node.vx *= this.velocityDecay;
                else node.x = node.fx, node.vx = 0;
                if (node.fy == null) node.y += node.vy *= this.velocityDecay;
                else node.y = node.fy, node.vy = 0;
            }
        }
    }


    addPaths(pathArr: any[]) {
        this.bulkUpdate = true

        // console.log('pathArr', pathArr)
        this._forceSimul.stop()

        pathArr.forEach(p=>{
            // let targetVlist = p.p.vertices.slice(1)
            let edges = p.p.edges

            // console.log(targetVlist, edges)
            // this.addNode( targetV.id, targetV)
            p.p.vertices.forEach(v=>{
                this.addNode(v.id, v)
            })
            // this.addLink( edge.source, edge.target, edge.props, edge.id)
            edges.forEach(e=>{
                this.addLink(e.source, e.target, e.props, e.id, e.label, true)
            })
        })

        this.dirty = true
        this.bulkUpdate = false
        // console.log('b4 force restart')

        this.fire('changed')

        Object.keys(this._forceFactoryFunctDict).forEach(forceName=>{

            // console.log('forceName', forceName )
            this.force(forceName,this._forceFactoryFunctDict[forceName])

        });

        this._forceSimul.alphaTarget(0.1).restart();
    }

    addNode(nodeId, data={}) {
        if (nodeId === undefined) {
            throw new Error('Invalid node identifier');
        }

        if(!this.bulkUpdate) {
            this._forceSimul.stop()
        }

        let existingNode = this._nodeIndexById.get(nodeId);

        if(! existingNode) {

            existingNode = new Vertex(this, nodeId, data
                , this._latestAvailableNodeIndex
                , new Float32Array(this._nodeArrayBuffer, this._latestAvailableNodeIndex * VERTEX_ITEM_F32_COUNT * 4, VERTEX_ITEM_F32_COUNT )
            );

            this._nodeIndexById.set(nodeId, existingNode );
            this._latestAvailableNodeIndex++;

            this._vertextHighWaterMarkIndex = this._latestAvailableNodeIndex

            this.calcStatistic(existingNode)

        }else {
            existingNode.setData(data)
        }


        this._forceSimul.nodes( Array.from(this._nodeIndexById.values()) )

        if(!this.bulkUpdate) {
            // console.log('b4 force restart')
            this._forceSimul.restart()
        }

        this.dirty = true
        return existingNode
    }

    /*addLink(fromId, toId, data, linkId) {
        if (linkId === undefined) {
            throw new Error('Invalid link identifier');
        }

        let existingLink = this._linkIndexById.get(linkId);

        let source = fromId instanceof Vertex ? fromId : this.getNode(fromId)
        let target = toId instanceof  Vertex ? toId : this.getNode(toId)

        if(! existingLink)  {

            existingLink = new Link(this, fromId, toId, data, linkId );
            this._linkIndexById.set(linkId, existingLink );


            let fromNode = this.getNode(fromId);
            fromNode.addLink(existingLink);
            if(fromId !== toId) {
                let toNode = this.getNode(toId);
                toNode.addLink(existingLink)
            }
        }else {
            // todo  : edge 의  from ,  to 가 변경된 경우 어떻게 처리하나?
            existingLink.setData(data)
        }

        this.dirty = true
        return existingLink;
    }*/

    addLink(fromId, toId, data, linkId, label, degreeCount) {
        if (linkId === undefined) {
            throw new Error('Invalid link identifier');
        }

        let existingLink = this._linkIndexById.get(linkId);

        let source = fromId instanceof Vertex ? fromId : this.getNode(fromId)
        let target = toId instanceof  Vertex ? toId : this.getNode(toId)

        if(! existingLink)  {
            if(label === undefined)  existingLink = new Link(this, fromId, toId, data, linkId,undefined);
            else existingLink = new Link(this,fromId,toId,data,linkId,label);
            this._linkIndexById.set(linkId, existingLink );


            let fromNode = this.getNode(fromId);
            fromNode.addLink(existingLink, degreeCount);
            if(fromId !== toId) {
                let toNode = this.getNode(toId);
                toNode.addLink(existingLink, degreeCount)
            }
        }else {
            // todo  : edge 의  from ,  to 가 변경된 경우 어떻게 처리하나?
            existingLink.setData(data)
        }

        this.dirty = true
        return existingLink;
    }

    setFlagAtNode(v:Vertex, mask) {
        let v_idx = v.getVaIndex()
        let flags = this._nodeUint32Array[v_idx*VERTEX_ITEM_F32_COUNT + 15];
        this._nodeUint32Array[v_idx*VERTEX_ITEM_F32_COUNT + 15] = flags | mask
    }

    layoutSimulation(){

    }

    setLayoutOption() {

    }

    /**
     * 1. HashMap에서 삭제
     * 2. Array flag set
     * 3. Vertex에 붙은 edge HashMap 삭제
     *
     */
    removeNode(nodeId) {
        let node = this._nodeIndexById.get(nodeId);
        node.edgeList.forEach(e=>{
            this.removeLink(e.linkId)
        });
        this._nodeIndexById.delete(nodeId);

        this.setFlagAtNode(node, DELETED_MASK)
    }

    // for test
    getRemovedVertex() {
        let deletedIndexs = [];
        for(let idx=0; idx < this._vertextHighWaterMarkIndex ; idx++) {
            if(this._nodeUint32Array[idx*VERTEX_ITEM_F32_COUNT + 15] & DELETED_MASK) {
                deletedIndexs.push(idx)
            }
        }


        return deletedIndexs
    }

    removeLink(linkId:string) {
        let link = this._linkIndexById.get(linkId);
        link.source.removeLink(linkId)
        link.target.removeLink(linkId)
        this._linkIndexById.delete(linkId)
    }

    /**
     *
     * @param nodeId
     * @returns {gid, label, dataProps, viewProps{x,y,z?, color, nodeSize}, edges }
     */
    getNode(nodeId) {
        return this._nodeIndexById.get(nodeId)
    }

    getNodeByValue(value:string) {
        return Array.from(this._nodeIndexById.values()).filter(node=>{
            return node.data.props[Config[node.data.label].value_prop_name] == value
        }).map(node=>{
            return node
        })
    }

    getNodesCount() {
        return this._nodeIndexById.size
    }

    getLinksCount() {
        return this._linkIndexById.size
    }

    getLinks() {

    }


    // paralell version
    forEachNode(fnc, context) {
        // let _this = context || this;
        // for(let v of this._nodeIndexById) {
        //     fnc.call(_this, v)
        // }
    }

    // paralell version
    forEachLink() {

    }

    clear() {
        this._nodeIndexById.clear()
        this._linkIndexById.clear()
    }

    getLink() {

    }

    /**
     * return array of node objects
     */
    getD3Nodes() {
        return Array.from(this._nodeIndexById.values())
    }


    /**
     * return array of edge objects
     */
    getD3Edges() {
        return Array.from(this._linkIndexById.values())
    }

    private initStatistic() {
        Object.keys(this._graphExtraInfo.aggregators.vertex).forEach(vlabel=>{
            let stat4Label = this._statistic[vlabel] = {}
            let aggrTaskInfo = this._graphExtraInfo.aggregators.vertex[vlabel];

            Object.keys(aggrTaskInfo).forEach(attrName=>{
                stat4Label[attrName] =  {}

                Object.keys(aggrTaskInfo[attrName]).forEach(aggrItemName=>{
                    let initVal = aggrTaskInfo[attrName][aggrItemName].initVal
                    stat4Label[attrName][aggrItemName] = initVal
                })
            })
        })
    }

    private calcStatistic(v: Vertex) {
        let aggrTaskInfo = this._graphExtraInfo.aggregators.vertex[v.label];
        if(!aggrTaskInfo) return;

        let stat4Label = this._statistic[v.label] = this._statistic[v.label] || {}
        Object.keys(aggrTaskInfo).forEach(attrName=>{
            stat4Label[attrName] = stat4Label[attrName] || {}

            Object.keys(aggrTaskInfo[attrName]).forEach(aggrItemName=>{
                let prevVal = stat4Label[attrName][aggrItemName] //|| aggrTaskInfo[attrName][aggrItemName].initVal
                stat4Label[attrName][aggrItemName] = aggrTaskInfo[attrName][aggrItemName].aggrFunc(prevVal , v)
            })
        })
    }

    forceRestart() {
        this._forceSimul.alphaTarget(0.1).restart();
    }



    addFoldingRule(foldingPredicates:FoldingParam) :void {
        let predicate:FoldingPredicates

        if (foldingPredicates instanceof Object) {
            let config:FoldingConfig  = foldingPredicates as FoldingConfig
            // todo convert config info to predicates

            //predicate = ...
        }else {
            predicate = foldingPredicates as FoldingPredicates

        }


        let foldingUUID = predicate(/*...*/null)


        //todo : create foldedVertex by foldingUUID
        //todo : remove and store internal folded vertex
        // todo : remove and store internal edge in folded vertex
        let createdFoldeVertex //= //...

        this._foldesNodeIndexById.set('foldingUUID', createdFoldeVertex)
        this.addNode(createdFoldeVertex)

        foldingUUID


    }
}


