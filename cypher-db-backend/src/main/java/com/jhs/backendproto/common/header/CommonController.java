package com.jhs.backendproto.common.header;

import com.jhs.backendproto.dao.GenericDao;
import com.jhs.backendproto.utils.logger.JestLogger;
import com.jhs.backendproto.utils.logger.JestLoggerInjection;
import lombok.Setter;
import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.config.AutowireCapableBeanFactory;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.ApplicationContext;
import org.springframework.http.HttpHeaders;

import java.lang.reflect.AccessibleObject;
import java.lang.reflect.Field;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * 컨트롤러 기본 클래스 필드 및 메소드
 *
 * @author jhs
 * @since 2021.05
 */
@EnableConfigurationProperties
@ConfigurationProperties(prefix="spring.dao")
public class CommonController {

    /*
     * logger
     */
    @JestLogger
    public Logger logger;

    /*
     * dao package default path
     */
    @Setter String defaultPath;

    /*
     * dao에서 Cypher 핸들러를 사용하는지 여부 판별하기 위한 오브젝트 
     */
    @Setter Map<String,Object> enabledCypher;

    /*
     * bean object handling
     */
    private final ApplicationContext applicationContext;

    /*
     * enabling newinstance autowired
     */
    private final AutowireCapableBeanFactory autowireCapableBeanFactory;

    /*
     * dao 객체 newinstance 후 logger 객체 주입을 위한 서비스
     */
    private final JestLoggerInjection jestLoggerInjection;

    /*
     * 생성된 dao 객체 보관장소
     */
    private final Map<String,Object> dbStore = new HashMap<>();

    /**
     * 클래스 필드 autowired 생성자
     *
     * @param applicationContext bean object handling
     * @param autowireCapableBeanFactory newinstance autowired 활성화
     * @param jestLoggerInjection dao 객체 logger 주입
     */
    @Autowired
    public CommonController(
            ApplicationContext applicationContext,
            AutowireCapableBeanFactory autowireCapableBeanFactory,
            JestLoggerInjection jestLoggerInjection
    ) {
        this.applicationContext = applicationContext;
        this.autowireCapableBeanFactory = autowireCapableBeanFactory;
        this.jestLoggerInjection = jestLoggerInjection;
    }

    /**
     * API Header 셋팅 메소드
     * @return 기본값 http 헤더
     */
    public final HttpHeaders productHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.add("product.name",    "JHS");
        headers.add("product.version", "1.0");
        return headers;
    }

    /**
     * DAO 이름을 가지고 용도에 맞는 DAO 호출 메소드
     * name을 활용하여 선언된 JDBC, Query Bean 객체를 불러와 newinstance에 세팅
     *
     * @param name DAO 클래스 이름
     * @return 호출된 이름에 맞는 DAO 반환
     */
    protected final GenericDao getDaoByName(String name) {
        /*
         * 데이터베이스 질의이력이 있다면 기존 DAO 사용
         */
        if (dbStore.get(name) != null) {
            return (GenericDao) dbStore.get(name);
        }

        GenericDao dao = null;
        String indexer = Arrays.asList(name.split("")).stream()
                .filter((s)->  Character.isUpperCase(s.charAt(0)))
                .collect(Collectors.toList()).get(1);

        String finder = name.substring(0, name.indexOf(indexer)).toLowerCase();

        try {
            Class<?> daoClass = Class.forName(defaultPath + "." + name);

            Object instance = daoClass.getDeclaredConstructors()[0].newInstance();
            autowireCapableBeanFactory.autowireBean(instance);
            instance = this.doBeanInjection(instance, finder);

            dao = (GenericDao) instance;
            dbStore.put(name, dao);
        } catch (Exception e) {
            logger.error("error >> " + e.getMessage());
        }

        return dao;
    }

    /**
     * 클래스 field setter
     * DAO에서 활용되는 쿼리와 환경설정에 따라 cypher문을 injection 할 수 있는 메소드
     * queryAll : query bean 객체 셋
     * cypherHandler : 환경설정 옵션에 따라 cypherHandler 컴포넌트 셋
     *
     * @param instance dao 인스턴스 (Database 종류)
     * @param finder dao를 찾기 위한 finder 문자열
     * @return 조건에 따른 field에 셋이 끝난 인스턴스
     * @throws Exception
     */
    private Object doBeanInjection(Object instance, String finder) throws Exception {
        Field[] fields = instance.getClass().getDeclaredFields();
        AccessibleObject.setAccessible(fields, true);

        for (Field field : fields) {
            switch (field.getName()) {
                case "cypherHandler":
                    if ((Boolean) enabledCypher.get(finder)) field.set(instance, applicationContext.getBean("cypherHandler"));
                    break;
                default:
                    break;
            }
        }

        /*
         * 객체 생성 후 Bean field logger injection
         */
        jestLoggerInjection.postProcessAfterInitialization(instance, instance.getClass().getName());

        return instance;
    }

}
