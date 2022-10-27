console.log('xxxx')

let Graph = graph_core.Graph

console.log(graph_core, Graph)

// const SpecReporter = require('jasmine-spec-reporter').SpecReporter;
//
// jasmine.getEnv().clearReporters();               // remove default reporter logs
// jasmine.getEnv().addReporter(new SpecReporter({  // add jasmine-spec-reporter
//     spec: {
//         displayPending: true
//     }
// }));


describe("Graph Model package ", function() {

    it("is exists", function() {
        expect(Graph).not.toBe(null)
    });

    let g = new Graph();

    // for(let i=0; i<10000 ; i++) {
    //     g.addNode(''+Math.random(), { label: 'email', attr1: Math.random(), attr2: Math.random()*100 })
    // }
    //
    // for(let i=0; i<10000 ; i++) {
    //     g.addNode(''+Math.random(), { label: 'ip', attr3: Math.random(), attr4: Math.random()*100 })
    // }
    //
    // for(let i=0; i<10000 ; i++) {
    //     g.addNode(''+Math.random(), { label: 'domain', attr5: Math.random(), attr6: Math.random()*100 })
    // }


    xit("should 30000 node exists", ()=>{
        expect(g.getNodesCount()).toEqual(30000)
    })


    xit("should 30000 node exists", ()=>{
        // duplicate addNode test
        // must ignore duplicate vertex
        g.forEachNode(([k,v])=>{
            g.addNode(k,v)
        })

        expect(g.getNodesCount()).toEqual(30000)
    })

    it('remove node', ()=>{
        let g2 = new Graph();

        g2.addNode("n1", {} )
        g2.addNode("n2", {} )
        g2.addNode("n3", {} )
        g2.addLink("n1", "n2", {}, "l1")
        g2.addLink("n1", "n3", {}, "l2")

        expect(g2.getNodesCount()).toEqual(3)
        expect(g2.getLinksCount()).toEqual(2)

        g2.removeNode("n3")

        expect(g2.getNodesCount()).toEqual(2)
        expect(g2.getLinksCount()).toEqual(1)

        let rv = g2.getRemovedVertex()
        console.log(rv)

        expect(rv.length).toEqual(1)




    })


});