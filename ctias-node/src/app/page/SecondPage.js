import DetailGraphWidget from "../component/DetailGraphWidget";
import PatternSearchWidget from "../component/PatternSearchWidget";
import KeywordSearchWidget from "../component/KeywordSearchWidget2";
import PropPopupWidget from "../component/PropPopupWidget";
import ContextMenu from "../component/ContextMenu";
// import NodeMenuWidget from "../component/NodeMenuWidget";
import EventEmitter from "../util/EventEmitter";
// import GraphTable from "../component/GraphTable.js";
import PocApiClient from '../util/PocApiClient'
import {convertGraphPath} from '../util/Common'

const {path2GraphElemArray,vertex2GraphElemArray} = require("../util/Common")
import {Graph} from "../util/graph/index.ts"
import * as d3 from "d3";

const _html = `
    <div class="flex flex-col flex-1 h-full relative overflow-y-hidden" style="background: #fbf8f1; ">             
       
        <div class="flex flex-row" style="min-height: 45px">
            <div class="flex select-none">
                <a class="p-3 text-xs flex items-center hover:bg-blue-light gohome" style="background: #625955"> <img style="width: 16px;" src="/icon/arrow-left.svg" alt="pathplayicon"></a>
            </div>
            <div id="keyword" class="flex flex-1">
            </div>
        </div>           

        <div class="flex flex-col flex-1 h-full relative">
            <div id="graphWidget" class="h-full"></div>        
            <div class="absolute propview flex flex-col" style="width:385px;top:24px;left:79px;bottom:24px;"></div>
        </div>
        
    </div>    

    <div class="w-full bg-black absolute hidden" data-name="x" style="width:calc(100% - 50px);height:1px;bottom:24px;left:0;right:0;margin:auto">
    </div>

    <div class="h-full bg-black absolute hidden" data-name="y" style="height:calc(100% - 124px);width:1px;top:100px;bottom:24px;left:24px;">
    </div>   

    <div class="absolute menuview" style="top: 88px; left: 399px; display: none">
    </div>
    
    <div class="absolute tabview w-full h-full hidden" style="top: 0; left: 0; z-index:1000">
    </div> 

    <div class="absolute tableview" style="left: 24px; right: 24px; bottom: 0;">
    </div>

    <div class="absolute nodeview" style="top: 400px; left: 300px; display: none">
    </div> 
`

/**
 * todo : 확장 가능한 노드 정보와 건수 표시
 - 1 depth  또는 label별 보여줘야할 내용 분류 필요
 - 노드 확장하기 전 정보 제공 기능
 - (추가이벤트) 회색 노드들을 누르면 확장 10건이 되면서
 나머지 확장 가능한 리스트들은 왼쪽 expand list에 표시
 시나리오 :  1) 노드 마우스 hover 시 -- 완료
            2) label종류와 count 조회 필요(있으면 그 내용 가져다 쓰기)
            3) 조회된 label을 노드에, count 내용을 edge에
            4) 노드 그려지면 회색으로 변경
            5) 다른거 hover 하면 기존  hover 데이터 없애기
 */

