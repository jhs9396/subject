import * as d3 from "d3";
import EventEmitter from "../util/EventEmitter";
import PatternBuilder from "../util/PatternBuilder";
import {LABEL_MAP_FN} from '../util/Common'
import {ICON_DICT} from './resource/icon'

require('./MetaGraph.styl')

const SvgOuterHtml = `
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" class="metagraph">
          <g class="main">
            <g class="edgeGrp">
            </g>
            <g class="vertexGrp">
            </g>
          </g>
    
          <g class="result">
          </g>
    
          <g class="interude">
          </g>
    
          <defs>
            <marker id="arrowhead" refX="0" refY="2" orient="auto" markerUnits="strokeWidth" markerWidth="5"
              markerHeight="4">
              <path d="M 0,1 V 3 L3,2 Z" fill="#337" stroke="#337">
              </path>
            </marker>
    
            <pattern id="odkzl" patternUnits="userSpaceOnUse" width="20" height="20">
              <circle cx="10" cy="10" r="2" fill="#343434" stroke="#343434" stroke-width="0"></circle>
              <circle cx="0" cy="0" r="2" fill="#343434" stroke="#343434" stroke-width="0"></circle>
              <circle cx="0" cy="20" r="2" fill="#343434" stroke="#343434" stroke-width="0"></circle>
              <circle cx="20" cy="0" r="2" fill="#343434" stroke="#343434" stroke-width="0"></circle>
              <circle cx="20" cy="20" r="2" fill="#343434" stroke="#343434" stroke-width="0"></circle>
            </pattern>
            <pattern id="kfjdh" patternUnits="userSpaceOnUse" width="4" height="4">
              <path d="M 0,4 l 4,-4 M -1,1 l 2,-2 M 3,5 l 2,-2" stroke-width="1" shape-rendering="auto" stroke="#343434"
                stroke-linecap="square"></path>
            </pattern>
            <pattern id="cnhcj" patternUnits="userSpaceOnUse" width="4" height="4">
              <path d="M 0,4 l 4,-4 M -1,1 l 2,-2 M 3,5 l 2,-2" stroke-width="1" shape-rendering="auto" stroke="#bbbbbb"
                stroke-linecap="square"></path>
            </pattern>
    
            <g id="filterIcon">
                <circle cx="160" cy="140" r="440" fill="#fbf8f1"/>
                <circle cx="160" cy="140" r="380" fill="#fa6d6d"/>
                <path transform="scale(0.65)" xmlns="http://www.w3.org/2000/svg" fill="#fff" d="M487.976 0H24.028C2.71 0-8.047 25.866 7.058 40.971L192 225.941V432c0 7.831 3.821 15.17 10.237 19.662l80 55.98C298.02 518.69 320 507.493 320 487.98V225.941l184.947-184.97C520.021 25.896 509.338 0 487.976 0z"/>
            </g>
            
            <g id="icon_xtimes">
                <circle cx="0" cy="0" r="10" fill-opacity="0"></circle>
                <path class="icon" transform="scale(0.041) translate(-256,-256)" d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm0 448c-110.5 0-200-89.5-200-200S145.5 56 256 56s200 89.5 200 200-89.5 200-200 200zm101.8-262.2L295.6 256l62.2 62.2c4.7 4.7 4.7 12.3 0 17l-22.6 22.6c-4.7 4.7-12.3 4.7-17 0L256 295.6l-62.2 62.2c-4.7 4.7-12.3 4.7-17 0l-22.6-22.6c-4.7-4.7-4.7-12.3 0-17l62.2-62.2-62.2-62.2c-4.7-4.7-4.7-12.3 0-17l22.6-22.6c4.7-4.7 12.3-4.7 17 0l62.2 62.2 62.2-62.2c4.7-4.7 12.3-4.7 17 0l22.6 22.6c4.7 4.7 4.7 12.3 0 17z" id="icon_xtimes" ></path>
            </g>
            
          </defs>
        </svg>
`

const VERTEX_RADIUS = 40;
const EDGE_WIDTH = 2;

function getPointAtLengthMinusNodeRadius(pathstring, radius, lineWidth) {
    var p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    p.setAttribute('d', pathstring);
    var totLen = p.getTotalLength();

    var l = totLen > radius ? totLen - radius - lineWidth*4 - 1 : totLen
    return p.getPointAtLength(Math.abs(l));
}

