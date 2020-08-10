//모델, 스키마 구축하기
// 1. 몽구스 가져오기
const mongoose = require('mongoose');

// 2. 스키마 생성
const userSchema = mongoose.Schema({
    name : {
        type : String,
        maxlength : 30
    }, 
    email : {
        type : String,
        trim : true, //스페이스를 없애주는 역할 rma 12@naver.com -> rma12@naver.com
        unique : 1   //email이 유니크키
    },
    password : {
        type : String,
        minlength : 5
    },
    lastname : {
        type : String, 
        maxlength : 50
    },
    role:{
        //어떤 유저가 관리자, 일반 유저가 될 수 있으므로 역할을 줌
        //number : 1 관리자 / 0이면 일반유저
        type : Number,
        default : 0 //만약 숫자를 부여하지 않으면 기본으로 0을 할당
    },
    image : String,
    token : {
        //토큰을 사용하여 유효성을 관리함
        type : String
    },
    tokenExp : {
        // 토큰의 유효기간
        type : Number 
    }
})

// 3. 생성된 스키마를 모델로 감싸준다. (모델명, 스키마)
const User = mongoose.model('User', userSchema)

// 4. 이 모델을 다른 곳에서도 쓸 수 있게 export
module.exports = {User}