export default class SecondPage extends EventEmitter {
    constructor(domSelector) {
        super('goHome');
        this.pocApi = new PocApiClient('/')
        this.domContainer = document.querySelector(domSelector);

        this.domContainer.innerHTML = _html

        this.domContainer.querySelector('.gohome').addEventListener('click', (evt) => {
            if ( confirm("Do you want to go to the initial screen?") ) {
                evt.stopPropagation()
                this.propview.hide()
                this.fire('goHome')
                this.graphWidget.clear();
                this.g.clear()
            }
        })

        this.domContainer.addEventListener('click', (evt) => {
            this.unselectNode()
        })

        // this.patternSearch = new PatternSearchWidget(this.domContainer.querySelector('.pattern'))
        this.keywordSearch = new KeywordSearchWidget('#keyword')
        this.propview = new PropPopupWidget(this.domContainer.querySelector('.propview'))
        // this.menuview = new ContextMenu(this.domContainer.querySelector('.menuview'))
        // this.nodeview = new NodeMenuWidget(this.domContainer.querySelector('.nodeview'))
        // this.tableview = new GraphTable(this.domContainer.querySelector('.tableview'))
        // this.tabview = new SettingPage(this.domContainer.querySelector('.nodeview'))

        this.g = new Graph({
            aggregators: {
                vertex: {
                    groups: {
                        dtime: {
                            min: {
                                aggrFunc: (aggVal, item) => {
                                    let t = new Date(item.data.props.dtime).getTime();
                                    return aggVal <= t ? aggVal : t
                                }, initVal: new Date('2019-01-01').getTime()
                            },
                            max: {
                                aggrFunc: (aggVal, item) => {
                                    let t = new Date(item.data.props.dtime).getTime();
                                    return aggVal >= t ? aggVal : t
                                }, initVal: new Date('2010-01-01').getTime()
                            },
                            count: {aggrFunc: (aggrVal, item) => aggrVal + 1, initVal: 0}
                        }
                    },


                    // domain: {
                    //     value: {
                    //         min:{aggrFunc:(aggVal, item)=>{; return aggVal <= t ? aggVal : t}},
                    //         max:{}
                    //     }
                    // }
                }

            }
        })

        this.g.on('changed', () => {
            this.handleSetScale()
        })

        // this.g.setScale('y', 'groups', (statistic, prevScale)=>{
        //     if(prevScale) {
        //         prevScale.domain([statistic.groups.dtime.min, statistic.groups.dtime.max])
        //         prevScale.range([2000,-1000])
        //         return prevScale
        //     }else {
        //         let ys = d3.scaleTime([2000,-1000])
        //         ys.domain([statistic.groups.dtime.min, statistic.groups.dtime.max])
        //         return ys;
        //     }
        // })
        this.g.force('y', (xscalePerLabel, yscalePerLabel) => {
            return d3.forceY(d => {
                let scale = yscalePerLabel(d.data.label)
                if (!scale) {
                    return 200
                } else if (d.data.label == 'ip') {
                    //return scale(d.data.props.class)
                    return scale(d.data.id)
                } else if (d.data.label == 'groups') {
                    return scale(new Date(d.data.props.dtime).getTime())
                }  else if (d.data.label == 'kisa_waf') {
                    return scale(d.data.id)
                } else if (d.data.label == 'kisa_ddei') {
                    return scale(new Date(d.data.props.dtime).getTime())
                } else if (d.data.label == 'kisa_spamsniper') {
                    return scale(new Date(d.data.props.dtime).getTime())
                } else if (d.data.label == 'email') {
                    return scale(d.data.id)
                } else if (d.data.label == 'domain') {
                    return scale(d.data.id)
                } else if (d.data.label == 'md5_hash') {
                    return scale(d.data.id)
                }
            }).strength(1)

            // return d => {
            //     let scale = yscalePerLabel(d.label)
            //     if(!scale) {
            //         return 1000 / 2
            //     }else {
            //         return scale(new Date(d.data.props.dtime).getTime())
            //     }
            // }
        });

        this.graphWidget = new DetailGraphWidget({
            domSelector: document.querySelector('#graphWidget')
        })

        this.handlePathSelect = this.handlePathSelect.bind(this);
        // this.handleElemSelect = this.handleElemSelect.bind(this);
        this.handleNextSibling = this.handleNextSibling.bind(this)
        this.handlePrevSibling = this.handlePrevSibling.bind(this)
        this.handleNodeExpand = this.handleNodeExpand.bind(this)
        this.handleNodeSelect = this.handleNodeSelect.bind(this)
        this.handleExpand = this.handleExpand.bind(this)
        this.handleExpand2 = this.handleExpand2.bind(this);
        this.handleExpand3 = this.handleExpand3.bind(this);
        this.handleClusterMembers = this.handleClusterMembers.bind(this);
        this.handleVertexDragStart = this.handleVertexDragStart.bind(this);
        this.handleHoverNode = this.handleHoverNode.bind(this)
        this.handleHoverOut = this.handleHoverOut.bind(this)
        this.handleSetScale = this.handleSetScale.bind(this)
        this.handleEmailSeparate = this.handleEmailSeparate.bind(this)
        this.handleSearchRankValue = this.handleSearchRankValue.bind(this);
        this.handleKeywordSearch = this.handleKeywordSearch.bind(this);
        this.unselectNode = this.unselectNode.bind(this);

        // this.tableview.on('rowSelected', this.handlePathSelect)
        // this.tableview.on('pathElemSelected', this.handleElemSelect)

        // this.nodeview.on('next', this.handleNextSibling)
        // this.nodeview.on('prev', this.handlePrevSibling)
        // this.nodeview.on('expand', this.handleNodeExpand)

        this.graphWidget.on('nodeSelect', this.handleNodeSelect);
        this.graphWidget.on('expand', this.handleExpand);
        this.graphWidget.on('vertexDragStart', this.handleVertexDragStart);
        this.graphWidget.on('hoverNode', this.handleHoverNode)
        this.graphWidget.on('hoverOut',this.handleHoverOut)
        this.graphWidget.on('unSelect', this.unselectNode)

        this.propview.on('expandSelectedPath', this.handleExpand2)
        this.propview.on('detectedAttack', this.handleExpand3)
        this.propview.on('similar', this.handleExpand3)
        this.propview.on('cluster_members', this.handleClusterMembers)
        this.propview.on('rank', this.handleSearchRankValue)
        this.propview.on('showProgress', this.handleShowProgess)
        this.propview.on('hideProgress', this.handleHideProgess)

        this.keywordSearch.on('search', this.handleKeywordSearch)

        this.g.on('tick', (args) => {
            if (args) {
                let {nodes, edges} = args
                this.graphWidget.setGraphData(nodes, edges)
            } else {
                this.graphWidget.render()
            }
        })

        // cluster layout variable object
        this.vertexListByLabel = {}
        this.cluster_in_view = []
    }

