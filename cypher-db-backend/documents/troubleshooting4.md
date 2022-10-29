# 오류발생 과정
- /etc/elasticsearch/elasticsearch.yml 변경
    - network.host: 0.0.0.0
- Elasticsearch 기동 시(systemctl start elasticsearch)
- [참고 github issue page](https://github.com/wazuh/wazuh-kibana-app/issues/1683)

# 원인
- 네트워크 정보가 변경되었는데, single 노드인 경우 노드와 클러스터 정보를 기입해야 하는데 기본 옵션으로 기동

# 문제해결
- 다음과 같은 옵션 주석 처리 또는 추가
    - /etc/elasticsearch/elasticsearch.yml 파일 변경

```yaml
node.name: node-1
cluster.initial_master_nodes: node-1
```

- Elasticsearch 기동 확인