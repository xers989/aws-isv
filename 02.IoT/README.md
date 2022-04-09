# APAC 2022 ISV Tech Summit - MongoDB

### 02. IoT Use Case with MongoDB Atlas, Kinesis Data firehose, MongoDB Charts and Atlas Datalake
Kinesis Data firehorse 로 IoT 데이터를 수집하여 Atlas 로 전달 하는 Pipeline을 구성하고 저장된 데이터를 활용 합니다.


#### Setup
다운로드 설치한 Compass 를 실행 합니다. 접속 하기 위한 Connection은 다음과 같습니다.
````
mongodb+srv://aws-isv-atlas:<password>@cluster0.6nfk2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
````

<img src="/images/02/images01.png" width="70%" height="70%">    

데이터베이스로 aws를 생성 하고 IoT 컬렉션을 생성합니다.

<img src="/images/02/images02.png" width="70%" height="70%">    

데이터를 파일을 다운로드 하고 업로드 합니다. 
데이터 파일 :
https://github.com/xers989/aws-isv/raw/main/02.IoT/tracking-historic-final.json

<img src="/images/02/images03.png" width="70%" height="70%">
파일 선택 후 JSON을 선택 하여 Import 진행 합니다.    
<img src="/images/02/images04.png" width="70%" height="70%">

#### Realm Application 생성
Atlas의 Data Platform 서비스로 Serverless 형태의 서비스를 제공 합니다. IoT컬렉션에 데이터 생성을 위한 서비스를 제공 합니다. Atlas Console 에서 Realm 메뉴에서 Realm Application 을 추가 하여 줍니다.     
연결된 데이터 소스를 사용 하고 있는 데이터베이스 클러스터를 선택 하고 배포 모델을 Local 로 한 후 Oregon 으로 선택 하여 줍니다.

<img src="/images/02/images05.png" width="70%" height="70%">

서비스 엔드포인트 생성을 위해 Https Endpoints 메뉴를 선택 하고 Add an endpoint 를 클릭 합니다.

<img src="/images/02/images06.png" width="70%" height="70%">

Route 주소를 /myservice 로 입력 하고 Method 를 Post 를 선택 합니다. 
Function 항목에서 Select a function 을 클릭 하고 New Function 을 선택 한 후 작성된 Script 를 입력 하여 줍니다.
Function name 은 IoTFunc 하고 IoTfunc.js 의 내용을 복사하여 주고 저장 합니다.

저장 후에 실제 배포는 된 상태가 아니기 때문에 위쪽에 나오는 버튼 REVIEW DRAFT & DEPLOY 를 클릭하여 줍니다.

<img src="/images/02/images07.png" width="70%" height="70%">

변경 내용을 보여주며 화면 하단에 Deploy 버튼을 클릭하여 완료 하여 줍니다.
<img src="/images/02/images08.png" width="70%" height="70%">

생성한 Function 의 인증을 변경 하기 위해 Functions 에서 생성된 IoTfunc에서 Actions을 클릭 (Edit Function)합니다.
<img src="/images/02/images09.png" width="70%" height="70%">

Settings를 선택 하고 Authentication 을 System 으로 선택 합니다. 저장 하고 배포를 진행 하여야 합니다.
<img src="/images/02/images10.png" width="70%" height="70%">


#### AWS Setting
AWS 에 로그인 후 Kinesis Data Firehose를 생성 합니다.
Source 는 Direct PUT 을 선택 하고 Destination 을 MongoDB Cloud 로 선택 합니다.
<img src="/images/02/images11.png" width="70%" height="70%">

API Key 는 다음 값을 입력 하여 줍니다ㅣ.
Aol7jmcDjYxLoruWMZprJHQPxHdCx7kvxLn5yvtOR3gdErza0fevfZWwLJygpu3H


MongoDB Realm webhook URL 은 Realm application 에서 Https Endpoints 에 생성한 서비스를 클릭 하여 Operation Type 에서 얻을 수 있습니다.
<img src="/images/02/images12.png" width="70%" height="70%">

백업 설정으로 실패한 데이터를 버킷으로 전송 하는 설정을 하여 준수 생성 하여 줍니다.

#### Firehose 수행
Firehose 를 실행하여 데이터 생성을 확인 합니다.

`````
aws-isv % % aws firehose put-record --delivery-stream-name PUT-MNG-ZBQH1 --record '{ "Data":"eyJvd25lciI6ICJhd3MtaW90In0="}'
{
    "RecordId": "4UhgZcPAvkZjBBOjAp+l3s8XCArwpNIBIyXmGzf5RwTPKVcC5JNThmGPq+AGHU9SiA63pEV8GJPBrXPZ1v1IhlWLhDvWW8w0KfofnIMY6QP/0z8/jsWjfGKKTRsSEnumTeCNeCv9J1X+Dg6WmXhZ0LHvS0bI+WNVlPalOGM1KLfmKhGdceuxMICU/JsG+j98LzM85Hd1hbK1pQN9xm6DtRyOy0hxk3TG",
    "Encrypted": false
}
`````
<img src="/images/02/images13.png" width="70%" height="70%">


#### Chart 생성하기
생성된 데이터로 부터 챠트를 생성 합니다. Atlas Console 로그인 후 Charts 를 클릭합니다
Charts 를 클릭 하고 Data Sources 메뉴를 선택 합니다. Add Data Source 버튼을 클릭 한 후 사용 중인 클러스터와 연결 합니다. Chart와 연결할 데이터 소스로 IoT를 선택 합니다.    
<img src="/images/02/images15.png" width="70%" height="70%">


이후 Add Dashboard를 합니다.
<img src="/images/02/images14.png" width="70%" height="70%">

Add Chart 를 클릭 하고 Datasource aws.IoT 를 선택 합니다. 

<img src="/images/02/images16.png" width="70%" height="70%">

챠트 종류를 Circular 를 선택 하고 City 를 Label 항목으로 reg_num 을 Arc 항목으로 Drag & Drop 하여 줍니다.
<img src="/images/02/images17.png" width="70%" height="70%">

챠트를 저장 합니다.


#### Online Archiving (Option)
Online Archiving 은 시간을 조건으로 하여 데이터를 Object Storage 공간으로 이동 시키는 것으로 Freetier 에서는 제한된 기능으로 테스트를 위해서는 M10으로 upgrade 한 후 테스트 하여야 합니다.   

````
let query = "";
        if (req.query.ssn != null) {
            let _ssn = req.query.ssn;
            query = {ssn: {$regex: "/*"+_ssn+"/*"}};
        }
        else
        {
            query = {};
        }
````

````
curl --location --request POST 'http://localhost:3000/handson/like?ssn=12' \
--header 'Content-Type: application/json'
````