    handleShowProgess() {
        document.querySelector('.loader-box').style.display = 'flex';
    }

    handleHideProgess() {
        document.querySelector('.loader-box').style.display = 'none';
    }

    async handleExpand(evtParam) {
        //console.log('nodeSelect', evtParam)
        this.removeHoverNodes()

        // this.nodeview.setNodeInfo(evtParam)

        let left = -((window.innerWidth / 2) - 450)
        let top = -125

        // this.graphWidget.lookAt('node', evtParam.id, {x:left, y:top, s:1})
        // this.graphWidget.showBubbleDialog( {x:left-50, y:top},'right' )

        // let expData = await this.pocApi.expandAll(evtParam.id, evtParam.label)
        this.expandData.forEach(p=>{
            this.handleIocSepearate(p.p)
        })
        this.g.addPaths(this.expandData.slice(0, 9))
        if (this.expandData.length > 10) {
            this.handleNodeSelect(evtParam)
        }
    }

    async handleExpand2(expData) {
        this.g.addPaths(expData)
    }

    handleExpand3(pathArr) {
        this.g.addPaths(pathArr)
    }

    handleVertexDragStart() {
        this.g.forceRestart()
    }

    handleClusterMembers(gidArr) {
        //console.log('handleClusterMembers hello',gidArr)
        // Vertex cluster_id setting in array
        if(this.cluster_in_view.indexOf(gidArr[0].cluster_id) == -1){
            this.cluster_in_view.push(gidArr[0].cluster_id)
        }

        gidArr[0].nodes.forEach(n => {
            // node list get
            let node = this.g.getNode(n)
            if (node) {
                node.cluster_id = gidArr[0].cluster_id
                // fixed x,y initialize
                node.fx = undefined
                node.fy = undefined

                let id = node.data.id
                this.vertexListByLabel[node.data.label] = this.vertexListByLabel[node.data.label] || {}
                this.vertexListByLabel[node.data.label][id] = node
                Object.keys(this.vertexListByLabel).forEach(k=>{
                    this.vertexListByLabel[k] = Object.values(this.vertexListByLabel[k])
                })

                if(node.data.label == 'email') {
                    node.edgeList.filter(e=>{
                        return e.label === 'send' || e.label === 'receive'
                    }).forEach(link=>{
                        let vtx = null
                        if(link.label == 'send') {
                            vtx = this.g.getNode(link.fromId )
                        }else {
                            vtx = this.g.getNode(link.toId )
                        }

                        if(vtx.cluster_id instanceof Array && vtx.cluster_id.findIndex(d=> d==gidArr[0].cluster_id) < 0) {
                            vtx.cluster_id.push(gidArr[0].cluster_id)
                        }
                    })
                }
            }
        })

        Object.keys(this.vertexListByLabel).forEach(label=>{
            this.vertexListByLabel[label].map((v,i)=>{
                let clusterIdx = 0
                if(v.cluster_id) {
                    clusterIdx = this.cluster_in_view.findIndex(d => v.cluster_id == d)
                }
                v.y = i * 12 + clusterIdx * 100
            })
        })
        // todo: cluster 별로 모아서 보여줘야 할듯
        // this.g.force('y', () => {
        //     return d3.forceY(d=>{
        //         return d.y
        //     })
        // })

        // Cluster id color
        this.graphWidget.render()
    }

