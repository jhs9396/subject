import * as d3 from "d3";
import EventEmitter from "../util/EventEmitter";
import {ICON_DICT} from "./resource/icon";

require('./DetailGraph.styl');

const SvgOuterHtml = `
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" class="detailgraph" >
          <g class="main">
            <g class="edgeGrp">
            </g>
            <g class="vertexGrp">
            </g>            
          </g>
          <g class="extraInfo hidden"></g>
    
          <defs>
            <marker id="arrowhead2" refX="0" refY="2" orient="auto" markerUnits="strokeWidth" markerWidth="5"
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
    
            <g id="icon_path">
              <path id="filterIcon" xmlns="http://www.w3.org/2000/svg" fill="currentColor" d="M487.976 0H24.028C2.71 0-8.047 25.866 7.058 40.971L192 225.941V432c0 7.831 3.821 15.17 10.237 19.662l80 55.98C298.02 518.69 320 507.493 320 487.98V225.941l184.947-184.97C520.021 25.896 509.338 0 487.976 0z"/>
                
            </g>
            
          </defs>
        </svg>
`;

const VERTEX_RADIUS = 12;

let clusterColor = d3.scaleOrdinal(d3.schemeCategory10);

function getPointAtLengthMinusNodeRadius(pathstring, radius, lineWidth) {
    var p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    p.setAttribute('d', pathstring);
    var totLen = p.getTotalLength();

    var l = totLen > radius ? totLen - radius - lineWidth * 4 - 1 : totLen;
    return p.getPointAtLength(Math.abs(l));
}

function makeEdgePathString(s, t) {
    let dx = t.x - s.x;
    let dy = t.y - s.y;

    let endPoint = getPointAtLengthMinusNodeRadius(`m0 0 l${dx} ${dy}`, 10, 2);

    return `m0 0 l${endPoint.x} ${endPoint.y}`
}

const LABEL_MAP_FN = {
    kisa_spamsniper: v => v.props.filter_info,
    kisa_ddei: v => v.props.threat,
    kisa_waf: v => v.props.rule,
    url: v => v.props.value,
    file: v => v.props.value,
    network_info: v => v.props.source_ip,
    attack_pattern: v => v.props.name,
    intrusion_set: v => v.props.id,
    indicator: v => v.props.name,
    malware: v => v.props.filename,
    sender: v => v.props.source_email_address,
    receiver: v => v.props.target_email_address
};

function deepCopy(arr) {
    return arr.map(v => new Object(v))
}

export default class DetailGraphWidget extends EventEmitter {

