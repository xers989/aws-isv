# APAC 2022 ISV Tech Summit - MongoDB

### 03. MongoDB Atlas Search
MongoDB atlas Search를 이용하여 Data pipeline 구성 없이 Atlas에 저장된 데이터에 대해 full text 검색을 수행 합니다.


#### full text index 생성
Atlas console 에 로그인 후 데이터베이스 클러스터를 선택 후 Search를 클릭 합니다.   
Free tier는 3개의 인덱스 까지 생성 가능 합니다.   
<img src="/images/03/images01.png" width="70%" height="70%">    

인덱스 생성은 Json 으로 직접 입력 하거나 UI를 통해 생성 할 수 있습니다.  Visual Editor 를 선택 합니다.
<img src="/images/03/images02.png" width="70%" height="70%">    

컬렉션은 sample_mflix.movies 를 선택 하고 인덱스 이름은 default로 합니다.
<img src="/images/03/images03.png" width="70%" height="70%">    

인덱스 생성은 백그라운드에서 실행 되며 몇분후에 완료 됩니다.
<img src="/images/03/images04.png" width="70%" height="70%">    


#### 기본 Full text Search
Atlas Console 의 Aggregation 항목을 선택 하고 검색 관련한 pipeline 을 다음과 같이 생성 하여 줍니다.

<img src="/images/03/images05.png" width="70%" height="70%">    

검색을 위한 파이프라인을 구성 합니다. fullplot이라는 컬럼을 대상으로 crime을 검색 합니다.
`````
[
    {
      $search: {
        index: "default",
        text: {
          query: "crime",
          path: "title",
        }
      }
    }
]
`````

<img src="/images/03/images06.png" width="70%" height="70%">    

쿼리가 실행 되어 결과가 보여 지게 됩니다. 해당 필드에 해당 검색어로 검색한 결과로 보여 집니다.

<img src="/images/03/images07.png" width="70%" height="70%">    


#### Flask Application
Python Flask project 를 다운로드 후 config.py 에 MongoDB를 접근하기 위한 Connection String을 입력 합니다.    

`````
mongo_uri="mongodb+srv://aws-isv-altas:<password>@cluster0.5qjlg.mongodb.net/myFirstDatabase"
`````

필요한 패키를 설치 합니다.
`````
$ pip3 install 'pymongo[srv]'
$ pip3 install pymongo
$ pip3 install flask
`````

애플리케이션을 시작 합니다.
`````
 $ python3 server.py                     
 * Serving Flask app 'server' (lazy loading)
 * Environment: production
   WARNING: This is a development server. Do not use it in a production deployment.
   Use a production WSGI server instead.
 * Debug mode: on
 * Running on http://localhost:5010 (Press CTRL+C to quit)
 * Restarting with stat
 * Debugger is active!
 * Debugger PIN: 220-603-097

`````

애플리케이션에 접속 합니다.
<img src="/images/03/images08.png" width="70%" height="70%">  


#### Firehose 수행
Firehose 를 실행하여 데이터 생성을 확인 합니다.   
Data 는 다음 Json 메시지를 Base64로 encoding 하여 줍니다.    
`````
{"owner": "aws-iot"}
`````


<img src="/images/02/images13.png" width="70%" height="70%">    


#### Chart 생성하기
생성된 데이터로 부터 챠트를 생성 합니다. Atlas Console 로그인 후 Charts 를 클릭합니다
Charts 를 클릭 하고 Data Sources 메뉴를 선택 합니다. Add Data Source 버튼을 클릭 한 후 사용 중인 클러스터와 연결 합니다. Chart와 연결할 데이터 소스로 IoT를 선택 합니다.    
<img src="/images/02/images15.png" width="50%" height="50%">    


이후 Add Dashboard를 합니다.     
<img src="/images/02/images14.png" width="40%" height="40%">    

Add Chart 를 클릭 하고 Datasource aws.IoT 를 선택 합니다.     

<img src="/images/02/images16.png" width="70%" height="70%">

챠트 종류를 Circular 를 선택 하고 City 를 Label 항목으로 reg_num 을 Arc 항목으로 Drag & Drop 하여 줍니다.
<img src="/images/02/images17.png" width="70%" height="70%">

챠트를 저장 합니다.


#### Online Archiving (Option)
Online Archiving 은 시간을 조건으로 하여 데이터를 Object Storage 공간으로 이동 시키는 것으로 Freetier 에서는 제한된 기능으로 테스트를 위해서는 M10으로 upgrade 한 후 테스트 하여야 합니다.   
Atlas Console 에서 데이터 베이스 클러스터를 선택 한 후 Online Archive 를 선택 합니다.

<img src="/images/02/images18.png" width="70%" height="70%">

Configure Online Archive 를 선택 후 다음을 선택 합니다.
Namespace 에 aws.IoT를 입력 하고 Date Field 에 TimeStamp를 입력하고 일수를 60으로 입력 합니다.
Timestamp 항목에서 현재일 기준 60일 이전의 데이터를 선택 하여 Arhive 하는 것입니다.


<img src="/images/02/images19.png" width="60%" height="60%">

기본 항목으로 진행 하여 설정을 완료 하면 Archive 서비스가 시작 됩니다.

Archive는 백그라운드 배치 프로세스로 수행 결과는 다음과 같이 확인 할 수 있습니다.  
또한 IoT 컬렉션에는 데이터가 모두 Archive되어 없는 것을 확인 할 수 있습니다.
<img src="/images/02/images20.png" width="60%" height="60%">     


#### Data Lake Query (Option)
Arhive 된 데이터를 확인 하고 Query를 수행 합니다.  
Data Lake 메뉴를 클릭 하면 Online Archive Data Lakes 항목에서 Arhive된 내역을 볼 수 있습니다.    


<img src="/images/02/images21.png" width="70%" height="70%">

Archive는 백그라운드 배치 프로세스로 수행 결과는 다음과 같이 확인 할 수 있습니다.  
또한 IoT 컬렉션에는 데이터가 모두 Archive되어 없는 것을 확인 할 수 있습니다.   

Connect 버튼을 클릭 하면 Datalake 에 접속 하기 위한 주소를 얻을 수 있습니다.
<img src="/images/02/images23.png" width="60%" height="60%">    

Compass 에서 해당 주소를 이용하여 접속하면 데이터가 존재 하는 것을 확인 할 수 있습니다.

<img src="/images/02/images24.png" width="60%" height="60%">    