    async handleNodeSelect(evtParam) {
        // let left = -((window.innerWidth / 2) - 450)
        // let top = -125
        // this.graphWidget.lookAt('node',evtParam.id,{x:left,y:top})
        // console.log('evtParam',evtParam)
        this.propview.setTargetObj(evtParam)
        this.propview.setTargetExpandData([])

        // if(evtParam.data.label == 'sender' || evtParam.data.label == 'receiver' || evtParam.data.fake) return
        if(evtParam.data.fake) return

        let extraInfo = await this.pocApi.getGraphElemExtraInfo(evtParam.data.id, 'sglee')

        this.propview.setToolbarInfo(extraInfo)
        let selectedVtx = this.g.getNode(evtParam.data.id)

        let expandData = await this.pocApi.expandAll(evtParam.data.id, 'ioc', convertGraphPath)
        // if(evtParam.data.ioc_flag===true) expandData = await this.pocApi.expandAll(evtParam.data.id, 'ioc', convertGraphPath)
        // else expandData = await this.pocApi.expandAll(evtParam.data.id, evtParam.data.label, convertGraphPath)
        expandData.forEach(p => {
            this.handleIocSepearate(p.p)
        })
        selectedVtx.neighbors = expandData

        // let vtxArr = expandData.filter(p => {
        //     let vtx = p.p.vertices[1]
        //     return !this.g.getNode(vtx.id)
        // }).reduce((memo, p)=>{
        //     for(let idx = 1; idx < p.p.vertices.length ; idx++) {
        //         memo.push(p.p.vertices[idx])
        //     }
        //     return memo;
        // },[])
        //
        // console.log('vtxArr', vtxArr)

        this.propview.setTargetExpandData(expandData.filter(p => {
            //console.log('propview_p',p)
            let vtx = p.p.vertices[1]
            // let id = `${vtx.id.oid}.${vtx.id.id}`;
            return !this.g.getNode(vtx.id)
        }))

        this.propview.canceledContextMenu();
    }

    /**
     *
     * @param evtObj
     */
    handleNextSibling(evtObj) {
        if (!evtObj.currNodeId) {
            throw new Error("currNodeId can not be null!")
        }

        if (evtObj.parentNodeId) {
            let nextSibling = this.graphWidget.getNextSibling(evtObj.parentNodeId, evtObj.currNodeId)

            // this.nodeview.setNodeInfo(nextSibling)

        } else {
            // parent 가 없는거는 sibling 이 없는거임 고로 아무일도 안한다
        }

    }

    handlePrevSibling(evtObj) {
        if (!evtObj.currNodeId) {
            throw new Error("currNodeId can not be null!")
        }

        if (evtObj.parentNodeId) {
            let nextSibling = this.graphWidget.getPrevSibling(evtObj.parentNodeId, evtObj.currNodeId)

            // this.nodeview.setNodeInfo(nextSibling)

        } else {
            // parent 가 없는거는 sibling 이 없는거임 고로 아무일도 안한다
        }
    }

    handleNodeExpand(evtObj) {
        if (!evtObj.currNodeId) {
            throw new Error("currNodeId can not be null!")
        }
    }