function makeEdgePathString(s,t) {
    let dx = t.x - s.x;
    let dy = t.y - s.y;

    let endPoint = getPointAtLengthMinusNodeRadius(`m0 0 l${dx} ${dy}`, 50, 2)

    return `m0 0 l${endPoint.x} ${endPoint.y}`
}


//todo : graphmodel 분리
export default class MetaGraphWidget extends EventEmitter {

    constructor(domSelector) {
        super('patternChange')

        this.container = document.querySelector(domSelector);
        this.container.innerHTML = SvgOuterHtml;
        this.svg = d3.select(this.container).select('svg');
        this.nodes = [];
        this.links = [];

        this.patternBuilder = new PatternBuilder({nodes:this.nodes, links:this.links}, this.container)

        /*
         * todo : patternChange 를 참고하여 거꾸로 패턴을 입력받아서 메타그래프에 표시하는 함수 구현.
         */
        this.patternBuilder.on('patternResetted', ()=>{
            this.fire('patternChange', this.patternBuilder.getPattern())

            // this.patternBuilder 에서 페턴에 참여한 vertex 리스트를 받아서 해당 vertex를 하이라이팅 한다.
            let selectedVertices = this.patternBuilder.getInvolvedVertices()
            this.setSelectedVertices(selectedVertices);
            this.render()
        });

        this.enterVertex = this.enterVertex.bind(this);
        this.enterEdge = this.enterEdge.bind(this);
        this.updateVertex = this.updateVertex.bind(this);
        this.updateEdge = this.updateEdge.bind(this);
        this.handleNodeClick = this.handleNodeClick.bind(this);
        this.handleNodeUnselect = this.handleNodeUnselect.bind(this);

    }

    setMetaData(data) {
        this.nodes = data.nodes.map(n=>Object.assign(n,ICON_DICT[n.id]));
        this.links = data.links.map(l=>{
            l._s = this.getNodeDataById(l.source)
            l._t = this.getNodeDataById(l.target)
            return l
        });

        // this.patternBuilder = new PatternBuilder({nodes:this.nodes, links:this.links}, this.container)

        this.patternBuilder.setGraphInfo({nodes:this.nodes, links:this.links})

        // 메타 데이타가 새로 설정되면 최초한번 위치르 잡아주는 동작을 해야 한다.
        this.resize()
    }

    getNodeDataById(nId) {
        return this.nodes.find(n=>n.id==nId)
    }

    // todo : 별도 layout 모듈로 분리
    resize() {
        let width = this.container.clientWidth
        let height = this.container.clientHeight

        const labels = ['kisa_spamsniper','kisa_ddei', 'kisa_waf','indicator','intrusion_set','attack_pattern','malware','network_info', 'url', 'email', 'ioc']
        // const w = width/5.0
        // const h = height/5.0
        //
        // const xPosition = [w*4,w*4,w*2,w*4,w*3,w*2,w*4,w*3,w*3,w*3,w*2]
        // const yPosition = [h*2,h,  h  ,h*4,h*4,h*4,h*3,h  ,h*3,h*2,h*2]
        const w = width/4.0
        const h = height/5.0

        const xPosition = [w*3,w*3,w,w*3,w*2,w  ,w*3,w*2,w*2,w*2,w]
        const yPosition = [h*2,h,  h,h*4,h*4,h*4,h*3,h  ,h*3,h*2,h*2.5]

        function positionX(label) {
            let x = 0
            labels.forEach((value,index)=>{
                if(value===label) {
                    x = xPosition[index]
                }
            })
            return x
        }

        function positionY(label) {
            let y = 0
            labels.forEach((value,index)=>{
                if(value===label) {
                    y = yPosition[index]
                }
            })
            return y
        }

        this.nodes = this.nodes.map(n=>{
            n.x = positionX(n.id)
            n.y = positionY(n.id)
            return n
        })

        this.render()
    }

