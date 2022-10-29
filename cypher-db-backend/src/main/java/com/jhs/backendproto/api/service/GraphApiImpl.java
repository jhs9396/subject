package com.jhs.backendproto.api.service;

import com.jhs.backendproto.dao.GenericDao;
import com.jhs.backendproto.dao.PostgresDao;
import com.jhs.backendproto.utils.handler.CypherHandler;
import com.jhs.backendproto.api.inf.GraphApi;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

/**
 * 그래프 서비스 API 구현영역
 *
 * @author jhs
 * @since 2021.05
 */
@Service
@SuppressWarnings("unchecked")
public class GraphApiImpl implements GraphApi {

    /*
     * 그래프 기능 사용을 위한 이기종 데이터 DAO
     */
    GenericDao dao;

    /**
     * 메타그래프를 AgensGraph에 저장할 지 아니면 RDB, NoSQL에 저장할지 고민
     * 메타는 하나에만 맞춰야되니
     *
     * @param postgresDao PostgreSQL에 그래프 메타정보를 저장하여 PostgreSQL DAO 호출(스위칭 할 수 있도록 변경 필요)
     */
    @Autowired
    public void setPostgresDao(PostgresDao postgresDao) {
        dao = postgresDao;
    }

    /**
     *그래프 메타 정보 조회기
     * (노드, 엣지, 이기종 타입 저장되어 있는 테이블)
     *
     * @param params 테이블 조회 조건
     * @return 메타 정보 조회 결과 리스트
     */
    @Override
    public List<Map<String, Object>> searchGraphMeta(Map<String, Object> params) {
        return null;
    }

    /**
     * 노드 카운트 조회기 (isNode)
     *
     * @param params 이기종 데이터 장치 타입
     * @return 기종에 존재하는 노드 카운팅 후 리스트 반환
     */
    @Override
    public List<Map<String, Object>> searchCntNodes(Map<String, Object> params) {
        params.put("queryName", "meta.countNodes");
        return dao.executeGenericQuery(params);
    }

    /**
     * 엣지 카운트 조회기 (isEdge)
     * 
     * @param params 이기종 데이터 장치 타입
     * @return 기종에 존재하는 엣지 카운팅 후 리스트 반환
     */
    @Override
    public List<Map<String, Object>> searchCntEdges(Map<String, Object> params) {
        params.put("queryName", "meta.countEdges");
        return dao.executeGenericQuery(params);
    }

    /**
     * Graph Meta 정보가 저장되어 있다면, 이를 참조하여 Cypher 문을 질의하도록 체킹의무 필요
     * 하지만, 메타를 등록하지 않고 단순 Cypher 핸들러로써의 역할을 수행하기 위해 이 모듈은 GraphApi 인터페이스에서 관리해야 함
     *
     * @param devType 이기종 데이터 저장소 장비 이름
     * @param params Cypher query문을 해석한 뒤 얻은 그래프 데이터
     * @return node, edge 메타정보에 존재하는지 유무 파악
     */
    @Override
    public Map<String, Object> checkCypherParamsByMeta(String devType, Map<String, Object> params) {
        if (params.get("nodes") == null) {
            return new HashMap<>(){{
                put("error", new Exception("graph data(nodes) is null"));
            }};
        }

        Map<String,Object> searchCntParams = new HashMap<>();
        searchCntParams.put("type", devType);
        List<Map<String,Object>> searchNodes = this.searchCntNodes(searchCntParams);
        List<Map<String,Object>> searchEdges = this.searchCntEdges(searchCntParams);

        /*
         * checking nodes, edges based on meta data
         */
        params.put(CypherHandler.Properties.NODES.getProp(), this.addLabelByMeta(((Map<String,Object>)params.get("nodes")).entrySet(), searchNodes));
        params.put(CypherHandler.Properties.EDGES.getProp(), this.addLabelByMeta(((Map<String,Object>)params.get("edges")).entrySet(), searchEdges));

        return params;
    }


    /**
     * 레이블이 없이 조회된 Cypher 쿼리를 위한 메타 정보 (노드, 엣지 레이블) 추가 메소드
     *
     * @param graphObjects 이기종데이터 노드 혹은 엣지 정보
     * @param queryRes 그래프 메타정보
     * @return 레이블이 없는 경우, 메타 정보가 추가된 그래프 정보(노드, 엣지)
     */
    public Map<String,Object> addLabelByMeta(Set<Map.Entry<String,Object>> graphObjects, List<Map<String,Object>> queryRes) {
        Map<String,Object> hSystemParams = new HashMap<>();
        for (Map.Entry<String,Object> graphObject : graphObjects) {
            Map<String,Object> properties = (Map<String,Object>)graphObject.getValue();

            /*
             * label이 있으면 count된 노드와 일치하는지 확인한다.
             */
            Object label = properties.get(CypherHandler.Properties.LABEL.getProp());
            if (label == null) {
                for (Map<String,Object> countNode : queryRes) {
                    properties.computeIfAbsent(CypherHandler.Properties.LABEL.getProp(), k -> new ArrayList<>());
                    ((List<Object>)properties.get(CypherHandler.Properties.LABEL.getProp())).add(countNode.get(CypherHandler.Properties.LABEL.getProp()));
                }
                properties.put(CypherHandler.Properties.LABEL.getProp(), ((List<String>)properties.get(CypherHandler.Properties.LABEL.getProp())).toArray(String[]::new));
            }
            hSystemParams.put(graphObject.getKey(), graphObject.getValue());
        }

        return hSystemParams;
    }

}
