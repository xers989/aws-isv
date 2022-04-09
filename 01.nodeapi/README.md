# APAC 2022 ISV Tech Summit - MongoDB

### 01. Nodejs 를 이용한 MongoDB CRUD

#### Env File 설정

MongoDB Atlas의 Deployment의 Database 메뉴를 클릭하여 생성한 데이터 베이스 클러스터를 조회 합니다.   
Connect 버튼을 클릭 하면 접근을 하기 위한 클러스터 정보를 얻을 수 있습니다. Nodejs 애플리케이션에서 접근을 할 것임으로 Connect your application 을 선택 합니다..
<img src="/images/01/images01.png" width="90%" height="90%">    
접근 하기 위한 Code를 복사 합니다.   

..env 파일을 생성 하고 복사한 Code를 다음과 같이 생성 하여 줍니다.  
Password는 생성한 Password를 입력 하여 주고 특수 문자가 포함된경우 URLCode로 인코딩하여 줍니다.    
MongoDB 접근 정보 및 사용할 Database 지정    
````
MONGODB=mongodb+srv://aws-isv-atlas:<password>@cluster0.6nfk2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
DATABASE=aws-atlas
````

#### Local Node test 

`````
$ npm install
$ npm install -D nodemon
$ npm start
`````

#### GET
````
curl --location --request GET 'http://localhost:3000/handson' \
--header 'Content-Type: application/json'
````

#### POST
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

#### Docker Build
`````
$ docker build -t nodeserver:3.3 .  
$ docker tag nodeserver:3.3  gcr.io/{Project_ID}/nodeserver:3.3 
$ docker push gcr.io/{Project_ID}/nodeserver:3.3 
`````

#### Kubernetes POD 배포
/kubernetes/deployment.yaml 의 
spec.template,spec.containers.image 의 값에 사용하고 있는 container registry 와 이미지 이름을 넣습니다. (예: gcr.io/mygoogleproject/nodeserver:3.3)

`````
$ kubectl apply -f ./kubernetes/deployments.yaml
$ kubectl apply -f ./kubernetes/services.yaml
$ kubectl get svc vuejsui -n mongodb 
NAME          TYPE           CLUSTER-IP      EXTERNAL-IP      PORT(S)          AGE
node-server   LoadBalancer   10.96.245.222   146.56.###.###   3000:31294/TCP   4d13h
`````

External-IP 로 API 를 테스트 합니다
````
curl --location --request GET 'http://146.56.###.###:3000/handson' \
--header 'Content-Type: application/json'
````
