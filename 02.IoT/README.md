# APAC 2022 ISV Tech Summit - MongoDB

### 02. IoT Use Case with MongoDB Atlas, Kinesis Data firehose, MongoDB Charts and Atlas Datalake
Kinesis Data firehorse 로 IoT 데이터를 수집하여 Atlas 로 전달 하는 Pipeline을 구성하고 저장된 데이터를 활용 합니다.


#### Setup
다운로드 설치한 Compass 를 실행 합니다. 접속 하기 위한 Connection은 다음과 같습니다.
````
mongodb+srv://aws-isv-atlas:<password>@cluster0.6nfk2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
````


<img src="/images/01/images01.png" width="70%" height="70%">    

접근 하기 위한 Code를 복사 합니다.   

..env 파일을 생성 하고 복사한 Code를 다음과 같이 생성 하여 줍니다.  
Password는 생성한 Password를 입력 하여 주고 특수 문자가 포함된경우 URLCode로 인코딩하여 줍니다.    
MongoDB 접근 정보 및 사용할 Database 지정    
````
MONGODB=mongodb+srv://aws-isv-atlas:<password>@cluster0.6nfk2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
DATABASE=aws-atlas
````

<img src="/images/02/images01.png" width="70%" height="70%">    

데이터베이스로 aws를 생성 하고 IoT 컬렉션을 생성합니다.

<img src="/images/02/images02.png" width="70%" height="70%">    

데이터를 파일을 다운로드 하고 업로드 합니다. 
데이터 파일 :
https://github.com/xers989/aws-isv/raw/main/02.IoT/tracking-historic-final.json

파일 선택 후 JSON을 선택 하여 Import 진행 합니다.    
<img src="/images/02/images03.png" width="70%" height="70%">

#### Realm Application 생성
Atlas의 Data Platform 서비스로 Serverless 형태의 서비스를 제공 합니다. IoT컬렉션에 데이터 생성을 위한 서비스를 제공 합니다. Atlas Console 에서 Realm 메뉴에서 Realm Application 을 추가 하여 줍니다.     
연결된 데이터 소스를 사용 하고 있는 데이터베이스 클러스터를 선택 하고 배포 모델을 Local 로 한 후 Oregon 으로 선택 하여 줍니다.

<img src="/images/02/images04.png" width="70%" height="70%">

서비스 엔드포인트 생성을 위해 Https Endpoints 메뉴를 선택 하고 Add an endpoint 를 클릭 합니다.

<img src="/images/02/images05.png" width="70%" height="70%">

Route 주소를 /myservice 로 입력 하고 Method 를 Post 를 선택 합니다. 
Function 항목에서 Select a function 을 클릭 하고 New Function 을 선택 한 후 작성된 Script 를 입력 하여 줍니다.
Function name 은 IoTFunc 하고 IoTfunc.js 의 내용을 복사하여 주고 저장 합니다.

저장 후에 실제 배포는 된 상태가 아니기 때문에 위쪽에 나오는 버튼 REVIEW DRAFT & DEPLOY 를 클릭하여 줍니다.

<img src="/images/02/images06.png" width="70%" height="70%">

#### Local Node test 

`````
$ npm install
$ npm install -D nodemon
$ npm start
`````

#### POST
aws-altas 데이터 베이스에 handson 이라는 컬렉션(테이블)을 생성하고 데이터 (Json document)를 입력 합니다.  

Node를 시작하고 Postman 혹은 Curl을 이용하여 POST로 데이터를 생성 합니다. SSN을 포함하는 고객 정보를 생성합니다.

`````
curl --location --request POST 'http://localhost:3000/handson' \
--header 'Content-Type: application/json' \
--data-raw '{
        "ssn": "123-001-0000",
        "address": {
            "street": "Seoul Jongro-gu, Sejon-ru ",
            "city": "Seoul",
            "zip": 123142
        },
        "name": {
            "firstName":"Jon",
            "lastName" : "Doe"
        },
        "phone": "010-2345-9999"
    }'
`````

#### GET
생성한 데이터를 확인 합니다. GET으로 호출 하면 handson 컬렉션에 모든 데이터를 반환 합니다.  

````
curl --location --request GET 'http://localhost:3000/handson' \
--header 'Content-Type: application/json'
````


#### POST - Like 검색 만들기
router.route('/like').post(async (req, res, next) 를 추가 합니다. Query 파라키터로 ssn을 받아 데이터를 검색하도록 합니다.    
where ssn like '%XX%' 와 동일 한 검색을 하도록 합니다.    
내부 코드는 일반 검색 하는 코드를 복사하고 Query 부분을 regex 를 이용하여 검색 하도록 조정 하여 줍니다.

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