    handleSetScale() {
        this.g.setScale('y', 'groups', (statistic, prevScale) => {
            if (prevScale) {
                prevScale.domain([statistic.groups.dtime.min, statistic.groups.dtime.max])
                if (statistic.groups.dtime.count < 200) {
                    prevScale.range([1000, 0])
                } else {
                    prevScale.range([2000, -1000])
                }

                return prevScale
            } else {
                let ys = d3.scaleTime()
                ys.domain([statistic.groups.dtime.min, statistic.groups.dtime.max])
                if (statistic.groups.dtime.count < 200) {
                    ys.range([1000, 0])
                } else {
                    ys.range([2000, -1000])
                }
                return ys;
            }
        })


        // this.g.setScale('y', 'ip', (statistic, prevScale) => {
        //
        //     if (prevScale) {
        //         return prevScale
        //     } else {
        //         let ys = d3.scaleOrdinal()
        //         ys.domain(['A', 'B', 'C', 'D', 'E'])
        //         ys.range([100, 800])
        //         return ys;
        //     }
        // })

        this.g.setScale('y', 'kisa_waf', (statistic, prevScale) => {
            let ys = d3.scaleOrdinal()
            ys.range(d3.range(0,300,12))
            return ys
        })

        this.g.setScale('y', 'kisa_ddei', (statistic, prevScale) => {
            let ys = d3.scaleOrdinal()
            ys.range(d3.range(300,600,12))
            return ys
        })

        this.g.setScale('y', 'kisa_spamsniper', (statistic, prevScale) => {
            let ys = d3.scaleOrdinal()
            ys.range(d3.range(600,900,12))
            return ys
        })

        this.g.setScale('y', 'email', (statistic, prevScale) => {
            let ys = d3.scaleOrdinal()
            ys.range(d3.range(200,1000,12))
            return ys
        })

    }

    async handleHoverNode(d) {
        if(d.data.label == 'receiver' || d.data.label == 'sender' || d.data.fake){

        } else{
            if(d.data.label !== 'meta' || d.data.hoverFlag !== 'True') {
                this.expandData = await this.pocApi.expandAll(d.data.id, 'ioc', convertGraphPath)
                // if(d.data.ioc_flag === true) this.expandData = await this.pocApi.expandAll(d.data.id, 'ioc', convertGraphPath)
                // else this.expandData = await this.pocApi.expandAll(d.data.id, d.data.label, convertGraphPath)
                //console.log('handleHoverNode hello#1',this.expandData)
                this.expandData.forEach(p=>{
                    //console.log('handleHoverNode hello#2',this.expandData)
                    this.handleIocSepearate(p.p)
                })

                if(this.expandData.length > 10) {
                    let labelTypeObj = {}
                    this.expandData.filter(p => {
                        let vtx = p.p.vertices[1]
                        // let id = `${vtx.id.oid}.${vtx.id.id}`;
                        return !this.g.getNode(vtx.id)
                    }).forEach(v => {
                        if (labelTypeObj[v.p.vertices[1].label] == undefined) {
                            labelTypeObj[v.p.vertices[1].label] = 1
                        } else {
                            labelTypeObj[v.p.vertices[1].label] += 1
                        }
                    })

                    let labelKeys = Object.keys(labelTypeObj)
                    let labelValues = Object.values(labelTypeObj)

                    let rsltTmp = labelKeys.map(function (e, i) {
                        return [`${e} (${labelValues[i]})`];
                    });

                    //별도 메소드로 독립 시켜야함(by kkm)
                    let hoverVertices = [];
                    let hoverEdges = [];

                    rsltTmp.forEach((x, i) => {
                        hoverVertices.push({
                            id: `${d.data.id}.${i}`,
                            label: 'meta',
                            props: {value: x[0]}
                        })

                        hoverEdges.push({
                            id: `${d.data.id}.${i}`,
                            label: 'meta',
                            source: `${d.data.id}`,
                            target: `${d.data.id}.${i}`,
                            props: {value: x[0]}
                        })
                    })

                    hoverVertices.forEach((v,i) => {
                        this.g.addNode(v.id, v)
                        this.g.getNode(v.id).fx = d.x + 200
                        this.g.getNode(v.id).fy = d.y * (i/2+0.5)
                    })

                    hoverEdges.forEach(e => {
                        this.g.addLink(e.source, e.target, e.props, e.id, e.label, false)
                    })
                } else {
                    this.expandData.filter(p => {
                        return !this.g.getNode(p.p.vertices[1].id)
                    }).forEach(p => {
                            //console.log('hover p',p)
                        let vtx = p.p.vertices
                        let startHoverPt = p.p.vertices[0]
                        p.p.vertices.forEach((v,i) => {
                            if (v.id !== startHoverPt.id && v.label !== 'sender' && v.label !== 'receiver') {
                                let hoverVtx = {
                                    id: `meta_${v.id}.${i}`,
                                    label: v.label,
                                    props: v.props
                                }

                                let hoverEdge = {
                                    id: `meta_${v.id}.${i}`,
                                    label: v.label,
                                    source: `${startHoverPt.id}`,
                                    target: `meta_${v.id}.${i}`
                                }

                                this.g.addNode(hoverVtx.id,hoverVtx)
                                this.g.addLink(hoverEdge.source,hoverEdge.target,undefined,hoverEdge.id,hoverEdge.label, false)
                            }
                        })
                            // if (p.p.edges !== undefined) {
                            //     p.p.edges.forEach(e => {
                            //         this.g.addLink(e.source, e.target, e.props, e.id, e.label)
                            //     })
                            //  }
                    })
                }
                this.graphWidget.render();
            }
        }
    }

