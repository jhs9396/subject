# Preview
 - Flask를 활용한 그래프 분석 API 서버
 - SpringBoot와 Node.js(Express)에 익숙한 개발자에게 decorator를 활용하여 
   annotation 또는 router와 유사하게 개발할 수 있도록 Flask app 인스턴스에 use 정의
 - app 인스턴스에 url과 url에 맞는 클래스 인스턴스를 매핑
 - 그래프 클러스터링을 위한 간단한 예제 (louvain-method, girvan-newman)

# Environment
 - Python
   - 3.9.6
   - anaconda를 사용해서 3 이상의 버전을 유지
 - pip3 install Flask networkx python-louvain
 - 환경변수 설정
   - FLASK_APP
     - flask를 기동할 때 import할 모듈의 이름을 지정한다.
   - FLASK_ENV
     - debug mode를 활성화한다. (webpack -> mode와 동일)
     - development(debug mode), production(default option)
```shell
export FLASK_APP=${사용할 앱(모듈) 이름}
export FLASK_ENV=development
```

# 기동
```shell
$ cd $FLASK_APP_HOME
$ flask run
```

# 프로젝트 구조
```
app/
 ㄴ analysis/
   - 그래프 클러스터링 관련 알고리즘 정의
 ㄴ repo/
   - global variable 또는 설정관련 파일
 ㄴ route/
   - 분석 결과 또는 API 처리결과를 담당
   ㄴ api_analysis.py
     - 클러스터링 분석결과 반환 (Express.js router 유사)
   ㄴ api_main.py
     - SpringBoot RestController 유사 활용
```