import * as d3 from "d3";

import KeywordSearchWidget from "../component/KeywordSearchWidget";
import MetaGraphWidget from "../component/MetaGraphWidget";
import PatternSearchWidget from "../component/PatternSearchWidget";
import EventEmitter, {DomComponent} from "../util/EventEmitter";
import PocApiClient from "../util/PocApiClient";
import PatternBuilder from "../util/PatternBuilder";


let apiClient = new PocApiClient('/')

const _html = `
            <div class="relative flex flex-col flex-1 h-full">
                <div class="flex z-50" style="height: 45px;box-shadow:1px 2px 4px rgba(154, 154, 154,.85);width: 80%;top:0;bottom:0;margin:auto;left:0;right:0;position:absolute;">
                    <div style="position:absolute; top:-45px; left: 0; right: 0; margin: auto; text-align: right; font-style:italic ; padding-right: .8rem; font-size: 1.85rem; color: #525252"><small style="font-size:80%"><small style="opacity:.65">VERIDATO</small></small><span style="letter-spacing: .05rem">CTI</span></div>
                    <div id="keywordInput" class="flex flex-1"></div>
                    <div id="patternInput" style="display: none;" class="flex flex-1"></div>                                        
                    <div style="position:absolute; top:35px; left: 0; right: 0; margin: auto; text-align: right; font-style:italic ; padding-right: .8rem; font-size: 1.85rem; color: #525252"><small style="font-size:60%"><small style="opacity:.65"><a href="veridato_ctias_quick_guide_html.html" target="_blank">manual</a></small></small></div>
                </div>
                <div id="metagraph" class="h-full flex-1"></div>
            </div>
        `

function makePatternSignature(pattern) {
    console.log('pattern', pattern)

    return pattern.map((p)=>{
        if(p.gtype == 'vertex'){ //vertex
            return `(:${p.label})`
        }else{ //edge
            if(p.direction == 'forward'){
                return `-[:${p.label}]->`
            }else{
                return `<-[:${p.label}]-`
            }
        }
    }).join(' ')
}



export default class FirstPage extends DomComponent{
    constructor(domSelector) {
        super(domSelector, 'patternSearch')

        // this.dispatch = d3.dispatch('patternSearch')

        this.rootDomElem = document.querySelector(domSelector);
        this.rootDomElem.innerHTML = _html;

        // init component -------------------------------------------
        this.metaGraph = new MetaGraphWidget('#metagraph');
        this.patternSearch = new PatternSearchWidget('#patternInput')
        this.keywordSearch = new KeywordSearchWidget('#keywordInput');

        this.nodes = [];
        this.links = [];
        //console.log('nodes, links',this.nodes,this.links)
        this.patternBuilder = new PatternBuilder({nodes:this.nodes, links:this.links}, this.container)

        // init event handler -------------------------------------------
        this.keywordSearch.on('search', this.handleKeywordSearch.bind(this));
        this.keywordSearch.on('keywordChanged', this.handleKeywordChange.bind(this));
        this.metaGraph.on('patternChange', this.handlePatternChange.bind(this));

        this.patternSearch.on('pattern_search', (pattern)=>{
            this.fire('patternSearch', pattern)
        });

        this.patternSearch.on('pattern_change', (pattern)=>{
        //     // todo : event handler impl
            this.metaGraph.setPattern(pattern)
        });

        // resize event -------------------------------------------
        window.addEventListener('resize',()=>{
            this.metaGraph.resize()
        })

        // init data -------------------------------------------

        // apiClient.getMetaGraph().then( metaData=>{
        //     console.log('metaData', metaData)
        //     this.metaGraph.setMetaData(metaData)
        // })


        this.domContainer.addEventListener('click',(evt)=>{
            this.keywordSearch.hideKeywordList()
            // this.patternSearch.hidePatternList()
        })


    }

    async handleKeywordSearch(keyword,shift) {
        if ( !keyword ) return;
        this.patternBuilder.clearPattern();
        // let labels = await apiClient.labelByKeyword(keyword)
        // this.metaGraph.setKeywordFindLabels(labels, keyword)
        let nodes = await apiClient.nodeByKeyword(keyword)
        let res = await apiClient.findIocLabel(keyword)
        if(nodes.length == 0) {
            let obj = {}
            obj['gtype'] = 'vertex'
            obj['label'] = res.embedded != '' ? res.embedded : 'unknown'
            obj['params'] = [{name:'value', comp:'=', value:keyword}]
            this.patternBuilder.append(obj)
        }else{
            nodes.forEach(n=>{
                this.patternBuilder.append(n)
            })
        }

        this.handlePatternChange(this.patternBuilder.getPattern())
        this.patternSearch.handlePatternSearch(shift)
    }

    async handleKeywordChange(keyword) {
        let valueArr = await apiClient.findKeywordCandidate(keyword)
        // console.log('result keyword ', valueArr)
        this.keywordSearch.setCandidate(valueArr)
    }

    async handlePatternChange(pattern) {
        this.patternSearch.setPattern(pattern)
        let rp = await apiClient.getRecommandPatterns(pattern)

        this.patternSearch.setCandidate(rp)
    }

}

