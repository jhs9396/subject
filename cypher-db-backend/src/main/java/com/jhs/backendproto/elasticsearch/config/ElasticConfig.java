package com.jhs.backendproto.elasticsearch.config;

import lombok.Setter;
import org.apache.http.HttpHost;
import org.elasticsearch.client.RestClient;
import org.elasticsearch.client.RestHighLevelClient;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.elasticsearch.repository.config.EnableElasticsearchRepositories;

import java.util.List;

/**
 *
 */
@EnableElasticsearchRepositories
@Configuration
@ConfigurationProperties("spring.datasource.elasticsearch")
public class ElasticConfig {
    /**
     * hosts 정보 (복수 개)
     */
    @Setter List<String> hosts;

    /**
     * High Level REST Client Bean 생성
     *
     * @return 호스트, 포트 내용이 바인딩 된 RestHighLevelClient
     */
    @Bean(name="elasticsearchClient")
    public RestHighLevelClient elasticsearchClient() {
        return new RestHighLevelClient(
                RestClient.builder(hosts.stream().map(HttpHost::create).toArray(HttpHost[]::new))
        );
    }
}
