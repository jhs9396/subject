### 클라이언트 레벨 지원 기능 목록
- Transport Client
- High Level REST Client *
    - 이 중에서 Transport는 7버전부터 deprecated 되었고, 클라이언트 통신 기능은 High Level REST Client를 사용한다.
- Reactive Client
- Client Configuration
- Client logging

Java로 Elasticsearch를 연동하기 위해선 우선 스프링에서 제공하는 maven, gradle repository에서 라이브러리를 받는다.

Spring Framework 또는 SpringBoot를 사용하는 경우 maven의 버전과 elasticsearch 버전을 확인한 뒤 라이브러리를 설치해야 한다.
- 6.X 버전과 7.X elasticsearch에서 제공하는 API 파라미터중 deprecate 된 파라미터가 있어서 호환이 안 된다.
- [버전참고](https://docs.spring.io/spring-data/elasticsearch/docs/current/reference/html/#preface.versions)
```yaml
# Maven
<dependency>
    <groupId>org.springframework.data</groupId>
    <artifactId>spring-data-elasticsearch</artifactId>
    <version>4.1.9</version>
</dependency>

# Gradle
implementation("org.springframework.boot:spring-boot-starter-data-elasticsearch:4.1.9")
```

Maven이나 Gradle 인스톨이 완료되면, 개발에 필요한 준비물이 완료된다.

### Elasticsearch network binding
- Docker 컨테이너로 실행한 Elasticsearch나 클라우드에서 동작하는 Elasticsearch 서비스를 사용한다면, Elasticsearch의 설정파일 내용을 수정해야 한다.
```
# Linux - yum install 버전
# 모든 네트워크에 접근을 허용 : local, site, scope등 범위를 지정할 수 있는 변수들이 존재한다.
# https://www.elastic.co/guide/en/elasticsearch/reference/current/modules-network.html#network-interface-values
sudo vi /etc/elasticsearch/elasticsearch.yml
=> network.host: 0.0.0.0 
```
- 설정이 변경되었다면, elasticsearch를 재기동한다.
```linux
# Linux
$ systemctl restart elasticsearch
```
- docker 컨테이너로 elasticsearch를 기동했다면 docker가 수행되는 머신에 포트포워딩을 할 수 있다.
- 서비스 되는 포트를 직접 받을 수 있다면 호스트 정보와 포트를 사용하면 된다.
- SSH 터널링을 통해 로컬에 포트를 생성해도 된다.
    - ssh -L 9200:localhost:9200 ~~~
### 로컬에서 elasticsearch document 호출 테스트
- 미리 document를 생성하여 로컬에서 정상적으로 값이 보이는지 테스트해본다.
```http
$ curl -XPOST localhost:9200/customer2/info/2?pretty -H 'Content-Type: application/json' -d '{"name": "jhs", "age": 30}'
http://localhost:9200/customer2/info/2?pretty
```
```json
{
  "_index" : "customer2",
  "_type" : "info",
  "_id" : "2",
  "_version" : 1,
  "_seq_no" : 0,
  "_primary_term" : 5,
  "found" : true,
  "_source" : {
    "name" : "jhs",
    "age" : 30
  }
}
```


### application.yml 설정 정보 입력
- Elasticsearch 호스트 정보, 포트정보를 기입한다.
```yaml
spring:
    ~~
elasticsearch:
    host: 127.0.0.1 # 호스트 정보
    port: 9200
```

### ElasticSearch Bean 객체 생성
- Elasticsearch client Bean 객체를 생성하여 Java Service, Component 레벨에서 인젝션하여 사용한다.

### Java Bean 객체 생성
```java
import lombok.Setter;
import org.elasticsearch.client.RestHighLevelClient;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.elasticsearch.client.ClientConfiguration;
import org.springframework.data.elasticsearch.client.RestClients;
import org.springframework.data.elasticsearch.repository.config.EnableElasticsearchRepositories;

@EnableElasticsearchRepositories
@Configuration
@ConfigurationProperties("elasticsearch")
public class ElasticConfig {
    /**
     * yaml properties 호스트 정보
     */
    @Setter String host;

    /**
     * yaml properties 포트 정보
     */
    @Setter String port;

    /**
     * High Level REST Client Bean 생성
     *
     * @return 호스트, 포트 내용이 바인딩 된 RestHighLevelClient
     */
    @Bean(name="elasticSearchClient")
    public RestHighLevelClient elasticsearchClient() {
        final ClientConfiguration clientConfig = ClientConfiguration.builder()
                .connectedTo(host + ":" + port)
                .build();
        return RestClients.create(clientConfig).rest();
    }
}
```

### ElasticSearch source 조회
- Service나 Component level context에서 elasticsearch Bean을 주입한 객체를 사용
```java
/**
* High Level REST Client 객체
*/
RestHighLevelClient restHighLevelClient;

/**
* High Level REST Client Bean 인젝션
**/
@Autowired
public [class name](@Qualifier("elasticSearchClient") RestHighLevelClient restHighLevelClient) {
    this.restHighLevelClient = restHighLevelClient;
}

...
/**
 * Elasticsearch 인덱스와 ID를 사용하여 Document의 Source 조회
 * 
 * @param idx Elasticsearch 인덱스 문자열
 * @param id  Elasticsearch ID 문자열
 * @return Document.source 결과
 */
public Map<String,Object> getSource(String idx, String id) {
    Map<String,Object> source = new HashMap<>();
    try {
        GetRequest getRequest = new GetRequest(idx);
        getRequest.id(id);
        source = restHighLevelClient.get(getRequest, RequestOptions.DEFAULT).getSource();
    } catch (IOException e) {
        source.put("error", "IO Error exception");
    } finally {
        return source;
    }
}
------
결과창 : {name=jhs, age=30}
```