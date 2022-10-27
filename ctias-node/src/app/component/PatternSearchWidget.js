import * as d3 from "d3";
import EventEmitter from "../util/EventEmitter";
import {toggleClass} from "../util/Common"
const _template = require('lodash.template');

require('./PatternSearch.styl')

const _html = `
    
        <div class="flex items-center px-4" style="background:#625955">
            <h3 class="text-xs text-white">Pattern</h3>
        </div>
        <div class="flex flex-1 relative">
            <div id="coo" class="path-box bg-white flex flex-1 items-center border-b border-grey scroll text-xs px-3 z-50">
                <!--<p class="item node">( E-mail )</p>-->
                <!--<p class="item">- [ email label name ] -</p>-->
            </div>
            <div class="absolute z-40" style="top:45px; left: 0px; right: 0;">
                <div class="bg-white hidden">
                    <ul class="list-reset">
                        <li class="flex items-center justify-between p-2 border-b border-grey text-xs">
                            <div class="flex items-center">
                                <p class="item node">( E-mail )</p>
                                <p class="item">- [ email label name ] -</p>
                                <p class="item node">( E-mail )</p>
                            </div>
                            <div>
                                <span class="mr-2">14:42:32</span><span>2019.03.24</span>
                            </div>
                        </li>
                        <li class="flex items-center justify-between p-2 border-b border-grey text-xs">
                            <div class="flex items-center">
                                <p class="item node">( E-mail )</p>
                                <p class="item">- [ email label name ] -</p>
                                <p class="item node">( E-mail )</p>
                            </div>
                            <div>
                                <span class="mr-2">14:42:32</span><span>2019.03.24</span>
                            </div>
                        </li>
                        <li class="flex items-center justify-between p-2 border-grey text-xs">
                            <div class="flex items-center">
                                <p class="item node">( E-mail )</p>
                                <p class="item">- [ email label name ] -</p>
                                <p class="item node">( E-mail )</p>
                            </div>
                            <div>
                                <span class="mr-2">14:42:32</span><span>2019.03.24</span>
                            </div>
                        </li>
                    </ul>
                </div>
                <div tabindex="1" class="absolute bg-white w-full candidates overflow-y-auto outline-none" style="max-height: 145px;">
<!--                    <ul class="list-reset">-->
<!--                        <li>1</li>-->
<!--                        <li>2</li>-->
<!--                    </ul>-->
                </div>
            </div>
        </div>
        
        
        <div class="flex" style="background:#625955; min-width: 42px;">
            <a class="deep flex items-center px-3"><img style="width: 18px; right:10px;" src="/icon/play.svg" alt="pathplayicon"></a>
        </div>      
        
    
`

export default class PatternSearchWidget extends  EventEmitter {

    constructor(domSelector) {
        // todo : pattern_change event 구현
        super('pattern_search', 'pattern_change')

        this.container = typeof domSelector == "string" ? document.querySelector(domSelector) : domSelector
        this.container.innerHTML = _html
        this.candidateElem = this.container.querySelector('.candidates')

        this.handlePatternSearch = this.handlePatternSearch.bind(this);
        this.handleCandidateClick = this.handleCandidateClick.bind(this)

        this.candidateElem.addEventListener('click', this.handleCandidateClick)
        this.selectedCanidateIndex = -1

        this.container.querySelector('a.deep').addEventListener('click', this.handlePatternSearch)

    }


    handlePatternSearch(shift) {
        let isAdvanced = shift
        this.fire('pattern_search', this.pattern, isAdvanced)
    }


    handleCandidateClick(evt) {
        console.log(evt.target.dataset.pindex)

        this.setPattern(this.candidate[evt.target.dataset.pindex].pattern)
        this.candidateElem.innerHTML = ''
        this.fire('pattern_change', this.pattern)
    }

    setPattern(pattern) {
        this.pattern = pattern;

        // console.log('pattern', pattern)

        let pathBoxElem = this.container.querySelector('.path-box')

        pathBoxElem.addEventListener('mousewheel', e => {
            e.preventDefault();
            let delta = Math.sign(e.deltaY);
            console.log(delta)
        })

        let htmlString = pattern.map((p)=>{

            switch(p.gtype) {
                case 'vertex' :

                    let filterIcon = p.params.length > 0 ? '<i class="fas fa-filter"></i>' : ''
                    return `<p class="item node rounded overflow-hidden mr-2 z-50">
                        <button>
                            ${filterIcon}
                            <span class="inline-block text-center px-4">${p.label}  </span>
                        </button>
                        </p>`
                    break;
                case 'edge' :
                    if(p.direction == 'forward') {
                        return `<p class="relative item mr-5 right z-40"><button>
                            <span class="inline-block pl-4 pr-3"> ${p.label} </span>
                        </button></p>`
                    }else {
                        return `<p class="relative item ml-3 mr-2 left z-40"><button>
                            <span class="inline-block pl-3 pr-4"> ${p.label} </span>
                            
                        </button></p>`
                    }
                    break;
            }
        }).join('\n')

        pathBoxElem.innerHTML = htmlString;
    }


    setCandidate(c) {
        this.candidate = c;
        this.renderCanidates()
    }

    renderCanidates() {


        // let vertexTmpl = _template(`
        //     ( :${p.label} )
        // `)
        //
        // let edgeTmpl = _template(`
        //     - [ :${p.label} ] ->
        // `)

        let lineTemplate = _template(`
            <% pattern.forEach((p) =>{ %>               
               <% if(p.gtype == 'vertex') {%>
                ( :<%=p.label%> )
               <%} else {  %>
                   <% if(p.direction == 'forward') {%>
                        - [ :<%=p.label%> ] ->
                   <%} else { %>
                        <- [ :<%=p.label%> ] - 
                   <%} %>
               <% } %>                
            <% }) %>
        
        `)

        this.candidateElem.innerHTML = this.candidate.map((c,idx)=>{
            return `<div class="p-2 text-xs " data-pindex="${idx}">${ lineTemplate( c ) }</div>`
        }).join('\n')

    }

    hidePatternList() {
        this.candidate = [];
        this.renderCanidates()
    }
}
