# 목적
- IN-MEMORY Database인 Redis를 설치하는 능력 배양
- Redis module 중 Cypher Language를 지원하는 모듈을 설치하여 Cypher 질의문을 수행할 수 있는 환경 구성 능력 배양

# Redis 설치방법
1) yum repository에 존재하는 redis install
```
# installation
$ sudo yum install epel-release yum-utils
$ sudo yum install http://rpms.remirepo.net/enterprise/remi-release-7.rpm
$ sudo yum-config-manager --enable remi

# execute
$ sudo systemctl enable redis
$ sudo systemctl start redis

# connect to cli
$ redis-cli
127.0.0.1:6379> PING
PONG
```

2) redis source build
- redis source tar 파일을 다운로드 받아서 설치할 서버 또는 로컬에 다운로드 한다.
- [redis download 웹페이지](https://download.redis.io/releases/redis-6.2.3.tar.gz?_ga=2.145473972.1689546121.1621470793-1545138304.1621470793)
- 작성시점 버전 : 6.2.3
```
# installation
$ tar -xzvf redis-6.2.3.tar.gz
$ cd redis-6.2.3
$ make
$ sudo make install

# execute (보통 백그라운드로 수행)
$ redis-server & 
$ redis-cli
127.0.0.1:6379> PING
PONG
```

3) Redis Docker image 사용
```
$ docker pull redis
$ docker run -p 6379:6379 --name redis-server redis
$ docker exec -it [container id] /bin/bash
$ redis-cli
127.0.0.1:6379> PING
PONG
```

# RedisGraph 설치 또는 모듈 확장 방법
- RedisGraph Docker image
```
$ docker pull redislabs/redisgraph
$ docker run -p 6379:6379 --name redis-graph-server redislabs/redisgraph
$ docker exec -it [container id] /bin/bash
$ redis-cli

# cypher execute example
# 127.0.0.1:6379> GRAPH.QUERY [graph_path] [cypher query]
127.0.0.1:6379> GRAPH.QUERY path1 "CREATE (a:person {name: 'jhs'})-[r:know]->(b:person {name: 'kkm'})"
1) 1) "Labels added: 1"
   2) "Nodes created: 2"
   3) "Properties set: 2"
   4) "Relationships created: 1"
   5) "Cached execution: 0"
   6) "Query internal execution time: 0.293400 milliseconds"

127.0.0.1:6379> GRAPH.QUERY test_graph "MATCH (a:person) RETURN a"
1) 1) "a"
2) 1) 1) 1) 1) "id"
            2) (integer) 0
         2) 1) "labels"
            2) 1) "person"
         3) 1) "properties"
            2) 1) 1) "name"
                  2) "jhs"
   2) 1) 1) 1) "id"
            2) (integer) 1
         2) 1) "labels"
            2) 1) "person"
         3) 1) "properties"
            2) 1) 1) "name"
                  2) "kkm"
3) 1) "Cached execution: 0"
   2) "Query internal execution time: 0.132600 milliseconds"
```

- Redis가 설치된 서버에 모듈 load
    - RedisGraph github 소스 다운로드
    - 빌드에 필요한 라이브러리 다운로드
    - RedisGraph 소스 빌드
    - 생성된 redisgraph.so 파일 참조하여 서버 기동
```
$ git clone --recurse-submodules -j8 https://github.com/RedisGraph/RedisGraph.git
$ sudo yum install -y build-essential cmake m4 automake peg libtool autoconf
$ cd RedisGraph
$ make

# 서버 기동시 라이브러리 load 포함 수행
$ redis-server --loadmodule $HOME/download/RedisGraph/src/redisgraph.so
$ redis-cli

# cypher execute example
# 127.0.0.1:6379> GRAPH.QUERY [graph_path] [cypher query]
127.0.0.1:6379> GRAPH.QUERY path1 "CREATE (a:person {name: 'jhs'})-[r:know]->(b:person {name: 'kkm'})"
1) 1) "Labels added: 1"
   2) "Nodes created: 2"
   3) "Properties set: 2"
   4) "Relationships created: 1"
   5) "Cached execution: 0"
   6) "Query internal execution time: 0.293400 milliseconds"

127.0.0.1:6379> GRAPH.QUERY test_graph "MATCH (a:person) RETURN a"
1) 1) "a"
2) 1) 1) 1) 1) "id"
            2) (integer) 0
         2) 1) "labels"
            2) 1) "person"
         3) 1) "properties"
            2) 1) 1) "name"
                  2) "jhs"
   2) 1) 1) 1) "id"
            2) (integer) 1
         2) 1) "labels"
            2) 1) "person"
         3) 1) "properties"
            2) 1) 1) "name"
                  2) "kkm"
3) 1) "Cached execution: 0"
   2) "Query internal execution time: 0.132600 milliseconds"
```