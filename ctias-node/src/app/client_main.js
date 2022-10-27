require('./common.styl')

import KeywordSearchWidget from "./component/KeywordSearch";
import MetaGraphWidget from "./component/MetaGraph";
import PatternSearchWidget from "./component/PatternSearchWidget";
import PocApiClient from "./util/PocApiClient";

// let apiClient = new PocApiClient('http://localhost:9000/')
let apiClient = new PocApiClient('/')

window.addEventListener('load',async ()=>{
    // init component -------------------------------------------
    let keywordSearch = new KeywordSearchWidget('#keywordInput');
    let metaGraph = new MetaGraphWidget('#container');
    let patternSearch = new PatternSearchWidget('#patternInput')

    // init event handler -------------------------------------------
    keywordSearch.on('search', async (keyword)=>{
        let labels = await apiClient.labelByKeyword(keyword)
        metaGraph.setKeywordFindLabels(labels, keyword)
    });

    keywordSearch.on('keywordChanged', async (keyword)=>{
        let valueArr = await apiClient.findKeywordCandidate(keyword)
        console.log('result keyword ', valueArr)
        keywordSearch.setCandidate(valueArr)
    });

    metaGraph.on('patternChange', (pattern)=>{
        // console.log('pattern', pattern)
        patternSearch.setPattern(pattern)
    });

    patternSearch.on('search', (pattern)=>{
        console.log('pattern=================', pattern)
        apiClient.searchPattern(pattern)
    });

    // resize event -------------------------------------------
    window.addEventListener('resize',()=>{
        metaGraph.handleResize()
    })

    // init data -------------------------------------------
    // deprecated metagraph
    // let metaData = await apiClient.getMetaGraph()
    // console.log('metaData', metaData)
    // metaGraph.setMetaData(metaData)
});
