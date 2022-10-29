package com.jhs.backendproto.dao;

import com.jhs.backendproto.utils.handler.CypherHandler;
import com.jhs.backendproto.utils.transform.PgTransform;
import com.jhs.backendproto.api.inf.GraphApi;
import com.jhs.backendproto.api.service.GraphApiImpl;
import com.jhs.backendproto.utils.logger.JestLogger;
import lombok.Setter;
import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Repository;

import javax.annotation.Resource;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Repository
@Component
public class PostgresDao implements GenericDao {
    @JestLogger Logger logger;
    Map<String,Object> queryAll;
    Map<String,String> queryCache = new HashMap<>();
    PgTransform transform = new PgTransform();
    NamedParameterJdbcTemplate postgresJdbcTemplate;
    @Setter
    CypherHandler cypherHandler;
    GraphApi graphApi;

    @Autowired
    public void setPostgresJdbcTemplate(@Qualifier("postgresJdbcTemplate") NamedParameterJdbcTemplate postgresJdbcTemplate) {
        this.postgresJdbcTemplate = postgresJdbcTemplate;
    }

    @Autowired
    @Resource(name = "postgresQuery")
    public void setQueryAll(Map<String,Object> queryAll) {
        this.queryAll = queryAll;
    }

    @Autowired
    public void setGraphApi(GraphApiImpl graphApi) {
        this.graphApi = graphApi;
    }

    @Override
    public List<Map<String, Object>> executeGenericQuery(Map<String, Object> params) {
        String query = getQueryByName(params.get("queryName").toString());
        return postgresJdbcTemplate.queryForList(query, params);
    }

    @Override
    public List<Map<String, Object>> executeCypherQuery(Map<String, Object> params) {
        return null;
    }

    @Override
    public Object execute(Map<String, Object> params) {
        String query = getQueryByName(params.get("queryName").toString());
        return postgresJdbcTemplate.execute(query, params, preparedStatement -> preparedStatement.executeUpdate());
    }

    @Override
    public Object bulkExecute(Map<String, Object> params) {
        String query = getQueryByName(params.get("queryName").toString());
        List<Map<String,Object>> datum = transform.transformPgObject((Map<String, Object>[]) ((List)params.get("datum")).toArray(Map[]::new));
        return postgresJdbcTemplate.batchUpdate(query, datum.toArray(Map[]::new));
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
            logger.error("Yaml file read error >> " + e.getMessage());
        }

        queryCache.put(name, query);
        return query;
    }
}
