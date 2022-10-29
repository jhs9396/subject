package com.jhs.backendproto.dao;

import com.jhs.backendproto.utils.handler.CypherHandler;
import com.jhs.backendproto.api.inf.GraphApi;
import com.jhs.backendproto.api.service.GraphApiImpl;
import com.jhs.backendproto.utils.logger.JestLogger;
import lombok.Getter;
import lombok.Setter;
import org.elasticsearch.action.search.SearchRequest;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.client.RequestOptions;
import org.elasticsearch.client.RestHighLevelClient;
import org.elasticsearch.index.query.BoolQueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.search.builder.SearchSourceBuilder;
import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Repository;

import javax.annotation.Resource;
import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Elasticsearch Cypher 질의문 조회기 DAO
 *
 * @author jhs
 * @since 2021.05
 */
@Repository
@Component
public class ElasticsearchDao implements GenericDao {
    public enum Dev {
        ELASTICSEARCH("elasticsearch");

        @Getter String dev;
        Dev(String dev) {
            this.dev = dev;
        }
    }
    @JestLogger Logger logger;
    Map<String,Object> queryAll;
    RestHighLevelClient restHighLevelClient;
    Map<String,String> queryCache = new HashMap<>();
    GraphApi graphApi;
    @Setter
    CypherHandler cypherHandler;

    @Autowired
    public void setRestHighLevelClient(@Qualifier("elasticsearchClient") RestHighLevelClient restHighLevelClient) {
        this.restHighLevelClient = restHighLevelClient;
    }

    @Autowired
    public void setGraphApi(GraphApiImpl graphApi) {
        this.graphApi = graphApi;
    }

    @Autowired
    @Resource(name = "elasticsearchQuery")
    public void setQueryAll(Map<String,Object> queryAll) {
        this.queryAll = queryAll;
    }

    @Override
    public List<Map<String, Object>> executeGenericQuery(Map<String, Object> params) {
        List<Map<String,Object>> li;
        String query = getQueryByName(params.get("queryName").toString());

        Map<String,Object> elasticParams = cypherHandler.parseCypherQuery(query);
        /*
         * 노드와 엣지의 유무에 따라 실행방법을 나눠야함
         */
        if (((Map<String,Object>)elasticParams.get(CypherHandler.Properties.EDGES.getProp())).size() > 0) {
            li = this.executeSearchByEdge(elasticParams);
        } else {
            li = this.executeSearchByNode(elasticParams);
        }

        return li;
    }

    /**
     * Cypher query 실행기
     * @param params
     * @return
     */
    @Override
    public List<Map<String, Object>> executeCypherQuery(Map<String, Object> params) {
        List<Map<String,Object>> li;
        String query;

        if (params.get("display") == null) {
            query = getQueryByName(params.get("queryName").toString());
        } else {
            query = params.get("query").toString();
        }

        /*
         * step1: Cypher Query에서 필요한 정보 추출
         */
        Map<String,Object> elasticParams = cypherHandler.parseCypherQuery(query);

        /*
         * step2: Graph Meta정보를 조회하여 올바른 노드, 엣지인지 파악
         */
        elasticParams = graphApi.checkCypherParamsByMeta(Dev.ELASTICSEARCH.getDev(), elasticParams);

        /*
         * 노드와 엣지의 유무에 따라 실행방법을 나눠야함
         */
        if (((Map<String,Object>)elasticParams.get(CypherHandler.Properties.EDGES.getProp())).size() > 0) {
            li = this.executeSearchByEdge(elasticParams);
        } else {
            li = this.executeSearchByNode(elasticParams);
        }

        return li;
    }

    @Override
    public Object execute(Map<String, Object> params) {
        return null;
    }

    /**
     *
     * @param params
     * @return
     */
    @Override
    public Object bulkExecute(Map<String, Object> params) {
        return null;
    }

    /**
     *
     * @param name
     * @return
     */
    @Override
    public String getQueryByName(String name) {
        List<String> words = Arrays.asList(name.split("\\."));
        String query = queryCache.get(name);
        Map<String,Object> queryMap = null;

        if (query != null) {
            return query;
        }

        try {
            for (int i=0; i<words.size(); i++) {
                if (i==0) {
                    queryMap = queryAll.get(words.get(i)) instanceof Map ? (Map<String,Object>)queryAll.get(words.get(i)) : null;
                } else {
                    Object findData = queryMap.get(words.get(i));
                    if (findData instanceof Map) {
                        queryMap = (Map<String,Object>) findData;
                    } else {
                        query = findData.toString();
                    }
                }
            }
        } catch (Exception e) {

        }

        queryCache.put(name, query);
        return query;
    }

