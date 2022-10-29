package com.jhs.backendproto.runner;

import com.jhs.backendproto.api.inf.PythonApi;
import com.jhs.backendproto.api.service.PythonApiImpl;
import com.jhs.backendproto.elasticsearch.component.inf.ElasticSearchApi;
import com.jhs.backendproto.vo.Stack;
import org.elasticsearch.action.get.GetRequest;
import org.elasticsearch.client.RequestOptions;
import org.elasticsearch.client.RestHighLevelClient;
import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Component
public class CommandRunner implements CommandLineRunner {

//    JdbcTemplate agensJdbcTemplate;
    NamedParameterJdbcTemplate postgresJdbcTemplate;
    RestHighLevelClient restHighLevelClient;
    ElasticSearchApi searchApi;
    PythonApi pythonApi;

    @Autowired
    public CommandRunner (
//            @Qualifier("agensJdbcTemplate") JdbcTemplate agensJdbcTemplate,
            @Qualifier("postgresJdbcTemplate") NamedParameterJdbcTemplate postgresJdbcTemplate,
            @Qualifier("elasticsearchClient") RestHighLevelClient restHighLevelClient,
            ElasticSearchApi searchApi,
            PythonApiImpl pythonApi
    ) {
//        this.agensJdbcTemplate = agensJdbcTemplate;
        this.postgresJdbcTemplate = postgresJdbcTemplate;
        this.restHighLevelClient = restHighLevelClient;
        this.searchApi = searchApi;
        this.pythonApi = pythonApi;
    }

    /**
     * Elasticsearch 인덱스와 ID를 사용하여 Document의 Source 조회
     *
     * @param idx Elasticsearch 인덱스 문자열
     * @param id  Elasticsearch ID 문자열
     * @return Document.source 결과
     */
    public JSONObject getSource(String idx, String id) {
        JSONObject source = new JSONObject();

        try {
            GetRequest getRequest = new GetRequest(idx);
            getRequest.id(id);
            source = new JSONObject(restHighLevelClient.get(getRequest, RequestOptions.DEFAULT).getSource());
        } catch (IOException e) {
            source.put("Error", "IO Error exception");
        } catch (Exception e) {
            throw new Exception(String.format("idx, id Parameter 확인 필요 >> %s, %s", idx, id));
        } finally {
            return source;
        }
    }

    @Override
    public void run(String... args) {
        Map<String, String> map = new HashMap<>();
//        System.out.println("AgensGraph >> " + agensJdbcTemplate.queryForList("MATCH (a:ioc) WHERE a.value = '192.111.145.197' RETURN a"));
        System.out.println("PostgreSQL >> " + postgresJdbcTemplate.queryForList("SELECT now()", map));
        String indexName = "customer2";
        String id = "2";

        System.out.println(">>> " + searchApi.getSource(indexName, id));
        Stack stack = new Stack();
        stack.push("initial Item");

//        GatewayServer gatewayServer = new GatewayServer(stack);
//        gatewayServer.start();
    }
}
