export function toggleClass(el, className) {
    if (el.classList) {
        el.classList.toggle(className);
    } else {
        var classes = el.className.split(' ');
        var existingIndex = classes.indexOf(className);

        if (existingIndex >= 0)
            classes.splice(existingIndex, 1);
        else
            classes.push(className);

        el.className = classes.join(' ');
    }
}

export function parents(el, tagName) {
    if (!el.parentNode || el.parentNode.tagName.toUpperCase() == tagName) {
        return el.parentNode
    } else {
        return parents(el.parentNode, tagName)
    }
}

export function addClass(el, className) {
    if (el.classList)
        el.classList.add(className);
    else
        el.className += ' ' + className;
}

export function hasClass(el, className) {
    if (el.classList)
        return el.classList.contains(className);
    else
        return new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
}

export function removeClass(el, className) {
    if (el.classList)
        el.classList.remove(className);
    else
        el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
}

export function vertex2GraphElemArray(vertexArray) {
    let vertices = {}
    //console.log('pathArray2',pathArray)
    vertexArray.forEach(vtx => {
        vertices[`${vtx.a.id.oid}.${vtx.a.id.id}`] = {
            id: `${vtx.a.id.oid}.${vtx.a.id.id}`,
            label: vtx.a.label,
            props: vtx.a.props
        }
    })
    return {
        vertices: Object.values(vertices)
    }
}

export function path2GraphElemArray(pathArray) {
    let vertices = {}
    let edges = {}
    // console.log('pathArray', pathArray)

    pathArray.forEach(path => {
        path.p.vertices.forEach(vtx => {
            vertices[`${vtx.id.oid}.${vtx.id.id}`] = {
                id: `${vtx.id.oid}.${vtx.id.id}`,
                label: vtx.label,
                props: vtx.props
            }
        })

        path.p.edges.forEach(edge => {
            edges[`${edge.id.oid}.${edge.id.id}`] = {
                id: `${edge.id.oid}.${edge.id.id}`,
                label: edge.label,
                source: `${edge.start.oid}.${edge.start.id}`,
                target: `${edge.end.oid}.${edge.end.id}`,
                props: edge.props
            }
        })
    })

    return {
        vertices: Object.values(vertices),
        edges: Object.values(edges)
    }

}


export function findParent(elem, selector) {
    // console.log('elem, selector', elem, selector)
    return elem.matches(selector) ? elem : findParent(elem.parentElement, selector)
}

export function findChild(elem, selector) {
    return elem.querySelector(selector) ?  elem.querySelector(selector) : findChild(elem.parentElement, selector)
}

export const LABEL_MAP_FN = {
    kisa_spamsniper: ['dtime'],
    kisa_ddei: ['dtime'],
    kisa_waf: ['dtime'],
    url: ['domain','value'],
    email: ['source_email_address','source_ip','target_email_address'],
    file: ['value'],
    network_info: ['source_email_address','source_ip'],
    attack_pattern: [name],
    intrusion_set: ['name'],
    indicator: ['name'],
    malware: ['name']
};

export function convertGraphPath(graphData) {
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