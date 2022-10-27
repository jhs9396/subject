import EventEmitter, {DomComponent} from "../util/EventEmitter";
const _template = require('lodash.template');



const _html = _template(`
    <div class="menuview w-48 border border-grey bg-white absolute shadow-md">
        <div class="bg-grey p-2 px-3 border-b border-grey flex justify-between text-xs">
            <h3 class="title text-xs"><%=title%></h3>
            <button class="removeMenu w-3">
            <svg xmlns="http://www.w3.org/2000/svg" id="root" version="1.1" viewBox="0 0 12 14">
                <path fill="none" stroke="currentColor" stroke-linecap="square" d="M 4.5 4.5 L 11.5 11.5 M 4.5 11.5 L 11.5 4.5"/>
            </svg>  
            </button>
        </div>
        <ul class="list-reset w-full overflow-x-hidden overflow-y-auto text-xs menu-list pb-1" style="max-height: 200px">
<!--            <li class="border-b border-grey p-2 py-3">Filter</li>-->
<!--            <li class="border-b border-grey p-2 py-3">Expand</li>-->
<!--            <li class="border-b border-grey p-2 py-3">Save</li>-->
<!--            <li class="border-b border-grey p-2 py-3">Delete</li>-->
        </ul>
        <span class="arrow-box" style="top:-16px;left:26px"></span>
    </div>
`)

let divElem = null

export default class ContextMenu extends DomComponent{
    constructor(domSelector,title,menues) {
        super(domSelector, 'contextMenuSelected','canceled')
        // this.domContainer = typeof domSelector == "string" ? document.querySelector(domSelector) : domSelector
        // this.domContainer.innerHTML = _html
        if(divElem == null){
            divElem = document.createElement('div');
        }

        divElem.innerHTML = _html({title})

        this.domContainer.appendChild( divElem )
        divElem.addEventListener('click', evt=>{
            evt.stopPropagation()

            if(evt.target.dataset.menuid){
                this.fire('contextMenuSelected', evt.target.dataset)
                this.closeContextMenu()
            }
        })

        this.$1('.removeMenu').addEventListener('click', evt=>{
            this.closeContextMenu()
            // this.fire('canceled')
        })

        divElem.style.left = this.domContainer.offsetLeft
        divElem.style.top = this.domContainer.offsetTop
        this.setMenu(menues)
    }

    closeContextMenu() {
        if ( divElem ) {
            this.domContainer.removeChild(divElem)
            divElem.innerHTML =''
            divElem.remove()
            divElem = null;
        }
    }

    setMenu(menuArr) {
        this.$1('.menu-list').innerHTML = menuArr.map( m => {
            var checked = '';
            if ( m.checked !== undefined ) {
                checked = m.checked ? '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="check-circle" class="w-3 svg-inline--fa fa-check-circle fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="#6cb2eb" d="M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256 119.033 8 256 8s248 111.033 248 248zM227.314 387.314l184-184c6.248-6.248 6.248-16.379 0-22.627l-22.627-22.627c-6.248-6.249-16.379-6.249-22.628 0L216 308.118l-70.059-70.059c-6.248-6.248-16.379-6.248-22.628 0l-22.627 22.627c-6.248 6.248-6.248 16.379 0 22.627l104 104c6.249 6.249 16.379 6.249 22.628.001z"></path></svg>'
                : '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="check-circle" class="w-3 svg-inline--fa fa-check-circle fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="#efefef" d="M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256 119.033 8 256 8s248 111.033 248 248zM227.314 387.314l184-184c6.248-6.248 6.248-16.379 0-22.627l-22.627-22.627c-6.248-6.249-16.379-6.249-22.628 0L216 308.118l-70.059-70.059c-6.248-6.248-16.379-6.248-22.628 0l-22.627 22.627c-6.248 6.248-6.248 16.379 0 22.627l104 104c6.249 6.249 16.379 6.249 22.628.001z"></path></svg>';
            }
            return `
                <li class="w-full p-2 px-3 flex items-center justify-between"
                    data-menuid="${m.menu_id}" 
                    data-menuname="${m.menu_name}"
                    data-checked="${m.checked}" > 
                    ${m.menu_name}
                    ${checked}
                </li>
            `
        }).join('\n')
    }
}
