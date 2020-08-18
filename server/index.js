const express = require('express')  //express모듈 가져오기
const app = express()               //새로운 express 앱 생성
const port = 5000                   //포트번호
const {User} = require("./models/User");  //회원가입 라우터 만들기 : 모델 가져오기
const bodyParser = require('body-parser');//회원가입 라우터 만들기 : border-parser가져오기
const config = require('./config/key');  //mongoDB ID, PW 가져오기
const cookieParser = require('cookie-parser'); 
const {auth} = require('./middleware/auth');

// bodyparser는 클라이언트에서 오는 정보를 -> 서버에서 분석하여 가져올 수 있게 함
//aplication/x-www-form-urlencoded 이러한 형태의 데이터를 분석해서 가져올 수 있게 함
app.use(bodyParser.urlencoded({extended : true}));

//aplication/json 타입의 데이터를 분석하여 가져올 수 있게 함 
app.use(bodyParser.json());

//쿠키를 사용하겠다!
app.use(cookieParser());

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
app.post('/api/users/register', (req, res)=>{
    // 회원가입할 때 필요한 정보들을 클라이언트에서 가져오면
    // 이 데이터를 데이터베이스에 넣어준다.

    // import한 모델을 이용하여 인스턴스를 생성
    // req.body에는 json형식의, 클라이언트에서 요청한 정보(클라이언트가 서버로 보낸 정보)가 들어 있음
    const user = new User(req.body);
    // json형식 -> {id : 1, name : "kum"}
    // body-parser를 사용하여 -> 클라이언트에서 보내는 정보를 -> req.body에서 담게 함
    
    //user.save()하기 전에, 암호화를 진행해야함-> 몽구스의 기능을 이용하기


    user.save((err, userInfo)=>{  //에러메시지, 유저정보
        if(err) return res.json({success : false, err}) //만약 에러가 있으면 -> 클라이언트에게 -> json형식으로 응답을 보내줌

        // 만약 에러가 없다면
        return res.status(200).json({success : true})
    })  //정보들이 User모델에 저장됨|save()는 mongoDB 메소드
})


// 로그인 route 만들기
app.post('/api/users/login', (req, res)=>{
  // 1.데이터베이스에서 요청한 e-mail(id) 찾기
  User.findOne({email:req.body.email}, (err, user)=>{
    if(!user){ //만약 userInfo가 없다면?
      return res.json({
        loginSucess : false,
        message : "제공된 이메일에 해당하는 유저가 없습니다."
      })
    }else{
    //2.요청한 email이 데이터베이스에 있다면->비밀번호가 맞는지 확인
      //userInfo에 유저에 대한 정보가 다 들어있음
      //comparePassword는 User.js에서 정의한 메소드
      user.comparePassword(req.body.password,(err, isMatch)=>{
        if(!isMatch){  
          return res.json({
            loginSucess : false,
            message : "비밀번호가 틀렸습니다."
          })
        }else{
        //3.비밀번호가 맞다면-> 해당 유저를 위한 토큰을 생성해줌
          user.generateToken((err, user)=>{  //user에는 토큰이 저장된 상태
            if(err) return res.status(400).send(err);

            //4.토큰을 저장한다. -> 쿠기 혹은 로컬스토르지 등등에 저장가능 -> 쿠키에 저장해보자.
            res.cookie("x_auth", user.token)
            .status(200)
            .json({
              loginSucess : true,
              userId : user._id
            }) 
          })
        }
      })
    }
  })
})




// auth route(사이트에서 권한별로 접근이 가능하게 한다ㅏ)
// server의 토큰, client의 쿠키안의 토큰을 비교하여 -> 권한을 확인
//쿠키안의 토큰 -> 디코드 -> user_id가 나옴 -> db에서 id로 권한 확인
// app.get(end point, middleware, callback)
//auth는 미들웨어로, auth.js 작업
app.get('/api/users/auth', auth, (req,res)=>{
// 여기까지 미들웨어를 통과했다는 말은, Auth가 true라는 말
  res.status(200).json({  
    //클라이언트에게 보내는 정보
    //정보를 보내주면, 어떤 페이지든지간에 보낸 정보를 이용할 수 있음
    _id : req.user._id,
    isAdmin : req.user.role == 0 ? true : false,
    isAuth : true,
    email : req.user.email,
    name : req.user.name,
    lastname : req.user.lastname,
    role : req.user.role,
    image : req.user.image 
  })
})


// 로그아웃 기능
// 해당하는 유저를 찾아서 -> 토큰을 지워준다.(토큰은 인증수단으로 쓰이므로 삭제해줘야함)
// 로그인된 상태이므로, auth미들웨어를 넣어줌
app.get('/api/users/logout', auth, (req, res)=>{
  // 로그아웃하려는 유저를 모델에서 찾기
  User.findOneAndUpdate({_id : req.user._id}, 
    //유저를 찾아서 업데이트하는 것
    //req.user는 auth라는 미들웨어에서 인증을 하고 저장한 req.user값을 그대로 사용하는 것
    {token : ""},  //토큰 지워주기
    //콜백함수
    (err, user)=>{
      if(err) return res.json({success : false, err});
      return res.status(200).send({
        success : true
      })
    }
    )  
  

})

app.listen(port, () => {            //5000번 포트에서 실행
  console.log(`Example app listening at http://localhost:${port}`)
})
