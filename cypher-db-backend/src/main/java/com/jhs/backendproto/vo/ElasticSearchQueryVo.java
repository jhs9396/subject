package com.jhs.backendproto.vo;

import lombok.Setter;

import java.util.Map;

/**
 * ElasticsSearch 쿼리내용 저장 오브젝트
 */
public class ElasticSearchQueryVo extends CommonVo {
    @Setter public Map<String,Object> cypher;
}