    constructor({domSelector}) {
        super('nodeSelect', 'expand', 'vertexDragStart', 'hoverNode', 'hoverOut','unSelect');

        this.container = typeof domSelector == "string" ? document.querySelector(domSelector) : domSelector;

        this.container.innerHTML = SvgOuterHtml;
        this.svg = d3.select(this.container).select('svg');
        this.svgElem = this.svg.node();
        this.nodes = [];
        this.links = [];

        this.lastHoverNode;
        this.isHoverNode = false;
        
        // this.graphData = graphData
        // this.graphData.on('changed', (changes)=>{
        //     // console.log('changes', changes )
        //
        //     changes.forEach(console.log)
        //
        // })

        this.isExpandUIDisplayed = false;

        this.initIcon();


        this.enterVertex = this.enterVertex.bind(this);
        this.enterEdge = this.enterEdge.bind(this);
        this.updateVertex = this.updateVertex.bind(this);
        this.updateEdge = this.updateEdge.bind(this);
        this.handleNodeClick = this.handleNodeClick.bind(this);
        this.handleExpand = this.handleExpand.bind(this);
        this.handleMouseOver = this.handleMouseOver.bind(this);
        this.handleMouseOut = this.handleMouseOut.bind(this);
        this.handleTick = this.handleTick.bind(this);
        this.drag_drag = this.drag_drag.bind(this);
        this.handleHighlightNode = this.handleHighlightNode.bind(this);
        this.handleUnHighlightNode = this.handleUnHighlightNode.bind(this);

        // this.handleNodeUnselect = this.handleNodeUnselect.bind(this);

        this.linkForce = d3.forceLink()
            .id(function (d) {
                return d.id;
            })
            .strength(0.1)
            .distance(40);

        let width = this.container.clientWidth;
        let height = this.container.clientHeight;

        this.lastExpansionPoint = {x: width / 2, y: height / 2};

        // this.simulation = d3.forceSimulation()
        //     .force("link", this.linkForce)
        //     .force("collide", d3.forceCollide(20))
        //     .force("charge", d3.forceManyBody().strength(-30))
        //     .force("x", d3.forceX(width/2).strength(0.001))
        //     .force("y", d3.forceY(height/2).strength(0.001))
        //
        //
        // this.simulation.on('tick', this.handleTick)
        // this.simulation.stop()


        this.drag_start = this.drag_start.bind(this);
        this.drag_end = this.drag_end.bind(this);

        this.drag_handler = d3.drag()
            .on("start", this.drag_start)
            .on("drag", this.drag_drag)
            .on("end", this.drag_end);

        this.zoom_actions = this.zoom_actions.bind(this);

        this.zoom_handler = d3.zoom()
            .scaleExtent([0.5, 2])
            .on("zoom", this.zoom_actions);

        this.svg.call(this.zoom_handler);

        this.svg.on("dblclick.zoom", null);
        this.svg.on("click", () => {
                d3.event.stopPropagation();
                this.svg.selectAll('g.vertex').select('circle').style('stroke', '').style('stroke-width', '')
                this.svg.selectAll('g.vertex').select('text').style('fill', '').style('font-weight', '')
                this.svg.selectAll('g.edge').select('path').style('stroke', '')
            }
        )

        this.svgElem.addEventListener('mousedown', evt => {
            this.latestEventTarget = evt.target
        });

        this.svgElem.addEventListener('click', evt => {
            let datum = evt.target;
            this.fire('unSelect', evt)
        })


    }


    //
    lookAt(type, id, dp={x:0, y:0, s: 1}) {
        let width = this.container.clientWidth
        let height = this.container.clientHeight

        // this.resetLookAt()
        if(type == 'node') {
            let aNode = this.findNodeById(id)
            var transform = d3.zoomTransform(this.svg.node());

            if(dp.s) {
                transform.k = dp.s
            }

            let invCenterPoint = transform.invert([width/2 + dp.x, height/2 + dp.y  ])
            let newT = transform.translate(invCenterPoint[0]-aNode.x,  invCenterPoint[1]-aNode.y)

            let tr = this.svg.select('g.main').transition().duration(750)
            tr.call(this.zoom_handler.transform, newT);
            tr.end().then(()=>{
                this.svg.node().__zoom = newT
            })
        }
    }


    initIcon() {
        this.svg.select('#icon_path').selectAll('path.icon')
            .data(Object.keys(ICON_DICT))
            .enter().append('path').classed('icon', true)
            .attr('d', d => ICON_DICT[d].path)
            .attr('id', d => 'icon_' + d)
            .attr('transform', d => `scale(0.03, 0.03) translate(-${ICON_DICT[d].iw / 2},-${ICON_DICT[d].ih / 2})`)
    }

    drag_start(d) {
        this.fire('vertexDragStart');
        // if (!d3.event.active) this.simulation.alphaTarget(0.1).restart();
        d.fx = d.x;
        d.fy = d.y;
        this.render()
    }

    drag_drag(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    }

    drag_end(d) {
        // if (!d3.event.active) this.simulation.alphaTarget(0);
        // d.fx = null;
        // d.fy = null;
    }

    zoom_actions() {
        this.svg.select('g.main').attr("transform", d3.event.transform)
    }

    handleTick() {
        this.render()
    }

