## 프로젝트 구조
```
과거 진행했던 소스들
 - cypher-db-backend
 - python-server

최근 본인이 사용하고 있는 기술에 맞춰 작성한 과제용 프로젝트
 - jest-backend
 - jest-frontend
```

## 프로젝트별 주요 코드
```
cypher-db-backend
 - CommonController.java
   - 주요 Dao 인스턴스를 재활용하는 간단한 캐싱로직과 Reflection을 통한 메소드 활용
 - CypherHandler.java
   - gremlin에서 제공하는 cypher query library를 사용하지 않고 
     자체적으로 Cypher Language를 문장별로 파싱하여 쿼리에 메타정보를 찾고 관리하기 위한 방법
     
python-server
 - app/main.py
   - Flask를 처음 사용해보면서 Java와 Node.js(Express.js)에 익숙한 입장이다 보니
     파이썬 decorator를 활용하여 SpringBoot RestController, Express.router와 유사하게 사용하기 위한 고민
     flask app 인스턴스에 use function을 정의하여 인스턴스 내 
     router 또는 클래스 인스턴스를 전달받은 base url과 관리
 - app/route/common/api_common.py
   - SpringBoot annotation과 유사하게 동작시키기 위해 decorator를 사용 
 - app/route/api_analysis.py
   - Express router와 유사하게 사용하기 위하여 get, post별 실행시킬 함수를 정의
   - 파이썬의 분석 라이브러리를 사용하여 간단한 그래프 클러스터링(루벵-메소드) 기능
   
jest-backend
 - graph.resolver.ts
 - graph.service.ts
   - Nest.js에서 GraphQL을 사용하는 간략한 예제
   - Nest.js에서 jwt 토큰 GraphQL 요청을 수행하기 전 인증관련 가드 소스
 - graphql-auth.guard.ts
 - jwt.strategy.ts
   - Nest.js에서 jwt 엑세스 토큰 인증을 위한 AuthGaurd 등록 및 validate 체크하기 위한 예제 소스
   - 클러스터 인스턴스 환경을 고려한 Redis와 같이 세션정보 관리용 스토리지를 시간상 따로 구성할 순 없어서 
     간략한 엑세스 토큰 재발급 
     
jest-frontend
 - Graph.tsx
   - React.js + d3.js를 활용한 간단한 그래프 화면 표현 
   - d3.js을 사용한 그래프 노드 및 엣지 시각화
   - 컴포넌트 재사용성을 위하여 필요 옵션 또는 시각화에 필요한 데이터는 기본적으로 properties에 정의
 - stores/*
   - redux/toolkit을 사용하여 global state 관리
 - hooks/*
   - redux/toolkit 또는 react-query 등 hooks base 간단한 예제
   - react-query는 access token과 같이 세션에서 주기적으로 갱신될 수 있는 정보 관리용으로 활용
```