    /**
     *
     * @param conditions
     * @param query
     * @return
     */
    public BoolQueryBuilder addConditions(List<Map<String,String>> conditions, BoolQueryBuilder query) {
        for (Map<String,String> condition : conditions) {
            String column = condition.get(CypherHandler.Properties.COLUMN.getProp());
            String value = condition.get(CypherHandler.Properties.VALUE.getProp());
            String operator = condition.get(CypherHandler.Properties.OPERATOR.getProp());

            if (CypherHandler.Operator.EQ.getOperator().equals(operator)) {
                query.must(QueryBuilders.termQuery(column, value));
            } else if (CypherHandler.Operator.LT.getOperator().equals(operator)) {
                query.must(QueryBuilders.rangeQuery(column).lt(value));
            } else if (CypherHandler.Operator.LTE.getOperator().equals(operator)) {
                query.must(QueryBuilders.rangeQuery(column).lte(value));
            } else if (CypherHandler.Operator.GT.getOperator().equals(operator)) {
                query.must(QueryBuilders.rangeQuery(column).gt(value));
            } else if (CypherHandler.Operator.GTE.getOperator().equals(operator)) {
                query.must(QueryBuilders.rangeQuery(column).gte(value));
            } else if (CypherHandler.Operator.NEQ.getOperator().equals(operator) || CypherHandler.Operator.NEQ2.getOperator().equals(operator)) {
                query.mustNot(QueryBuilders.termQuery(column, value));
            }
        }

        return query;
    }

    /**
     * Node 단위의 패턴질의 조회 시 실행문
     *
     * @param elasticParams
     * @return
     */
    public List<Map<String,Object>> executeSearchByNode(Map<String,Object> elasticParams) {
        List<Map<String,Object>> searchRes = new ArrayList<>();

        for (Map.Entry<String,Object> node : ((Map<String,Object>)elasticParams.get(CypherHandler.Properties.NODES.getProp())).entrySet()) {
            SearchRequest searchRequest = new SearchRequest();
            SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder();
            BoolQueryBuilder query = new BoolQueryBuilder();

            Map<String,Object> props = ((Map<String,Object>)node.getValue());
            if (props.get(CypherHandler.Properties.LABEL.getProp()) != null) {
                searchRequest.indices((String[])props.get(CypherHandler.Properties.LABEL.getProp()));
            }

            if (props.get(CypherHandler.ReturnType.PART.getType()) != null) {
                searchSourceBuilder.fetchSource(((List<String>) props.get(CypherHandler.ReturnType.PART.getType())).toArray(String[]::new), null);
            }

            if (props.get(CypherHandler.Properties.CONDITION.getProp()) != null) {
                query = this.addConditions((List<Map<String,String>>)props.get(CypherHandler.Properties.CONDITION.getProp()), query);
            }

            searchSourceBuilder.query(query);
            searchRequest.source(searchSourceBuilder);
            List<Map<String,Object>> executeResult = this.executeSearch(searchRequest);

            /**
             * Column alias 존재 시 컬럼명 변경
             */
            if (executeResult.size() > 0 && props.get(CypherHandler.ReturnKeywords.AS.getKeyword()) != null) {
                Map<String,Object> aliasMapper = (Map<String,Object>)props.get(CypherHandler.ReturnKeywords.AS.getKeyword());
                executeResult = executeResult.stream().map(li -> {
                    Map<String,Object> changeMap = new HashMap<>(li);
                    for (Map.Entry<String,Object> resultSet : li.entrySet()) {
                        changeMap.put((String)aliasMapper.get(resultSet.getKey()), resultSet.getValue());
                        changeMap.remove(resultSet.getKey());
                    }
                    return changeMap;
                }).collect(Collectors.toList());
            }

            executeResult.stream().forEach(result -> searchRes.add(result));
        }

        return searchRes;
    }

    /**
     * Pattern MATCH 조회방식 메소드
     *
     * @param elasticParams
     * @return
     */
    public List<Map<String,Object>> executeSearchByEdge(Map<String,Object> elasticParams) {
        List<Map<String,Object>> searchRes = new ArrayList<>();

        /**
         * source 정보인 노드만 조회
         */
        for (Map.Entry<String,Object> node : ((Map<String,Object>)elasticParams.get(CypherHandler.Properties.NODES.getProp())).entrySet()
                .stream().filter(m -> {
                    Map<String,Object> props = (Map<String,Object>)m.getValue();
                    return props.get(CypherHandler.Properties.SOURCE.getProp()) != null; })
                .collect(Collectors.toList())) {
            Map<String,Object> nodeProps = ((Map<String,Object>)node.getValue());
            SearchRequest searchRequest = new SearchRequest();
            SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder();
            BoolQueryBuilder query = new BoolQueryBuilder();

            /**
             * label setting
             */
            searchRequest.indices((String[])nodeProps.get(CypherHandler.Properties.LABEL.getProp()));

            if (nodeProps.get(CypherHandler.Properties.CONDITION.getProp()) != null) {
                query = this.addConditions((List<Map<String,String>>)nodeProps.get(CypherHandler.Properties.CONDITION.getProp()), query);
            }

            searchSourceBuilder.query(query);
            searchRequest.source(searchSourceBuilder);

            /**
             * 대상 노드부터 조회
             */
            for (Map<String,Object> selectedNode : this.executeSearch(searchRequest)) {
                for (Map.Entry<String,Object> edge : ((Map<String,Object>)elasticParams.get(CypherHandler.Properties.EDGES.getProp())).entrySet()
                        .stream()
                        .filter(m -> {
                            Map<String,Object> edgeProps = (Map<String, Object>) m.getValue();
                            return edgeProps.get(CypherHandler.Properties.LABEL.getProp()) != null; })
                        .collect(Collectors.toList())) {
                    Map<String,Object> edgeProps = (Map<String,Object>)edge.getValue();

                    searchRes = searchTargetNode(searchRes, selectedNode, nodeProps, edgeProps);
                }
            }
        }

        return searchRes;
    }