    // addNode(n) {
    //     // 이미 있는건 안 잡어 넣는다
    //     if(this.findNodeById(n.id)) return;
    //
    //     n.x = n.x || this.lastExpansionPoint.x + (Math.random()*100-50)
    //     n.y = n.y || this.lastExpansionPoint.y + (Math.random()*100-50)
    //
    //     // let items = Object.assign(n,ICON_DICT[n.label]);
    //
    //     this.nodes.push( n )
    //     // if(!this.bulkUpdate) this.simulation.nodes(this.nodes)
    // }

    findNodeById(nId) {
        return this.nodes.find(d=>d.id == nId)
    }

    // addLink(aLink) {
    //     this.links.push(aLink);
    //     // if(!this.bulkUpdate) this.linkForce.links(this.links.slice(0));
    // }

    clear() {
        this.nodes = [];
        this.links = [];
        this.render()

        // 화면 zoom 초기화
        this.svg.transition()
            .duration(750)
            .call( this.zoom_handler.transform, d3.zoomIdentity ); // updated for d3 v4
    }


    // getNodeDataById(nId) {
    //     return this.nodes.find(n=>n.id==nId)
    // }
    //
    // getLinkDataById(nId) {
    //     return this.links.find(n=>n.id==nId)
    // }

    // todo : 별도 layout 모듈로 분리
    resize() {
        let width = this.container.clientWidth;
        let height = this.container.clientHeight;

        this.render()
    }

    render() {
        if (this.bulkUpdate) return;

        this.svg.on('mousemove', () => {
            if ( !this.isHoverNode ) {
                this.fire('hoverOut', this.lastHoverNode);
            }
        });

        this.vertexSelection = this.svg.select('.vertexGrp')
            .selectAll('g.vertex').data(this.nodes, d => d.id);
        this.edgeSelection = this.svg.select('.edgeGrp')
            .selectAll('g.edge').data(this.links, d => d.linkId);

        this.vertexSelection.exit().call(this.exitVertex);
        this.edgeSelection.exit().call(this.exitEdge);

        this.vertexSelection.call(this.updateVertex);
        this.edgeSelection.call(this.updateEdge);

        this.vertexSelection.enter().call(this.enterVertex);
        this.edgeSelection.enter().call(this.enterEdge)
    }

    updateVertex(sel) {
        sel.attr('transform', d => `translate(${d.x},${d.y})`);

        sel.select('.rm')
            .style('display', d => d.selected ? '' : 'none');

        sel.classed('selected', d => d.selected);

        sel.select('circle')
            .style('fill', d => {
                let clstId = null
                if (d.cluster_id instanceof Array) {
                    if(d.cluster_id.length == 0) {
                        clstId = undefined
                    }else if(d.cluster_id.length == 1){
                        clstId = d.cluster_id[0]
                    }else {
                        clstId = d.cluster_id
                    }
                }else {
                    clstId = d.cluster_id
                }


                if (clstId instanceof Array) {
                    return 'red'
                }else  if (clstId) {
                    return d3.color(clusterColor(d.cluster_id)).brighter(2)
                } else {
                    return undefined
                }
            })
    }

    updateEdge(sel) {
        sel.attr('transform', d => {
            return `translate(${d.source.x},${d.source.y})`
        });
        sel.select('path').attr('d', d => makeEdgePathString(d.source, d.target))
    }

    handleNodeClick(datum) {
        this.fire('nodeSelect', datum)
    }

    handleMouseOver(d, i) {
        this.lastHoverNode = d;
        this.isHoverNode = true;
        this.fire('hoverNode', d)
    }

    handleMouseOut(d, i) {
        this.isHoverNode = false;
        this.fire('hoverOut', d)
    }

    /**
     *
     * @param evt  d3 event or hammerjs event
     */
    handleExpand(datum) {
        this.isExpandUIDisplayed = true;
        this.lastExpansionPoint = {x: datum.x, y: datum.y};

        this.fire('expand', datum)
    }

    makeVertexLabel(v) {
        let fn = LABEL_MAP_FN[v.label] || (v => v.props.value || v.label);
        return fn(v)
    }

