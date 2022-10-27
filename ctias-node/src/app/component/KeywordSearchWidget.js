
import {findParent, findChild, LABEL_MAP_FN} from "../util/Common";
import EventEmitter from "../util/EventEmitter";
import PatternBuilder from "../util/PatternBuilder";
import * as d3 from "d3";
import PatternSearchWidget from "./PatternSearchWidget";

require('./KeywordSearch.styl')


const _html = `
    <div class="flex flex-1 keywordsearchwidget">
        <!-- <div class="flex items-center px-4" style="background:#625955">
            <h3 class="text-xs text-white">Keyword</h3>
        </div> -->
        <div class="relative flex flex-1">
            <input class="outline-none text-xs pl-12 pr-2 z-10 border-b border-grey" type="text" style="width:100%;" placeholder="IP, 도메인, URL, Email, Hash 등 IoC 정보를 입력할 수 있습니다." />
            <span class="absolute m-auto pin-y z-10" style="width:14px;left:1rem;top:.9rem" alt="searchicon">
                <svg id="Layer_1" 
                    data-name="Layer 1" 
                    xmlns="http://www.w3.org/2000/svg"
                    class="w-4"
                    viewBox="0 0 400 399.48">
                    <path fill="#aaa" d="M398.47,369.56l-96-96a5.17,5.17,0,0,0-3.26-1.51l-18.33-1.52a161.79,161.79,0,1,0-10.09,10.12l1.52,18.3a5.17,5.17,0,0,0,1.51,3.26l96,96a5.2,5.2,0,0,0,7.37,0l21.28-21.28A5.2,5.2,0,0,0,398.47,369.56Zm-237-82.79a125,125,0,1,1,125-125A125,125,0,0,1,161.49,286.77Z" 
                    transform="translate(0 -0.26)"/>
                </svg>
            </span>
            <div tabindex="1" class="candidates absolute overflow-y-auto outline-none">
            </div>
        </div>        
    </div>
     
  
`

class KeywordSearchWidget extends EventEmitter {

    constructor(domSelector) {
        super('search','keywordChanged');

        this.container = document.querySelector(domSelector)
        this.container.innerHTML = _html;

        this.inputElem = this.container.querySelector('input')
        this.candidateElem = this.container.querySelector('.candidates')
        this.candidate = []
        this.selectedCanidateIndex = -1

        this.handleInputKeyUp = this.handleInputKeyUp.bind(this);
        this.handleCandidateKeyUp = this.handleCandidateKeyUp.bind(this);
        this.handleClickOnCandidateElem = this.handleClickOnCandidateElem.bind(this);

        this.candidateElem.addEventListener('keyup', this.handleCandidateKeyUp)
        this.candidateElem.addEventListener('click', this.handleClickOnCandidateElem)

        this.inputElem.addEventListener('keyup', this.handleInputKeyUp)
        this.inputElem.addEventListener('click', ()=>this.inputElem.select())
    }

    getKeywordList() {
        console.log('')
    }

    async handleInputKeyUp(evt){
        switch(evt.code) {
            case "Enter":
                // this.fire('search', evt.target.value)
                // this.candidate = []
                // this.selectedCanidateIndex = -1
                // this.renderCanidates()
                this.fire('search', evt.target.value)
                break;
            case "ShiftLeft":
                // this.fire('search', evt.target.value)
                break;
            case "NumpadEnter":
                this.fire('search', evt.target.value)
                break;
            case "ArrowDown":
                this.selectedCanidateIndex = 0
                this.renderCanidates()
                this.candidateElem.focus()
                break;

            default:
                if(evt.target.value.length >= 3 ){
                   this.fire('keywordChanged',  evt.target.value)
                }else{
                    // this.fire('search', evt.target.value)
                    // this.candidate = []
                    // this.selectedCanidateIndex = -1
                    // this.renderCanidates()
                }
                // this.fire('keywordChanged',  evt.target.value)
                break;
        }
    }

    handleClickOnCandidateElem(event){
        let elem = findChild(event.target , 'p.flex-1')

        if(elem) {
            let keyword = elem.dataset.value

            this.inputElem.value = keyword
            this.candidate = []
            this.selectedCanidateIndex = -1
            this.renderCanidates()
            this.fire('search', this.inputElem.value)
        }
    }

    handleCandidateKeyUp(evt) {
        switch(evt.code) {
            case "Enter":
                this.inputElem.value = this.candidate[this.selectedCanidateIndex].keyword
                this.candidate = []
                this.selectedCanidateIndex = -1
                this.fire('search', this.inputElem.value)
                break;
            case "ArrowDown":
                this.selectedCanidateIndex = (this.selectedCanidateIndex+1) % this.candidate.length
                break;

            case "ArrowUp":
                this.selectedCanidateIndex--
                if(this.selectedCanidateIndex < 0) {
                    this.inputElem.focus()
                }else {

                }
                break;

            default:

                break;
        }

        this.renderCanidates()
    }

    // 키워드 후보를  선택하는 selectbox 표시
    setCandidate(c) {
        this.candidate = c;
        this.renderCanidates()
    }

    renderCanidates() {

        this.candidateElem.innerHTML = this.candidate.map((c,idx)=>{
            if(this.selectedCanidateIndex == idx) {
                return `
                    <div class="flex px-2 items-center text-xs selected cursor-pointer" style="height:34px">
                        <small class="label bg-grey mr-2 block border border-grey rounded-sm" style="max-width:80px; padding: .15rem .25rem">${c.label}</small>
                        <p class="flex-1"
                            data-value="${c.keyword}" 
                            title="${c.keyword}">
                            ${c.keyword}
                        </p>
                    </div>
                `
            }else {
                return `
                    <div class="flex px-2 items-center text-xs cursor-pointer" style="height:34px">
                        <small class="label bg-grey mr-2 block border border-grey rounded-sm" style="padding: .15rem .25rem">${c.label}</small>
                        <p class="flex-1"
                            data-value="${c.keyword}" 
                            title="${c.keyword}">
                            ${c.keyword}
                        </p>
                    </div>
                `
            }
        }).join('\n')
        this.candidateElem.scrollTop = this.selectedCanidateIndex * 34
    }

    hideKeywordList() {
        this.candidate = []
        this.renderCanidates()
        this.selectedCanidateIndex = -1
    }
}

export default KeywordSearchWidget;
