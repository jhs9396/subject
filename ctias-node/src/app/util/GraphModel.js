/**
 * attribute layout
 * | x | y | z | bool attr 1~8  | byte attr 1 ~ 7 | float attr 1 ~3 |
 * | x | y | z |1 2 3 4 5 6 7 8 | 1 2 3 4 5 6 7   | 1  |   2   |  3 |  <-- index
 * | 4 | 4 | 4 |        1       |      7          |  4  |  4   |  4 |
 * @type {number}
 */
const MAX_NODE_CNT = 65535;
const BYTE_PER_POINT = 4;
const POINT_PER_NODE = 3; // x,y,z
const BOOL_ATTR_PER_NODE = 8; //
const BYTE_ATTR_PER_NODE = 7; //
const FLOAT_ATTR_PER_NODE = 3; //
const BYTE_PER_NODE = POINT_PER_NODE*BYTE_PER_POINT + BYTE_ATTR_PER_NODE + (FLOAT_ATTR_PER_NODE * 4) + BOOL_ATTR_PER_NODE/8
console.log('BYTE_PER_NODE', BYTE_PER_NODE)
const NODE_BUFFER_SIZE = MAX_NODE_CNT * BYTE_PER_NODE
console.log('NODE_BUFFER_SIZE', NODE_BUFFER_SIZE)

/**
 * attribute layout
 * | source index | target index | midpoint #1 | midpoint #2 | float attr 1 ~ 3 |
 * |              |              |  x | y | z  |  x | y | z  |  1  |   2   |  3 |  <-- index
 * |      2       |      2       |  4 | 4 | 4  |  4 | 4 | 4  |  4  |  4   |  4  |
 * @type {number}
 */

const MAX_EDGE_CNT = 65535;
const NODE_INDEX_PER_EDGE = 2; // source , target
const MIDDLE_POINT_PER_EDGE = 2;  // for curved edge
const FLOAT_ATTR_PER_EDGE = 3; //
const BYTE_PER_EDGE = NODE_INDEX_PER_EDGE*2 + MIDDLE_POINT_PER_EDGE*3*4  + FLOAT_ATTR_PER_EDGE*4
const EDGE_BUFFER_SIZE = BYTE_PER_EDGE * MAX_EDGE_CNT

console.log('BYTE_PER_EDGE', BYTE_PER_EDGE)
console.log('EDGE_BUFFER_SIZE', EDGE_BUFFER_SIZE)


class GraphModel {

    constructor() {
        let _vertex_buffer = new ArrayBuffer(NODE_BUFFER_SIZE)
        let _edge_buffer = new ArrayBuffer(EDGE_BUFFER_SIZE)

        this.nodes = []
        this.links = []
    }

    /**
     *
     * @param type  VERTEX | EDGE
     * @param label string
     * @param attrInfo [{name,type},...]
     */
    create(type, label, attrInfos) {

    }


}