    enterVertex(sel) {
        var t = d3.transition()
            .duration(500);
        // .ease(d3.easeCircleIn);

        let grp = sel.append('g').classed('vertex', true)
            .attr('tabindex', 0)
            .attr('transform', d => `translate(${d.x},${d.y})`);
        // grp.on('click', this.handleNodeClick)
        grp.on('dblclick',this.handleExpand);
        grp.on('mouseenter', (d) => {
            this.handleMouseOver(d);
            //console.log(grp.select('use').filter(v => v.id === d.id))
            let filtered = circleElem.filter((v) => v.id === d.id)
            filtered.attr("r", 3 * VERTEX_RADIUS)
            grp.select('use')
                .filter((v) => v.id === d.id)
                .attr('transform', d => `scale(2.5,2.5)`)
            grp.select('text')
                .filter((v) => v.id === d.id)
                .attr('transform', d => `scale(2.5,2.5)`)

            grp.select('#arcText')
                .filter((v) => v.id === d.id)
                .attr('transform', d => `scale(2.5,2.5)`)
                .style('fill', 'black')
                .style('opacity', 1)
                .style('font-size', '8px')
            // .transition().duration(500)
            // .attr('d',`M -${VERTEX_RADIUS*3+4},0 A ${VERTEX_RADIUS*3+4},${VERTEX_RADIUS*3+4} 0 0,1 ${VERTEX_RADIUS*3-1},-${VERTEX_RADIUS*3-1}`)
        });
        grp.on('mouseleave', (d) => {
            this.handleMouseOut(d)

            circleElem.attr("r", VERTEX_RADIUS)
            grp.select('use').attr('transform', d => `scale(1,1)`)
            grp.select('text').attr('transform', d => `scale(1,1)`)
            grp.select('#arcText')
                .filter(v=>v.id==d.id)
                .attr('transform', d => `scale(1,1)`).style('font-size', '')
                .style('fill', 'black')
                .style('opacity', 0.2)
        });
        grp.on('click', (datum) => {
            d3.event.stopPropagation();
            this.highlightPath(datum)
            this.handleNodeClick(datum)
        });

        this.drag_handler(grp);

        let circleElem = grp.append('circle').attr('r', 0)

        circleElem.transition(t)
            .attr('r', VERTEX_RADIUS);

        grp.append('text').classed('label', true)
            .attr('x', 15)
            .attr('y', 5)
            .text(d => this.makeVertexLabel(d));

        grp.append('use')
            .attr("xlink:xlink:href", d => '#icon_' + d.label)
            .style('opacity', 0)
            .transition(t)
            .delay(500)
            .style('opacity', 1);

        grp.append('text').classed('rm', true)
            .attr('x', 30)
            .attr('y', -30)
            .style('display', 'none')
            .text("X")
            .on('click', this.handleNodeUnselect)

        grp.append('path')
            .attr('id', 'wavy')
            .attr('d', `M -${VERTEX_RADIUS + 4},0 A ${VERTEX_RADIUS + 4},${VERTEX_RADIUS + 4} 0 0,1 ${VERTEX_RADIUS - 1},-${VERTEX_RADIUS - 1}`)
            .style('fill', 'none')
        //.style('stroke','#AAAAAA')

        grp.append('text')
            .attr('id', 'arcText')
            .append('textPath')
            .attr('xlink:href', '#wavy')
            .style('text-anchor', 'middle')
            .style('textLength', '1em')
            .attr('startOffset', '50%')
            .text(d => d.label)

        /*grp.on('mouseenter',(d)=>{
            console.log(grp.select('use').filter(v => v.id === d.id))
            let filtered = circleElem.filter((v) => v.id === d.id)
            filtered.attr("r",3*VERTEX_RADIUS)
            grp.select('use')
                .filter((v) => v.id === d.id)
                .attr('transform',d=>`scale(2.5,2.5)`)
        })*/

        /*grp.on('mouseleave',(d) => {
            circleElem.attr("r",VERTEX_RADIUS)
            grp.select('use').attr('transform',d=>`scale(1,1)`)
        })*/
    }