    removeHoverNodes() {
        this.graphWidget.nodes.forEach(v => {
            //console.log('hover_out', v)
            if (v.data.label === 'meta' || v.data.id.startsWith('meta')) {
                //console.log('hover_out2',v)
                this.graphWidget.removeLink(v.data.id)
                this.graphWidget.removeNode(v.data.id)
                this.g.removeNode(v.data.id)
            }
        })
    }

    handleHoverOut(d) {
        this.removeHoverNodes()
        //console.log('graph widget link data after', this.graphWidget.links)
        this.graphWidget.render()
    }

    handleNodeMenuClick(evt) {
        evt.stopPropagation()
    }

    async setPattern(pattern) {
        // console.log('pattern', pattern, pattern.length)
        let result;

        if (pattern.length < 2) result = await this.pocApi.vertexSearch(pattern)
        else result = await this.pocApi.searchPattern(pattern)

        let graphData = result.embedded

        if (result.embedded instanceof Array) {
            if(pattern.length < 2) {
                graphData = vertex2GraphElemArray(result.embedded)
                graphData.edges = []
            }
            else graphData = path2GraphElemArray(result.embedded)
        }

        // input data - similart data graph formatting
        if(graphData.vertices.length == 0) {
            console.log('There are no graph path which are matching...')

            let vertices = {}
            let edges = {}
            vertices[`${pattern[0].label}_1`] = {
                id: `${pattern[0].label}_1`,
                label: pattern[0].label,
                props: {
                    value: pattern[0].params[0].value,
                    desc: `시스템에 없는 정보입니다.`
                },
                fake: true
            }

            let simRes = await this.pocApi.findSimilarValue(pattern[0].params[0].value, pattern[0].label)
            if(simRes.length>0){
                let reqNodeLabel = await this.pocApi.findIocLabel(simRes[0].val)

                let reqNodeArr = []
                let reqNode = {}
                reqNode['gtype'] = 'vertex'
                reqNode['label'] = reqNodeLabel.embedded
                reqNode['params'] = [{name:'value', comp:'=', value:simRes[0].val}]
                reqNodeArr.push(reqNode)
                let resNode = await this.pocApi.vertexSearch(reqNodeArr)

                resNode.embedded.forEach(n=>{
                    vertices[`${n.a.id.oid}.${n.a.id.id}`] = {
                        id: `${n.a.id.oid}.${n.a.id.id}`,
                        label: n.a.props.type,
                        props: n.a.props
                    }
                })

                if(simRes.length > 0) {
                    edges[`sim_1`] = {
                        id: `sim_1`,
                        label:'similar_to',
                        source: `${pattern[0].label}_1`,
                        target: simRes[0].id,
                        props: {
                            sim:simRes[0].sim
                        }
                    }
                }
            }

            graphData = {
                vertices:Object.values(vertices),
                edges:Object.values(edges)
            }
        }

        // this.patternSearch.setPattern(pattern)

        // phase 1: sender, receiver node,edge create
        // 규칙 : sender -> email, email -> receiver
        // id_s_1~... : sender, id_r_1~... : receiver, id_s_e_1 : sender edge, id_r_e_2 : receiver edge
        // prop : sender(source_ip, source_email_address), receiver(target_email_address)
        //      : email(위 3개 삭제)
        // this.handleEmailSeparate(graphData)
        this.handleIocSepearate(graphData)

        graphData.vertices.forEach(v => {
            this.g.addNode(v.id, v)
        })

        if(graphData.edges !== undefined) {
            graphData.edges.forEach(e => {
                this.g.addLink(e.source, e.target, e.props, e.id, e.label, false)
            })
        }

        this.handleSetScale()
        this.g._forceSimul.alphaTarget(0.1).restart();

        // this.graphWidget.setGraphData(graphData)

        // this.tableview.setGraphPathList(result.embedded)

        // setTimeout(()=>{
        //     this.graphWidget.setLayoutHint({cypher: pattern})
        // },5000)

        this.propview.clearClusterInfo();
    }

