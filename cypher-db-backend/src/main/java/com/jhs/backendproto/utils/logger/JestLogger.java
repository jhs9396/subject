package com.jhs.backendproto.utils.logger;

import java.lang.annotation.*;

/**
 * JestLogger 어노테이션
 * TARGET -> 클래스 필드 범위
 * Retention -> 런타임 범위
 */
@Target(ElementType.FIELD)
@Documented
@Retention(RetentionPolicy.RUNTIME)
public @interface JestLogger {}