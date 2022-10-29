# Preview
- Nest.js + GraphQL 사용
- 본 개발내용은 Nest.js, GraphQL을 사용하여 Frontend에 데이터를 전달할 API 서버
- DB 연동은 구현하지 않았고, Object에 화면에 그릴 데이터를 간략하게 저장해놓은 뒤, GraphQL Resolver, Service만 구현
- GraphQL에 접근을 통제하기 위한 중간 JWT AccessToken 발급 및 체크만 구현

# Environment
 - node
   - v16.18.0
   
# Installation

```bash
$ yarn install
```

# Running the app

```bash
# development
$ yarn start:local

# watch mode
$ yarn start:dev

# production mode
$ yarn start:prod
```

# 프로젝트 파일 구조
```
schema/
 ㄴ GraphQL 관련 query, mutation, resolver, service에 필요한 스키마 정보들
graphql/
 ㄴ auth/
  - GraphQL 사용을 위한 jwt 엑세스 토큰 관련 resolver, service 
 ㄴ graph/
  - Frontend에 사용할 그래프 데이터 관련 resolver, service
helper/
 ㄴ guards
  - jwt 인증 AuthGuard 추가
graphql.options.ts
 ㄴ GraphQL schema first 옵션
```

# graphql playground
```
http://localhost:4000/graphql
```


