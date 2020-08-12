const express = require('express')  //express모듈 가져오기
const app = express()               //새로운 express 앱 생성
const port = 5000                   //포트번호
const {User} = require("./models/User");  //회원가입 라우터 만들기 : 모델 가져오기
const bodyParser = require('body-parser');//회원가입 라우터 만들기 : border-parser가져오기
const config = require('./config/key');  //mongoDB ID, PW 가져오기


// bodyparser는 클라이언트에서 오는 정보를 -> 서버에서 분석하여 가져올 수 있게 함
//aplication/x-www-form-urlencoded 이러한 형태의 데이터를 분석해서 가져올 수 있게 함
app.use(bodyParser.urlencoded({extended : true}));

//aplication/json 타입의 데이터를 분석하여 가져올 수 있게 함 
app.use(bodyParser.json());

const mongoose = require('mongoose');
mongoose.connect(config.mongoURI,{
    useNewUrlParser : true, useUnifiedTopology : true, useCreateIndex : true, useFindAndModify : false
}).then(()=>console.log("mongoDB is connected"))
.catch((err)=> console.log("failed", err))
// then 연결이 잘 됐는지 확인
//catch 오류가 있을 시


app.get('/', (req, res) => {        //app에 /루트디렉토리롤 오면 -> hello world를 출력
  res.send('Hello World!,asa')
})

// 회원가입을 위한 라우터 만들기
app.post('/register', (req, res)=>{
    // 회원가입할 때 필요한 정보들을 클라이언트에서 가져오면
    // 이 데이터를 데이터베이스에 넣어준다.

    // import한 모델을 이용하여 인스턴스를 생성
    // req.body에는 json형식의, 클라이언트에서 요청한 정보(클라이언트가 서버로 보낸 정보)가 들어 있음
    const user = new User(req.body);
    // json형식 -> {id : 1, name : "kum"}
    // body-parser를 사용하여 -> 클라이언트에서 보내는 정보를 -> req.body에서 담게 함
    
    user.save((err, userInfo)=>{  //에러메시지, 유저정보
        if(err) return res.json({success : false, err}) //만약 에러가 있으면 -> 클라이언트에게 -> json형식으로 응답을 보내줌

        // 만약 에러가 없다면
        return res.status(200).json({success : true})
    })  //정보들이 User모델에 저장됨|save()는 mongoDB 메소드
})


app.listen(port, () => {            //5000번 포트에서 실행
  console.log(`Example app listening at http://localhost:${port}`)
})
