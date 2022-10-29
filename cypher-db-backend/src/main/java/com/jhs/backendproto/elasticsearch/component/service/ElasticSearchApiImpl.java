package com.jhs.backendproto.elasticsearch.component.service;

import com.jhs.backendproto.utils.logger.JestLogger;
import com.jhs.backendproto.elasticsearch.component.inf.ElasticSearchApi;
import org.elasticsearch.action.DocWriteResponse;
import org.elasticsearch.action.delete.DeleteRequest;
import org.elasticsearch.action.delete.DeleteResponse;
import org.elasticsearch.action.get.GetRequest;
import org.elasticsearch.action.index.IndexRequest;
import org.elasticsearch.action.index.IndexResponse;
import org.elasticsearch.action.search.SearchRequest;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.client.RequestOptions;
import org.elasticsearch.client.RestHighLevelClient;
import org.elasticsearch.client.indices.GetIndexRequest;
import org.elasticsearch.client.indices.GetIndexResponse;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.search.SearchHit;
import org.elasticsearch.search.builder.SearchSourceBuilder;
import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ElasticSearchApiImpl implements ElasticSearchApi {
    @JestLogger
    Logger logger;
    RestHighLevelClient restHighLevelClient;

    @Autowired
    public ElasticSearchApiImpl(@Qualifier("elasticsearchClient") RestHighLevelClient restHighLevelClient) {
        this.restHighLevelClient = restHighLevelClient;
    }

    @Override
    public Map<?, ?> getSource(String idx, String id) {
        Map<String,Object> source = new HashMap<>();

        GetRequest getRequest = new GetRequest(idx)
                .id(id);

        try {
            source = restHighLevelClient.get(getRequest, RequestOptions.DEFAULT).getSource();
        } catch (IOException e) {
            source.put("error", "IO Exception. You must to be confirm the Elasticsearch server.");
        } finally {
            return source;
        }
    }

    @Override
    public Map<?, ?> getSearch(String idx, Map<String,Object> options) {
        SearchRequest searchRequest = new SearchRequest(idx);
        SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder();
        searchSourceBuilder.query(QueryBuilders.idsQuery().addIds("3"));

        searchRequest.source(searchSourceBuilder);
        try {
            SearchResponse searchResponse = restHighLevelClient.search(searchRequest, RequestOptions.DEFAULT);
            System.out.println();

        } catch (IOException e) {
            logger.error("error >> " + e.getMessage());
        }

        return null;
    }

    @Override
    public Map<?, ?> getIndices() {
        Map<String,Object> resMap = new HashMap<>();
        GetIndexRequest getIndexRequest = new GetIndexRequest("*");

        try {
            GetIndexResponse getIndexResponse = restHighLevelClient.indices().get(getIndexRequest, RequestOptions.DEFAULT);
            resMap.put("indices", Arrays.asList(getIndexResponse.getIndices()).stream().collect(Collectors.toList()));
        } catch (IOException e) {
            logger.error("error >> " + e.getMessage());
        }

        return resMap;
    }

    @Override
    public Map<String,Object> getPropertyKeys(String idx) {
        Set<String> res = new HashSet<>();
        SearchRequest searchRequest = new SearchRequest(idx);
        SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder();
        searchSourceBuilder.query(QueryBuilders.matchAllQuery());

        searchRequest.source(searchSourceBuilder);

        try {
            SearchResponse searchResponse = restHighLevelClient.search(searchRequest, RequestOptions.DEFAULT);
            for (SearchHit hit : searchResponse.getHits()) {
                res.addAll(hit.getSourceAsMap().keySet());
            }
        } catch (IOException e) {
            logger.error("error >> " + e.getMessage());
        }
        Map<String,Object> resMap = new HashMap<>() {{
            put("columns", res.stream().collect(Collectors.toList()));
        }};

        return resMap;
    }

    @Override
    public Map<?, ?> getMetaByIndices(String idx) {
        Map<String,Object> resMap = new HashMap<>();
        /*
         * first -> get indices list
         */
        Map<String,Object> indices = (Map<String, Object>) getIndices();

        /*
         * second -> get property list by index
         */
        if (((ArrayList)indices.get("indices")).contains(idx)) {
            resMap.put(idx, getPropertyKeys(idx));
        }

        return resMap;
    }

    @Override
    public boolean createDocument(String idx, String id, Map<String, Object> params) {
        IndexRequest indexRequest = new IndexRequest(idx)
                .id(id)
                .source(params);
        boolean isSuccess = false;

        try {
            IndexResponse indexResponse = restHighLevelClient.index(indexRequest, RequestOptions.DEFAULT);
            isSuccess = indexResponse.getResult() == DocWriteResponse.Result.CREATED || indexResponse.getResult() == DocWriteResponse.Result.UPDATED || isSuccess;
        } catch (IOException e) {
            logger.error("error >> " + e.getMessage());
        }

        return isSuccess;
    }

    @Override
    public boolean deleteDocument(String idx, String id) {
        DeleteRequest deleteRequest = new DeleteRequest(idx)
                .id(id);
        boolean isSuccess = false;

        try {
            DeleteResponse deleteResponse = restHighLevelClient.delete(deleteRequest, RequestOptions.DEFAULT);
            isSuccess = deleteResponse.getResult() != DocWriteResponse.Result.NOT_FOUND || isSuccess;
        } catch (IOException e) {
            logger.error("error >> " + e.getMessage());
        }

        return isSuccess;
    }


}
