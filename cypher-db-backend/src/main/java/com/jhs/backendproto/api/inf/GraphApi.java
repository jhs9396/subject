package com.jhs.backendproto.api.inf;

import java.util.List;
import java.util.Map;

/**
 * 그래프 서비스 API 인터페이스
 *
 * @author jhs
 * @since 2021.06
 */
public interface GraphApi {
    List<Map<String,Object>> searchGraphMeta(Map<String,Object> params);
    List<Map<String,Object>> searchCntNodes(Map<String,Object> params);
    List<Map<String,Object>> searchCntEdges(Map<String,Object> params);
    Map<String,Object> checkCypherParamsByMeta(String devType, Map<String,Object> params);
}
