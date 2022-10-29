package com.jhs.backendproto.elasticsearch.component.inf;

import java.util.Map;

public interface ElasticSearchApi {
    Map<?,?> getSource(String idx, String id);
    Map<?,?> getSearch(String idx, Map<String,Object> options);
    Map<?,?> getIndices();
    Map<?,?> getPropertyKeys(String idx);
    Map<?,?> getMetaByIndices(String idx);
    boolean createDocument(String idx, String id, Map<String,Object> params);
    boolean deleteDocument(String idx, String id);
}
