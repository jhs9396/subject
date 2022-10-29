package com.jhs.backendproto.vo;

import lombok.extern.slf4j.Slf4j;

import java.lang.reflect.Field;
import java.util.HashMap;
import java.util.Map;

/**
 * Value Object 기본 메소드 제공 클래스
 */
@Slf4j
public class CommonVo {

    /**
     * 상속받는 하위 클래스에 제공되는 메소드
     * 필드 값을 Map에 정의
     *
     * @return 하위 클래스의 필드별 Map 생성
     */
    public Map<String,Object> toMap() {
        Map<String,Object> resMap = new HashMap<>();

        for (Field field : this.getClass().getDeclaredFields()) {
            try {
                resMap.put(field.getName(), field.get(this));
            } catch (IllegalAccessException e) {
                log.error("transform to map error", e.getMessage());
            }
        }

        return resMap;
    }

}