    render() {
        this.vertexSelection = this.svg.select('.vertexGrp')
            .selectAll('g.vertex').data(this.nodes,d=>d.id)
        this.edgeSelection = this.svg.select('.edgeGrp')
            .selectAll('g.edge').data(this.links)

        this.vertexSelection.exit().call(this.exitVertex)
        this.edgeSelection.exit().call(this.exitEdge)

        this.vertexSelection.call(this.updateVertex)
        this.edgeSelection.call(this.updateEdge)

        this.vertexSelection.enter().call(this.enterVertex)
        this.edgeSelection.enter().call(this.enterEdge)
    }

    updateVertex(sel) {
        sel.attr('transform', d=>`translate(${d.x},${d.y})`)

        sel.select('use.filter')
            .style('display',d=>d.filterFlag ? '' : 'none')

        sel.select('use.rm')
            .style('display',d=>d.selected ? '' : 'none')

        sel.classed('selected',d=>d.selected)


    }

    updateEdge(sel) {
        sel.attr('transform', d=>{
            return `translate(${d._s.x},${d._s.y})`
        });
        sel.select('path').attr('d', d=>makeEdgePathString(d._s,d._t))
    }
/*
0:
filterFlag: false
filterKeyword: undefined
id: "email_message"
ih: 512
iw: 512
path: "M464 64H48C21.49 64 0 85.49 0 112v288c0 26.51 21.49 48 48 48h416c26.51 0 48-21.49 48-48V112c0-26.51-21.49-48-48-48zm0 48v40.805c-22.422 18.259-58.168 46.651-134.587 106.49-16.841 13.247-50.201 45.072-73.413 44.701-23.208.375-56.579-31.459-73.413-44.701C106.18 199.465 70.425 171.067 48 152.805V112h416zM48 400V214.398c22.914 18.251 55.409 43.862 104.938 82.646 21.857 17.205 60.134 55.186 103.062 54.955 42.717.231 80.509-37.199 103.053-54.947 49.528-38.783 82.032-64.401 104.947-82.653V400H48z"
selected: true
x: 425
y: 397
__proto__: Object
1:
direction: "forward"
label: "sent"
__proto__: Object
2:
filterFlag: true
filterKeyword: "sss@kisa.or.kr"
id: "email_address"
ih: 512
iw: 576
path: "M528 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h480c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48zm0 400H48V80h480v352zM208 256c35.3 0 64-28.7 64-64s-28.7-64-64-64-64 28.7-64 64 28.7 64 64 64zm-89.6 128h179.2c12.4 0 22.4-8.6 22.4-19.2v-19.2c0-31.8-30.1-57.6-67.2-57.6-10.8 0-18.7 8-44.8 8-26.9 0-33.4-8-44.8-8-37.1 0-67.2 25.8-67.2 57.6v19.2c0 10.6 10 19.2 22.4 19.2zM360 320h112c4.4 0 8-3.6 8-8v-16c0-4.4-3.6-8-8-8H360c-4.4 0-8 3.6-8 8v16c0 4.4 3.6 8 8 8zm0-64h112c4.4 0 8-3.6 8-8v-16c0-4.4-3.6-8-8-8H360c-4.4 0-8 3.6-8 8v16c0 4.4 3.6 8 8 8zm0-64h112c4.4 0 8-3.6 8-8v-16c0-4.4-3.6-8-8-8H360c-4.4 0-8 3.6-8 8v16c0 4.4 3.6 8 8 8z"
selected: true
x: 425
y: 595.5
 */
    handleNodeClick(datum) {
        d3.event.stopPropagation();

        let vInfo = {}

        vInfo.gtype = 'vertex'
        vInfo.label = datum.id
        vInfo.params = []

        // console.log('datum', datum)
        if(datum.filterFlag && d3.event.target.tagName == 'use' ){
            LABEL_MAP_FN[vInfo.label].forEach(prop=>{
                vInfo.params.push({
                    name : prop,
                    value : datum.filterKeyword,
                    comp : '='
                })
            })
        }

        this.patternBuilder.append( vInfo,  (datum.selected && !d3.event.altKey))
        this.fire('patternChange', this.patternBuilder.getPattern())

        // this.patternBuilder 에서 페턴에 참여한 vertex 리스트를 받아서 해당 vertex를 하이라이팅 한다.
        let selectedVertices = this.patternBuilder.getInvolvedVertices()
        this.setSelectedVertices(selectedVertices);
        this.render()
    }

