package com.jhs.backendproto.utils.logger;

import org.slf4j.LoggerFactory;
import org.springframework.beans.BeansException;
import org.springframework.beans.factory.config.BeanPostProcessor;
import org.springframework.stereotype.Service;
import org.springframework.util.ReflectionUtils;

/**
 * logger injection을 위한 객체 핸들링 서비스
 * 객체가 생성되는 시점에 클래스 필드 변수 어노테이션이 선언된 logger를 찾아 logger 객체 주입 
 * 
 * @author jhs
 * @since 2021.05
 */
@Service
public class JestLoggerInjection implements BeanPostProcessor {

    /**
     * 객체 생성 전 수행 메소드 -> BeanPostProcessor 인터페이스 메소드
     * 
     * @param bean 생성 객체
     * @param name 객체 클래스명 이름
     * @return 변경된 내용이 적용된 객체
     * @throws BeansException
     */
    public Object postProcessBeforeInitialization(Object bean, String name) throws BeansException {
        return bean;
    }

    /**
     * 객체 생성 후 수행 메소드 -> BeanPostProcessor 인터페이스 메소드
     * 
     * @param bean 생성 객체
     * @param name 객체 클래스명 이름
     * @return 변경된 내용이 적용된 객체
     * @throws BeansException
     */
    public Object postProcessAfterInitialization(Object bean, String name) throws BeansException {
        ReflectionUtils.doWithFields(bean.getClass(), field -> {
            /**
             * 클래스 필드 중 JestLogger 어노테이션이 선언된 필드를 찾아 logger 객체 세팅
             */
            if (field.getAnnotation(JestLogger.class) != null) {
                field.setAccessible(true);
                field.set(bean, LoggerFactory.getLogger(bean.getClass()));
            }
        });

        return bean;
    }
}