    highlightPath(datum) {
        this.svg.selectAll('g.vertex').select('circle').style('stroke', '').style('stroke-width', '')
        this.svg.selectAll('g.vertex').select('text')
            .filter(v=>v.id===datum.id)
            .style('fill', 'black')
            .style('font-weight', '')
        this.svg.selectAll('g.vertex').select('#arcText')
            .filter(v=>v.id===datum.id)
            .style('opacity', 1)
        this.svg.selectAll('g.edge').select('path').style('stroke', '')
        this.svg.selectAll('g.vertex').select('circle').filter((v) => v.id === datum.id).style("stroke", "blue").style("stroke-width", 4)
        this.svg.selectAll('g.vertex').select('text').filter((v) => v.id === datum.id).style('fill', 'blue').style('font-weight', 'bold')
        datum.edgeList.forEach((e) => {
            if (e.fromId !== datum.id) {
                this.svg.selectAll('g.vertex').select('circle').filter((a) => a.id === e.fromId).style("stroke", "blue").style("stroke-width", 4)
                this.svg.selectAll('g.vertex').select('text').filter((a) => a.id === e.fromId).style('fill', 'blue').style('font-weight', 'bold')
            } else if (e.toId !== datum.id) {
                this.svg.selectAll('g.vertex').select('circle').filter((a) => a.id === e.toId).style("stroke", "blue").style("stroke-width", 4)
                this.svg.selectAll('g.vertex').select('text').filter((a) => a.id === e.toId).style('fill', 'blue').style('font-weight', 'bold')
            }
            this.svg.selectAll('g.edge').select('path').filter(d => {
                return d.linkId === e.linkId
            }).style('stroke', 'blue')
        })
    }

    enterEdge(sel) {
        var t = d3.transition()
            .duration(500);

        let grp = sel.append('g').classed('edge', true).attr('transform', d => {
            return `translate(${d.source.x},${d.source.y})`
        });

        grp.append('path')
            .attr('d', 'm0 0')
            .attr('stroke', d => d.label === 'similar_to'?'#f3684a':'#807c80')
            .attr('stroke-dasharray',d =>d.label === 'similar_to' ? '1 1':'')
            .attr('d', d => makeEdgePathString(d.source, d.target))
            .attr("marker-end", "url(#arrowhead2)")

    }

    exitVertex(sel) {
        sel.remove()
    }

    exitEdge(sel) {
        sel.remove()
    }

    removeNode(id) {
        this.nodes = this.nodes.filter(n => {
            return n.id != id
        })
    }

    removeLink(id) {
        this.links = this.links.filter(l => l.linkId != id)
    }

    setLayoutHint(param) {
        // console.log(param)
        //
        // let width = this.container.clientWidth
        // let height = this.container.clientHeight
        //
        // this.simulation.force('x', null);
        //
        // this.simulation.force("charge", null);
        //
        // this.linkForce.strength(0.001).distance(200)
        //
        //
        //
        // let xs = d3.scaleOrdinal( d3.range(0,100000,300))
        // param.cypher.filter((d,idx)=> idx%2 == 0).forEach(v=>xs(v.id)) // pattern 에 나온 라벨을 먼저 호출해서 화면 왼쪽부터 배치 되도록
        //
        // this.simulation.force("x", d3.forceX(d=>{
        //         return xs(d.label)
        //     }).strength(0.201))
        //     .force("y", d3.forceY(height/2).strength(0.01))
        //

    }


    /**
     * 다음 형제 노드의 정보를 리턴
     * 만약 다음 sibling이 없는경우 다시 처음 노드의 정보를 리턴한다.
     * @param parentNodeId
     * @param currNodeId
     * @returns {undefined}
     */
    getNextSibling(parentNodeId, currNodeId) {
        return undefined
    }