    /**
     * 그래프 정보 해석결과 elasticsearch 조회기
     *
     * @param searchRequest Elasticsearch Search request 오브젝트 (조회할 노드 또는 엣지 정보 포함)
     * @return document 조회결과 리스트
     */
    private List<Map<String,Object>> executeSearch(SearchRequest searchRequest) {
        List<Map<String,Object>> searchRes = new ArrayList<>();

        try {
            SearchResponse searchResponse = restHighLevelClient.search(searchRequest, RequestOptions.DEFAULT);
            searchRes = Arrays.stream(searchResponse.getHits().getHits())
                    .map(hit -> {
                        Map<String,Object> result = hit.getSourceAsMap();
                        result.put("label", hit.getIndex());
                        return result;
                    })
                    .collect(Collectors.toList());
        } catch (IOException e) {
            logger.error("elasticsearch query error >> " + e.getMessage());
        } finally {
            return searchRes;
        }
    }

    /**
     * source node정보를 기반으로 target node 조회
     *
     * @param searchRes 그래프 조회 결과 오브젝트(source, target)
     * @param selectedNode source node 정보
     * @param nodeProps 소스노드 속성정보
     * @param edgeProps 엣지 속성정보
     * @return 타겟노드 조회 결과 추가 된 전체 결과
     */
    public List<Map<String,Object>> searchTargetNode(
            List<Map<String,Object>> searchRes, 
            Map<String,Object> selectedNode, 
            Map<String,Object> nodeProps, 
            Map<String,Object> edgeProps
    ) {
        
        for (String edgeLabel : (String[])edgeProps.get(CypherHandler.Properties.LABEL.getProp())) {
            if (selectedNode.get(edgeLabel) != null) {
                SearchRequest requestByEdge = new SearchRequest();
                SearchSourceBuilder builderByEdge = new SearchSourceBuilder();
                BoolQueryBuilder queryByEdge = new BoolQueryBuilder();

                requestByEdge.indices((String[])nodeProps.get(CypherHandler.Properties.LABEL.getProp()));

                /*
                 * edge는 node의 id만 관리해야 함
                 */
                if (selectedNode.get(edgeLabel) instanceof List) {
                    queryByEdge.must(QueryBuilders.idsQuery().addIds(((List<String>)selectedNode.get(edgeLabel)).toArray(String[]::new)));
                } else {
                    // 배열이 아닌 엣지는 패스
                    continue;
                }

                builderByEdge.query(queryByEdge);
                requestByEdge.source(builderByEdge);

                for (Map<String,Object> targetNode : this.executeSearch(requestByEdge)) {
                    /* source 노드는 이미 조회 했기 때문에 target에서 source가 튀어나오면 제외 */
                    if (searchRes.stream().filter(
                            result -> ((Map<String,Object>)((Map<String,Object>)result.get(CypherHandler.Properties.NODES.getProp()))
                                    .get(CypherHandler.Properties.SOURCE.getProp())).get("id").toString().equals(targetNode.get("id").toString()))
                            .collect(Collectors.toList()).size() > 0) { continue; }
                    Map<String,Object> result = new HashMap<>();

                    /* nodes 정보 (source, target) */
                    result.put(CypherHandler.Properties.NODES.getProp(), new HashMap<>(){{
                        put(CypherHandler.Properties.SOURCE.getProp(), selectedNode);
                        put(CypherHandler.Properties.TARGET.getProp(), targetNode);
                    }});

                    /* edge label 정보 */
                    result.put(CypherHandler.Properties.EDGE.getProp(), new HashMap<>(){{
                        put(CypherHandler.Properties.LABEL.getProp(), edgeLabel);
                    }});

                    searchRes.add(result);

                    if (edgeProps.get(CypherHandler.Properties.ASTERISK.getProp()) != null) {
                        /* asterisk 재귀 호출 */
                        searchRes = searchTargetNode(searchRes, targetNode, nodeProps, edgeProps);
                    }
                }
            }
        }

        return searchRes;
    }

}
