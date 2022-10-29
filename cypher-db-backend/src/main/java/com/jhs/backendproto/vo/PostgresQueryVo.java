package com.jhs.backendproto.vo;

import lombok.Setter;

import java.util.Map;

/**
 * PostgreSQL 쿼리내용 저장 오브젝트
 */
public class PostgresQueryVo extends CommonVo {
    @Setter public Map<String,Object> select;
    @Setter public Map<String,Object> meta;
}