    getPrevSibling(parentNodeId, currNodeId) {
        return undefined
    }


    hideBubbleDialog() {
        this.svg.select('.extraInfo').selectAll('path').remove();
        this.isExpandUIDisplayed = false
    }

    showBubbleDialog(point, direction = 'left') {
        let p = d3.path();
        let x0 = point.x;
        let y0 = point.y;
        let x1 = point.x;
        let y1 = point.y - 75;
        let y2 = point.y + 155;

        if (direction == 'left') {
            x0 = x0 - 12;

            p.moveTo(x0, y0);
            p.bezierCurveTo((x0 + x1) / 2 + 3, y0, (x0 + x1) / 2 + 3, y1, x1, y1);
            p.lineTo(x1, y2);
            p.bezierCurveTo((x0 + x1) / 2 + 3, y2, (x0 + x1) / 2 + 3, y0, x0, y0)

        } else {
            x0 = x0 + 12;

            p.moveTo(x0, y0);
            p.bezierCurveTo((x0 + x1) / 2 - 3, y0, (x0 + x1) / 2 - 3, y1, x1, y1);
            p.lineTo(x1, y2);
            p.bezierCurveTo((x0 + x1) / 2 - 3, y2, (x0 + x1) / 2 - 3, y0, x0, y0)
        }

        let extInfoG = this.svg.select('.extraInfo');
        extInfoG.attr('transform', `translate( ${window.innerWidth / 2}, ${window.innerHeight / 2} )`);
        extInfoG.append('path')
            .attr('d', p.toString())
            .attr('fill', '#b8c2cc')
    }

    setGraphData(nodes, links) {
        this.nodes = nodes;
        this.links = links;

        this.render()
    }

    // addGraphData(result) {
    //     this.bulkUpdate = true
    //
    //     result.vertices.forEach(v=>{
    //         this.addNode(v);
    //     })
    //     result.edges.forEach(e=>{
    //         this.addLink(e);
    //     })
    //
    //     this.bulkUpdate = false
    //
    //     // this.simulation.nodes(this.nodes)
    //     // this.linkForce.links(deepCopy(this.links));
    //     // this.simulation.alphaTarget(0.3).restart()
    // }

    /**
     * Graph node hightlighting
     * @param targetNode node information
     * @param color default color is anything
     */
    handleHighlightNode(targetNode,color="#7179CC") {
        let vertices = this.svg.selectAll('g.vertex')
        if ( !targetNode ) {
            alert('No results')
            return;
        }
        vertices.select('use')
            .filter(v=> v.id === targetNode.id)
            .attr('transform', d=>'scale(2.5,2.5)')

        vertices.select('circle')
            .filter(v =>v.id &&  v.id === targetNode.id)
            .attr("r", 3 * VERTEX_RADIUS)

        vertices.select('circle')
            .filter(v =>v.id &&  v.id === targetNode.id)
            .style("fill", color)
            .style("stroke", color)
            .style("stroke-width", 4)

        vertices.select('text')
            .filter(v => v.id && v.id === targetNode.id)
            .style('fill', color)
            .style('font-weight', 'bold')
            .attr("transform", d=>'scale(2.5,2.5)')

        vertices.select('#arcText')
            .filter(v =>v.id && v.id === targetNode.id)
            .attr('transform', d => `scale(2.5,2.5)`)
            .style('font-size', '8px')
            .style('font-weight', 'bold')
            .style('fill', color)
    }

    handleUnHighlightNode() {
        let vertices = this.svg.selectAll('g.vertex')

        vertices.select('circle')
            .attr("r", VERTEX_RADIUS)
        vertices.select('use').attr('transform', d => `scale(1,1)`)
        vertices.select('text').attr('transform', d => `scale(1,1)`)
        vertices.select('#arcText')
            .attr('transform', d => `scale(1,1)`)
            .style('font-size', '')
            .style('fill', 'black')
            .style('opacity', 0.2)
            .style('font-weight', 'normal')
    }
}
