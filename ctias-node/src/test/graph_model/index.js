import * as d3 from "d3";
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
const GraphStrDict = (function () {
    this._dictLastIndex = 1;
    this.StrDict = new Map();
    this.IdxDict = new Map();
    this.str2Index = (str) => {
        let idx = this.StrDict.get(str);
        if (!idx) {
            this.StrDict.set(str, this._dictLastIndex++);
            this.IdxDict.set(this._dictLastIndex - 1, str);
            return this._dictLastIndex - 1;
        }
        else {
            return idx;
        }
    };
    this.index2Str = (idx) => {
        return this.IdxDict.get(idx);
    };
    return this;
}).call({});
const VERTEX_ARRAY_ITEM_COUNT = 16;
const VERTEX_ARRAY_ITEM_SIZE_BYTE = VERTEX_ARRAY_ITEM_COUNT * 4;
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
class EventEmitter {
    constructor(...evtNames) {
        this.listeners = {};
        this.supportEvents = {};
        this.addSupportEvent(evtNames);
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
    email: {
        value_prop_name: 'email_address'
    },
    domain: {
        value_prop_name: 'value'
    },
    ip: {
        value_prop_name: 'value'
    }
};
class Vertex {
    // for d3
    // x: number
    // y: number
    // fx: number
    // fy: number
    get x() {
        return this.f32Arr[this.va_index * VERTEX_ARRAY_ITEM_COUNT];
    }
    set x(v) {
        this.f32Arr[this.va_index * VERTEX_ARRAY_ITEM_COUNT] = v;
    }
    get y() {
        return this.f32Arr[this.va_index * VERTEX_ARRAY_ITEM_COUNT + 1];
    }
    set y(v) {
        this.f32Arr[this.va_index * VERTEX_ARRAY_ITEM_COUNT + 1] = v;
    }
    get vx() {
        return this.f32Arr[this.va_index * VERTEX_ARRAY_ITEM_COUNT + 3];
    }
    set vx(v) {
        this.f32Arr[this.va_index * VERTEX_ARRAY_ITEM_COUNT + 3] = v;
    }
    get vy() {
        return this.f32Arr[this.va_index * VERTEX_ARRAY_ITEM_COUNT + 4];
    }
    set vy(v) {
        this.f32Arr[this.va_index * VERTEX_ARRAY_ITEM_COUNT + 4] = v;
    }
    get fx() {
        return this.f32Arr[this.va_index * VERTEX_ARRAY_ITEM_COUNT + 16];
    }
    set fx(v) {
        this.f32Arr[this.va_index * VERTEX_ARRAY_ITEM_COUNT + 16] = v;
    }
    get fy() {
        return this.f32Arr[this.va_index * VERTEX_ARRAY_ITEM_COUNT + 17];
    }
    set fy(v) {
        this.f32Arr[this.va_index * VERTEX_ARRAY_ITEM_COUNT + 17] = v;
    }
    constructor(nodeId, data, va_index, f32Arr) {
        this.id = nodeId;
        this.data = data;
        this.va_index = va_index;
        this.f32Arr = f32Arr;
        this.edgeList = [];
        this.inDegree = 0;
        this.outDegree = 0;
        data = {
            label: 'ip',
            value: '0.0.0.1'
        };
        let labelStrIndex = GraphStrDict.str2Index(data.label);
        let valueStrIndex = GraphStrDict.str2Index(data[Config[data.label].value_prop_name]);
        this.f32Arr[this.va_index * VERTEX_ARRAY_ITEM_COUNT + 8] = labelStrIndex;
        this.f32Arr[this.va_index * VERTEX_ARRAY_ITEM_COUNT + 9] = valueStrIndex;
    }
    /**
     * todo : domain_x,y,z 를 다시 계산해서 arraybuffer에 반영해야 한다.
     * @param data
     */
    setData(data) {
        this.data = data;
    }
    getPosition() {
        let x = this.f32Arr[this.va_index * VERTEX_ARRAY_ITEM_COUNT];
        let y = this.f32Arr[this.va_index * VERTEX_ARRAY_ITEM_COUNT + 1];
        let z = this.f32Arr[this.va_index * VERTEX_ARRAY_ITEM_COUNT + 2];
        return { x, y, z };
    }
    addLink(link) {
        this.edgeList.push(link);
        if (link.fromId == this.id) {
            this.outDegree++;
        }
        else {
            this.inDegree++;
        }
    }
    removeLink(linkId) {
        let linkIndex = this.edgeList.findIndex(l => l.linkId == linkId);
        let retValue = this.edgeList.splice(linkIndex, 1);
        console.log('deleted edge', retValue);
    }
}
class Link {
    constructor(fromId, toId, data, linkId) {
        this.fromId = fromId;
        this.toId = toId;
        this.data = data;
        this.linkId = linkId;
    }
    setData(data) {
        this.data = data;
    }
}
/**
 * 요구사항 및 제약조건
 * node 갯수 max 10만개
 * edge 갯수 max 10만개
 * zero copy
 */
class Graph extends EventEmitter {
    constructor(graphExtraInfo = {}) {
        super('changed');
        this._nodeIndexById = new Map();
        this._linkIndexById = new Map();
        this._nodeArrayBuffer = new ArrayBuffer(4 * 10 * 100000);
        this._nodeF32Array = new Float32Array(this._nodeArrayBuffer);
        // this._nodeUint8Array = new Uint8Array(this._nodeArrayBuffer)
        this._nodeUint32Array = new Uint32Array(this._nodeArrayBuffer);
        /**
         * 현재 사용 가능한 vertex array index
         * @type {number}
         * @private
         */
        this._latestAvailableNodeIndex = 0;
        this._vertextHighWaterMarkIndex = 0;
        this._forceSimul = d3.forceSimulation();
    }
    addNode(nodeId, data) {
        if (nodeId === undefined) {
            throw new Error('Invalid node identifier');
        }
        let existingNode = this._nodeIndexById.get(nodeId);
        if (!existingNode) {
            existingNode = new Vertex(nodeId, data, this._latestAvailableNodeIndex, this._nodeF32Array);
            this._nodeIndexById.set(nodeId, existingNode);
            this._latestAvailableNodeIndex++;
            this._vertextHighWaterMarkIndex = this._latestAvailableNodeIndex;
        }
        else {
            existingNode.setData(data);
        }
        this._forceSimul.nodes(Array.from(this._nodeIndexById.values()));
        this._forceSimul.restart();
        return existingNode;
    }
    addLink(fromId, toId, data, linkId) {
        if (linkId === undefined) {
            throw new Error('Invalid link identifier');
        }
        let existingLink = this._linkIndexById.get(linkId);
        if (!existingLink) {
            existingLink = new Link(fromId, toId, data, linkId);
            this._linkIndexById.set(linkId, existingLink);
            let fromNode = this.getNode(fromId);
            fromNode.addLink(existingLink);
            if (fromId !== toId) {
                let toNode = this.getNode(toId);
                toNode.addLink(existingLink);
            }
        }
        else {
            // todo  : edge 의  from ,  to 가 변경된 경우 어떻게 처리하나?
            existingLink.setData(data);
        }
        return existingLink;
    }
    setFlagAtNode(v_idx, mask) {
        let flags = this._nodeUint32Array[v_idx * VERTEX_ARRAY_ITEM_COUNT + 15];
        this._nodeUint32Array[v_idx * VERTEX_ARRAY_ITEM_COUNT + 15] = flags | mask;
    }
    layoutSimulation() {
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
        node.edgeList.forEach(e => {
            this.removeLink(e.linkId);
        });
        this._nodeIndexById.delete(nodeId);
        this.setFlagAtNode(node.va_index, DELETED_MASK);
    }
    // for test
    getRemovedVertex() {
        let deletedIndexs = [];
        for (let idx = 0; idx < this._vertextHighWaterMarkIndex; idx++) {
            if (this._nodeUint32Array[idx * VERTEX_ARRAY_ITEM_COUNT + 15] & DELETED_MASK) {
                deletedIndexs.push(idx);
            }
        }
        return deletedIndexs;
    }
    removeLink(linkId) {
        let link = this._linkIndexById.get(linkId);
        this._nodeIndexById.get(link.fromId).removeLink(linkId);
        this._nodeIndexById.get(link.toId).removeLink(linkId);
        this._linkIndexById.delete(linkId);
    }
    /**
     *
     * @param nodeId
     * @returns {gid, label, dataProps, viewProps{x,y,z?, color, nodeSize}, edges }
     */
    getNode(nodeId) {
        return this._nodeIndexById.get(nodeId);
    }
    getNodesCount() {
        return this._nodeIndexById.size;
    }
    getLinksCount() {
        return this._linkIndexById.size;
    }
    getLinks() {
    }
    forEachNode(fnc, context) {
        // let _this = context || this;
        // for(let v of this._nodeIndexById) {
        //     fnc.call(_this, v)
        // }
    }
    forEachLink() {
    }
    clear() {
    }
    getLink() {
    }
    /**
     * return array of node objects
     */
    getD3Nodes() {
    }
    /**
     * return array of edge objects
     */
    getD3Edges() {
    }
}
module.exports = Graph;