    handleNodeUnselect(datum) {
        d3.event.stopPropagation();
        // console.log('handleNodeUnselect', datum)

        this.patternBuilder.removePattern({label: datum.id, gtype: 'vertex'})
        this.fire('patternChange', this.patternBuilder.getPattern())

        let selectedVertices = this.patternBuilder.getInvolvedVertices()
        // console.log('selectedVertices', selectedVertices)
        this.setFilterVertices();
        this.setSelectedVertices(selectedVertices);
        this.render()
    }

    enterVertex(sel) {
        var t = d3.transition()
            .duration(500)
            // .ease(d3.easeCircleIn);

        let grp = sel.append('g').classed('vertex', true)
            .attr('tabindex', 0)
            .attr('transform', d=>`translate(${d.x},${d.y})`)
        grp.on('click', this.handleNodeClick)

        let circleElem =  grp.append('circle').attr('r', 0)
        circleElem.transition(t)
            .attr('r', VERTEX_RADIUS)

        circleElem.append('animateTransform')
            .attr('attributeType', 'xml')
            .attr('attributeName', 'transform')
            .attr('type', 'rotate')
            .attr('from', '0')
            .attr('to', '360')
            .attr('begin', '0')
            .attr('dur', '10s')
            .attr('repeatCount', 'indefinite')

        grp.append('text').classed('label', true).attr('y',60).text(d=>d.id)
        grp.append('path')
            .attr('d', d=>d.path)
            .attr('transform',d=>`scale(0.061, 0.061) translate(-${d.iw/2},-${d.ih/2})`)
            .style('opacity', 0)
            .transition(t)
            .delay(500)
            .style('opacity', 1)

        // grp.append('text').classed('rm', true)
        //     .attr('x', 30)
        //     .attr('y', -30)
        //     .style('display','none')
        //     .text("X")
        //     .on('click', this.handleNodeUnselect)

        grp.append('use').classed('rm', true)
            .style('color','#3d0801')
            .style('display','none')
            .attr("xlink:xlink:href", "#icon_xtimes")
            .attr('transform',d=>`translate(40,-40)`)
            .on('click', this.handleNodeUnselect)

        grp.append('use').classed('filter', true)
            .style('color','#ff8260')
            .style('display','none')
            .attr("xlink:xlink:href", "#filterIcon")
            .attr('transform',d=>`scale(0.04, 0.04) translate(-825,425)`)
    }

    enterEdge(sel) {
        var t = d3.transition()
            .duration(500)

        let grp = sel.append('g').classed('edge', true).attr('transform', d=>{
            return `translate(${d._s.x},${d._s.y})`
        });

        grp.append('path')
            .attr('d', 'm0 0')
            .transition(t)
            .delay(500)
            .attr('d', d=>makeEdgePathString(d._s,d._t))
            .attr("marker-end", "url(#arrowhead)")
    }

    exitVertex(sel) {
        sel.remove()
    }

    exitEdge(sel){
        sel.remove()
    }

    setKeywordFindLabels(fLabels, keyword) {

        this.nodes.forEach(n=>{
            n.filterFlag = n.id in fLabels
            n.filterKeyword = n.filterFlag ? keyword : undefined
        })

        this.render()
    }

    /**
     *
     * @param selectedVertices {ip: true, domain:true, location:true}
     */
    setSelectedVertices(selectedVertices) {
        this.nodes.forEach(n=>{
            n.selected = n.id in selectedVertices
        })
    }

    setFilterVertices() {
        let pattern = this.patternBuilder.getPattern()

        let labels = {}
        pattern.forEach(x => {
            if (x.params && x.params.length > 0) {
                labels[x.label] = x.params[0]['value']
            }
        })
        this.nodes.forEach(n=>{
            n.filterFlag = n.id in labels
            n.filterKeyword = n.filterFlag ? labels[n.id] : undefined
        })
    }

    /**
     *
     * @param pattern
     */
    setPattern(pattern) {
        // console.log('pattern change event ', pattern)
        this.patternBuilder.setPattern(pattern)

        let selectedVertices = this.patternBuilder.getInvolvedVertices()
        this.setSelectedVertices(selectedVertices);
        this.setFilterVertices();
        this.render()
    }
}
