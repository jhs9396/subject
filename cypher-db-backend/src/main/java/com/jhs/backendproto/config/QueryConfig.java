package com.jhs.backendproto.config;

import com.jhs.backendproto.vo.AgensGraphQueryVo;
import com.jhs.backendproto.vo.ElasticSearchQueryVo;
import com.jhs.backendproto.vo.PostgresQueryVo;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Map;

/**
 * 이기종 데이터 쿼리 관리 Bean 생성 Configuration
 */
@Configuration
@EnableConfigurationProperties
public class QueryConfig {

    @Bean(name="postgresQuery")
    @ConfigurationProperties("postgres")
    public Map<String,Object> postgresQuery() { return new PostgresQueryVo().toMap(); }

    @Bean(name="agensQuery")
    @ConfigurationProperties("agensgraph")
    public Map<String,Object> agensgraphQuery() { return new AgensGraphQueryVo().toMap(); }

    @Bean(name="elasticsearchQuery")
    @ConfigurationProperties("elasticsearch")
    public Map<String,Object> elasticsearchQuery() { return new ElasticSearchQueryVo().toMap(); }

}