    handleIocSepearate(graphData) {
        graphData.vertices.filter(v=>v.label=='ioc').forEach(ioc=>{
            //console.log('hello',ioc)
            if(ioc.props.type) {
                ioc.ioc_flag = true
                ioc.label = ioc.props.type
                delete ioc.props.type
            }
        })
    }

    handleEmailSeparate(graphData) {
        graphData.vertices.filter(v=>v.label=='email').forEach(email=>{
            if(email.props.source_email_address) {
                email.props.source_email_address.split(';').forEach((sender,idx)=>{
                    let sender_id = `${sender}_sender`
                    graphData.vertices.push(
                        {
                            id: sender_id,
                            label: 'sender',
                            props: {
                                source_ip: email.props.source_ip,
                                source_email_address: sender
                            }
                        }
                    )
                    graphData.edges.push(
                        {
                            id: `${email.id}_${sender_id}`,
                            label: 'send',
                            props: {},
                            source: sender_id,
                            target: email.id
                        }
                    )
                })
            }
            if(email.props.target_email_address){
                email.props.target_email_address.split(';').forEach((receiver,idx)=>{
                    let receiver_id = `${receiver}_receiver`
                    graphData.vertices.push(
                        {
                            id:receiver_id,
                            label:'receiver',
                            props:{
                                target_email_address:receiver
                            }
                        }
                    )
                    graphData.edges.push(
                        {
                            id:`${email.id}_${receiver_id}`,
                            label:'receive',
                            props:{},
                            source:email.id,
                            target:receiver_id
                        }
                    )
                })
            }
        })
    }

    handlePathSelect(evt) {

    }

    // async handleElemSelect(evt) {
    //     this.graphWidget.lookAt(evt.type, evt.id)
    //
    //     let detail;
    //     if(evt.type == 'node') {
    //         detail = this.graphWidget.getNodeDataById(evt.id)
    //     }else {
    //         detail = this.graphWidget.getLinkDataById(evt.id)
    //     }
    //
    //     console.log('detail', detail)
    //
    //     this.propview.setTargetObj(detail)
    // }


    initGraphWidget() {
        // this.dataSource = new PocDataProvider()

        // this.dataSource.on('table', (rows)=>{
        //     this.tableview.setGraphPathList(rows)
        // })

        this.graphWidget = new DetailGraphWidget({
            domSelector: document.querySelector('#graphWidget'),
            dataSource: this.dataSource
        })
    }

    unselectNode() {
        this.propview.hide()
        this.graphWidget.handleUnHighlightNode()
    }

    async handleSearchRankValue(resObj) {
        let targetNode = this.g.getNode(resObj.node_id)
        if (!targetNode) {
            let val = String(resObj.node_value).replace(/"/gi,'')
            let reqNodeLabel = await this.pocApi.findIocLabel(val)
            let reqNodeArr = []
            let reqNode = {}

            reqNode['gtype'] = 'vertex'
            reqNode['label'] = reqNodeLabel.embedded
            reqNode['params'] = [{name:'value', comp:'=', value:val}]
            reqNodeArr.push(reqNode)

            let resNode = await this.pocApi.vertexSearch(reqNodeArr)
            resNode.embedded.map(n=>{
               return n.a
            }).filter(n=>{
                return `${n.id.oid}.${n.id.id}` == resObj.node_id
            }).forEach(n=>{
                let node = {}
                let nodeId = `${n.id.oid}.${n.id.id}`
                node[`id`] = nodeId
                node[`label`] = `${n.props.type}`
                node[`props`] = n.props

                this.g.addNode(nodeId, node)
                targetNode = this.g.getNode(nodeId)
            })
        }
        this.graphWidget.handleHighlightNode(targetNode,'red')
    }

    handleKeywordSearch(value) {
        let targetNodes = this.g.getNodeByValue(value)

        targetNodes.forEach((n,i)=>{
            this.graphWidget.handleHighlightNode(n)
            if(i==0) {
                let left = -((window.innerWidth / 2) - 700)
                let top = 0
                this.graphWidget.lookAt('node', n.id, {x:left, y:top, s:1})
            }
        })
    }
}
