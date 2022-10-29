# Preview(Jest-Backend)
- 본 개발내용은 이기종 데이터를 그래프 언어로 해석할 수 있는 `Wrapper`가 포함된 백앤드 서버다.
- 그래프 언어로는 Open `Cypher query language`를 사용한다.
- 그래프 언어로 조회된 이기종 데이터를 `HTTP REST API`통신으로 내부/외부에 공유한다.

# Environment
- Java JDK 16.X
    - 백앤드 작업
        - 이기종 데이터 핸들링(CRUD)
        - REST API 채널
        - GraphQL 지원기능
- Spring Boot 2.4.5
    - Embed WAS
        - Apache Tomcat 9.0.45
    - Maven Project
        - No Gradle
- Elasticsearch 7.10 ↓
    - Elasticsearch 라이선스 정책에 따라 7.10 이상 버전은 SSPL 1.0 license(소스 사용시 개발 소스 전체 공개)를 가지므로 하위 버전을 사용(Apache2 License)
- Spring-Elasticsearch 4.1.9
    - [버전참고](https://docs.spring.io/spring-data/elasticsearch/docs/current/reference/html/#preface.versions)
- Redis 6.2.3
    - 자체적으로 GraphQL 지원 되는 DB
- PostgreSQL 10.X
    - 그래프 메타 정보 관리
    - Procedure language (with python3.X) 지원
- `Deprecated`~~AgensGraph 2.X~~
    - ~~2.0과 2.1의 갭이 크므로 사용 안할 예정~~
    - ~~제품에서 `Cypher Query`를 지원하지만 타입 문제가 빈번히 발생하므로 사용 안하길 권장~~ 

# 실행 방법
- `mvn spring-boot:run`
    - SpringBoot server 실행

# 구현 리스트
- Cypher Query Wrapper 구현
    - 이기종 데이터들은 각 기 다른 조회방법이 존재
        - Elasticsearch HTTP REST API
        - Redis Cypher query
        - PostgreSQL ANSI-SQL
    - 자체적인 Cypher query 해석능력을 가진 `wrapper`를 구현하여 데이터를 핸들링한다.
        - 장점: 이기종 데이터 별 제품별 장점을 그대로 사용하기 때문에 성능면에서 문제가 없다.
        - 단점: `Java`에서 지원이 되는(JDBC) 제품이여야 오리지널 기능을 사용할 수 있다.
- HTTP REST API 규격화
    - 기능별로 `API`를 나누지 않고, 그에 맞는 기능을 `Cypher query`로 작성하여 관리할 수 있게 구현
        - 기능별 `API`도 지원하되, Graph 컨셉에 맞는 기능을 구현하여 제공
    - `/query` API 사용 권장
    - `/query/cypher` Cypher query 사용할 수 있는 API

# 기타 해야 할 것
- `TODO` Graph Data Clustering
- `TODO` TF-IDF (Clustering 특징 추출)
- `TODO` NMI(Normalized Mutual Information) 모듈 개발 필요
- `TODO` 분석용 언어 (Python) 연동 모듈 개발 필요 -> 안 되면, Python 개별 분석 전용 서버 구현 필요 
    - Py4j research 결과 : 클라이언트 조작을 `Python`에서만 할 수 있어서 자바에서 파라미터를 넘길 수 없다.
    - Python script 실행 및 분석 서버를 따로 구현 필요 (django 보단 Flask 구현)