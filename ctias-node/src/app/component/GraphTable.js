import EventEmitter from "../util/EventEmitter";
import {hasClass, toggleClass} from "../util/Common";

require('./GraphTable.styl')

const _html = `

    <div class="knob absolute m-auto pin-x cursor-pointer" style="background: #221714; width:60px; height:14px; top:-13px;">
        <div class="flex flex-col justify-center items-center h-full">
            <span class="block bg-white mb-px" style="width:40px; height:1px;"></span>
            <span class="block bg-white mb-px" style="width:40px; height:1px;"></span>
            <span class="block bg-white" style="width:40px; height:1px;"></span>
        </div>
    </div>
    
    <div class="path_grid bg-grey min">
        <div class="border border-b-0 border-grey">
            <table class="w-full">
                <thead class="bg-grey text-xs">
                    <tr>
                        <th colspan="2" class="grid_toolbar">
                            <div class="flex justify-end">
                                <button class="px-4">Play</button>
                                <button class="px-4 border-l border-grey">Link</button>
                                <button class="px-4 border-l border-grey">Set</button>
                            </div>
                        </th>
                    </tr>
                    <tr>
                        <th width="50" class="px-2"></th>
                        <th>Path</th>
                    </tr>
                </thead>
            </table>
        </div>

        <div class="overflow-y-auto border border-t-0 border-grey" style="max-height: 239px">
            <table class="w-full">
                <tbody class="pathlist bg-white text-xs">
                </tbody>
            </table>           
        </div>
    </div>
`

const LABEL_MAP_FN = {
    email_message: v=>v.props.subject ,
    email_address: v=>v.props.value ,
    groups: v=>v.props.dtime ,
};


class GraphTable extends EventEmitter{
    constructor(domSelector) {
        super('rowSelected','pathElemSelected')
        this.rows = []

        this.domContainer = typeof domSelector == 'string' ? document.querySelector(domSelector) : domSelector
        this.domContainer.innerHTML = _html
        this.knob = this.domContainer.querySelector('.knob')
        this.pathGridElem = this.domContainer.querySelector('.path_grid')

        this.handleRowClick = this.handleRowClick.bind(this);
        this.handleKnobClick = this.handleKnobClick.bind(this);

        this.domContainer.querySelector('.pathlist').addEventListener('click', this.handleRowClick)
        this.knob.addEventListener('click', this.handleKnobClick)
    }

    handleRowClick(evt) {
        console.log(evt)
        let t = evt.target

        switch(t.tagName.toUpperCase()) {
            case 'P':
                if(hasClass(t,'node')) {
                    this.fire('pathElemSelected', {type: 'node', id: t.dataset.gid})
                }else {
                    this.fire('pathElemSelected', {type: 'link', id: t.dataset.gid})
                }
                break;

            case 'TD':
                if(hasClass(t,'path-index')) {
                    this.fire('rowSelected', this.rows[evt.target.dataset.rowindex])
                }

        }
    }

    handleKnobClick(evt) {
        toggleClass(this.pathGridElem, 'min')
    }


    setGraphPathList(pathList) {
        this.rows = pathList

        if(pathList == null || pathList.length == 0) {
            this.pathGridElem.style.height = 0
            return
        }else {
            this.pathGridElem.style.height = undefined
        }

        this.domContainer.querySelector('.pathlist').innerHTML = this.rows.map((p,idx)=>{
            return `
                <tr class="text-xs select-none" >
                    <td width="50" align="center" data-rowindex="${idx}" class="path-index px-2" style="cursor: pointer;">${idx+1}</td>
                    <td class="px-2 ">
                        <div class="flex">${this.makePathElemString(p.p)}</div>
                    </td>
                </tr>
            `
        }).join('\n')

    }


    makePathElemString(path) {
        let htmls = []
        for(let idx = 0; idx < path.vertices.length ; idx++) {
            let vertex = path.vertices[idx]
            let edge = idx < (path.edges.length) ? path.edges[idx] : null

            // console.log(vertex,'vertex')
            htmls.push(`<p class="item node" data-gid="${vertex.id.oid}.${vertex.id.id}">( ${this.makeVertexLabel(vertex)} )</p>`)
            if(edge) {
                if(vertex.id.oid == edge.start.oid) {
                    htmls.push(`<p class="item link" data-gid="${edge.id.oid}.${edge.id.id}">- [ :${edge.label} ] -></p>`)
                }else {
                    htmls.push(`<p class="item link" data-gid="${edge.id.oid}.${edge.id.id}"><- [ :${edge.label} ] -</p>`)
                }
            }
        }

        return htmls.join('\n');
    }

    makeVertexLabel(v){
        let fn = LABEL_MAP_FN[v.label] || (v=>v.props.value || v.label)
        return fn(v)
    }

}


export default GraphTable;
