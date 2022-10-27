import * as d3 from "d3";


export default class PatternBuilder {

    constructor(graphData, container){
        this.dispatch = d3.dispatch('patternResetted')
        this.eventContainer = container
        this.nodes = graphData.nodes
        this.links = graphData.links
        this.pattern = []

        this.resetBuilder = this.resetBuilder.bind(this);
        // this.eventContainer.addEventListener('click', this.resetBuilder)
    }

    on(evtName, handler) {
        this.dispatch.on(evtName, handler)
    }

    resetBuilder(evt){
        // console.log('resetBuilder', evt.target.tagName)
        if(evt.target.tagName == 'circle') return;

        this.pattern = []
        this.dispatch.call('patternResetted')
    }

    /**
     *
     * @param vertexData
     * @param edgeShiftFlag  다음 엣지를 선택하라는 플래그
     */
    append(vertexData, edgeShiftFlag) {
        if(this.pattern.length == 0 || !this.pattern) {
            this.pattern.push(vertexData)
        }else if( this.pattern[this.pattern.length-1].label != vertexData.label) {
            let edgeBetween = this.findAEdgeBetween(this.pattern[this.pattern.length-1], vertexData);
            if(edgeBetween == null ) {
                return
            }else {
                this.pattern.push(edgeBetween)
            }

            this.pattern.push(vertexData)
        }else if(this.pattern.length > 1 && edgeShiftFlag ) {
            let nextEdge = this.findNextEdgeBetween(this.pattern[this.pattern.length-3], vertexData)
            this.pattern[this.pattern.length -2 ] = nextEdge
        }
    }

    findNextEdgeBetween(from,to) {
        let forward = this.links.find(l=> l.key == (from.label +  ':' + to.label))
        let backward = this.links.find(l=> l.key == (to.label +  ':' + from.label))

        let totalLinkLabelCnt = 0

        this._currentSelectedEdgeIndex++
        let fw_label_length = 0
        let bw_label_length = 0

        if(forward ) {
            fw_label_length = forward.labels.length
        }
        if(backward) {
            bw_label_length = backward.labels.length
        }

        totalLinkLabelCnt = fw_label_length + bw_label_length

        this._currentSelectedEdgeIndex = this._currentSelectedEdgeIndex % totalLinkLabelCnt

        if(fw_label_length > this._currentSelectedEdgeIndex) {
            return {gtype:'edge', label:forward.labels[this._currentSelectedEdgeIndex], direction: 'forward'}
        }
        if(bw_label_length > 0) {
            return {gtype:'edge', label: backward.labels[this._currentSelectedEdgeIndex - fw_label_length], direction: 'backward'}
        }

        return null;
    }

    findAEdgeBetween(from, to) {
        let forward = this.links.find(l=> l.key == (from.label +  ':' + to.label))
        let backward = this.links.find(l=> l.key == (to.label +  ':' + from.label))

        let _edge  = null

        if(backward) _edge = {gtype:'edge', label: backward.labels[0], direction:'backward'};
        if(forward ) _edge =  {gtype:'edge', label: forward.labels[0], direction:'forward'};

        if(_edge != null) this._currentSelectedEdgeIndex = 0

        return _edge;
    }

    getPattern() {
        return this.pattern
    }

    setPattern(pattern) {
        this.pattern = pattern
    }

    setGraphInfo(param) {
        this.nodes = param.nodes
        this.links = param.links
    }

    /**
     *
     * @return {labelName : true, ...}
     */
    getInvolvedVertices() {
        return this.pattern.reduce( (memo,p)=>{
            if(p.gtype  == 'vertex') {
                memo[p.label] = true
            }
            return memo
        }, {})
    }

    removePattern(datum) {
        // 0: {id: "url", iw: 576, ih: 512, path: "M528 0H48C21.5 0 0 21.5 0 48v320c0 26.5 21.5 48 48…8V48c0-26.5-21.5-48-48-48zm-16 352H64V64h448v288z", x: 343.5, …}
        // 1: null
        // 2: {id: "malware_type", iw: 496, ih: 512, path: "M248
        // 3
        // 4...
        // this.pattern 중에 datum 뒤에 모두 삭제
        let findIndex = this.pattern.findIndex((p)=>{
            if(p.gtype = 'vertex') {
                return p.label==datum.label
            }else{
                return false
            }
        })
        console.log('find index ', findIndex)

        this.pattern = this.pattern.slice(0, Math.max(0,findIndex-1))

    }

    clearPattern() {
        this.pattern = [];
    }
}
