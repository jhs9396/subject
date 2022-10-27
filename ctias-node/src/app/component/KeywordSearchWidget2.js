import EventEmitter from "../util/EventEmitter";

require('./KeywordSearch2.styl')

const _html = `
    <div class="flex flex-1 keywordsearchwidget">
        <!-- <div class="flex items-center px-4" style="background:#625955">
            <h3 class="text-xs text-white">Keyword</h3>
        </div> -->
        <div class="relative flex flex-1">
            <input class="outline-none text-xs pl-12 pr-2 z-10 border-b border-grey" type="text" style="width:100%;" placeholder="조회된 IoC정보를 찾아줍니다." />
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

        //========== element or variable initialization
        this.container = document.querySelector(domSelector)
        this.container.innerHTML = _html;
        this.inputElem = this.container.querySelector('input')

        //========== bind area
        this.handleInputKeyUp = this.handleInputKeyUp.bind(this);

        //========== event area
        this.inputElem.addEventListener('keyup', this.handleInputKeyUp)
    }

    handleInputKeyUp(evt) {
        this.fire('search', evt.target.value)
    }
}

export default KeywordSearchWidget;
