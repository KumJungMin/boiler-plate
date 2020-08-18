const {User} = require('../models/User');

let auth = (req, res, next) =>{
// 인증처리를 하는 곳
// 1. 클라이언트 쿠키에서 토큰 가져오기
    let token = req.cookies.x_auth;  

// 2. 토큰을 복호화해서 user를 찾기->유저모델에서 메소드 만들어서 가져와서 사용하기
    User.findByToken(token, (err,user)=>{
        if(err) throw err;
        if(!user) return res.json({
            isAuth : false,
            error : true
        })

        // 만약 유저가 있다면?
        req.token = token;  
        //req.token에 토큰과 유저아이디값을 넣으면 -> index.js에서 req.token으로 해당 값을 가져올 수 있기때문
        req.user = user;
        next();  // 미들웨어 작업 후 -> 콜백함수 작업을 하도록 진행시킴
    })
    

// 3. 유저가 있으면 인증ok

}

module.exports = {auth};