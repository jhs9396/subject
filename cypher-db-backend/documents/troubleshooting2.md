# Elasticsearch 설치방법 (Linux용)
- (Redhat Linux)
```
yum install 버전명시
```
- (Ubuntu Linux)
```
apt-get install 
```
```
# CentOS
$ yum install -y elasticsearch-7.9.3
# 서비스 활성화 및 기동
$ systemctl enable elasticsearch
$ systemctl start elasticsearch

# Ubuntu
$ apt-get install -y elasticsearch-7.9.3
$ systemctl enable elasticsearch
$ systemctl start elasticsearch
```

- Github repository 원하는 버전 다운로드
    - https://github.com/elastic/elasticsearch/releases
    - Elasticsearch의 라이선스가 버전에 따라 변경됨에 따라 공식문서를 참고하여 설치한다.
    - OpenJDK, JDK 버전이 맞아야 하므로 공식 문서를 참고한다. (문서 작성 시점엔 JDK 11 이상)
```
$ cd $HOME
$ mkdir elasitcsearch
$ cd elasticsearch
$ wget https://github.com/elastic/elasticsearch/archive/refs/tags/v7.10.0.tar.gz
$ tar -xvzf v7.9.3.tar.gz
$ cd elasticsearch-7.9.3/
$ vi $HOME/.bash_profile
$ source $HOME/.bash_profile
#####
# Elasticsearch 홈 디렉토리 추가
export ES_HOME=$HOME/elasticsearch/elasticsearch-7.10.0/
#####

# Run
$ ./gradlew -p  distribution/archives/no-jdk-linux-tar assemble
```
- 다양한 기동 및 빌드 방법은 공식문서를 참고한다
    - https://github.com/elastic/elasticsearch
    - https://github.com/elastic/elasticsearch/blob/master/TESTING.asciidoc