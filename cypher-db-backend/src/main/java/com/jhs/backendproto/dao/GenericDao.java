package com.jhs.backendproto.dao;

import java.util.List;
import java.util.Map;

public interface GenericDao {
    List<Map<String, Object>> executeGenericQuery(Map<String, Object> params);
    List<Map<String, Object>> executeCypherQuery(Map<String, Object> params);
    Object execute(Map<String, Object> params);
    Object bulkExecute(Map<String,Object> params);
    String getQueryByName(String name);
}
