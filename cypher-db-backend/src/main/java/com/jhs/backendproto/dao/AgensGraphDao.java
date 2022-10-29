package com.jhs.backendproto.dao;

import com.jhs.backendproto.api.inf.GraphApi;
import com.jhs.backendproto.api.service.GraphApiImpl;
import com.jhs.backendproto.utils.handler.CypherHandler;
import com.jhs.backendproto.utils.logger.JestLogger;
import lombok.Setter;
import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Repository;

import javax.annotation.Resource;
import java.util.*;

@Repository
@Component
public class AgensGraphDao implements GenericDao {

    @JestLogger Logger logger;
    Map<String,Object> queryAll;
    Map<String,String> queryCache = new HashMap<>();
    JdbcTemplate jdbcTemplate;
    GraphApi graphApi;
    @Setter CypherHandler cypherHandler;

    @Autowired
    public void setJdbcTemplate(@Qualifier("agensJdbcTemplate") JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Autowired
    @Resource(name = "agensQuery")
    public void setQueryAll(Map<String,Object> queryAll) {
        this.queryAll = queryAll;
    }

    @Autowired
    public void setGraphApi(GraphApiImpl graphApi) {
        this.graphApi = graphApi;
    }

    @Override
    public List<Map<String, Object>> executeGenericQuery(Map<String, Object> params) {
        List<Map<String,Object>> li = new ArrayList<>();
        String query = getQueryByName(params.get("queryName").toString());
        li.add(jdbcTemplate.queryForList(query).get(0));
        System.out.println(params);
        System.out.println(li);

        return li;
    }

    @Override
    public List<Map<String, Object>> executeCypherQuery(Map<String, Object> params) {
        return null;
    }

    @Override
    public Object execute(Map<String, Object> params) {
        return null;
    }

    @Override
    public Object bulkExecute(Map<String, Object> params) {
        return null;
    }

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
            logger.error("error >> " + e.getMessage());
        }

        queryCache.put(name, query);
        return query;
    }

}