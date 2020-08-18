//모델, 스키마 구축하기
// 1. 몽구스 가져오기
const mongoose = require('mongoose');

const jwt = require('jsonwebtoken');

//비밀번호 암호화를 위해 bcrypt, salt가져오기
const bcrypt = require('bcrypt');
const saltRounds = 10; 
//salt를 이용하여 비밀번호를 암호화해야함|saltRounds는 salt가 몇글자인지 나타냄
//saltRounds = 10이라는 말은, 10자리 솔트를 만들어서 -> 이 솔트로 비밀번호를 암호화한다.


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

//user모델의 유저 정보를 저장하기 전에(ndex.js에서 user.save()하기 전에) function작성을 한다.
userSchema.pre('save', function(next){
    var user = this;  //this는 userSchema를 가리킴
        // function 작성을 한 후에, index.js의 user.save()코드 부분으로 가서, save 코드를 진행
        //비밀번호를 암호화시킨다.(bcrypt사용)
    //model안의 password를 변경할때만 -> 비밀번호를 암호화한다.(이메일 변경시에는 비밀번호 암호화를 하지 않게 함)
    if(user.isModified('password')){
        bcrypt.genSalt(saltRounds, function(err, salt) { //솔트만들기
            if(err) return next(err);   //err가 나면 -> next():index의 user.save()코드로 감

            // 솔트를 제대로 생성했다면(error가 나지 않았다면?)
            //myPlaintextPassword(user.password)는 암호화되기 전의 비밀번호
            bcrypt.hash(user.password, salt, function(err, hash) {  //err에러, hash암호화된 비밀번호
                if(err) return next(err);
                user.password = hash;   //유저 비밀번호를 hash값으로 변경
                next();                 //변경 후에는 next를 해서 index.js의 user.save()코드로 돌아감
            });
        });
    }
    //만약 비밀번호를 바꾸는 게 아니라면?
    else{
        next(); //원래대로 진행
    }  
})  


//로그인을 위해, 비밀번호를 비교하는 comparePassword(비번, 콜백함수)라는 생성한 메소드
// plainPassword는 화면에서 입력한 값
// db에 있는 암호화된 비밀번호
userSchema.methods.comparePassword = function(plainPassword, cb){
//현재 db에 저장된 비밀번호는 암호화된 상태
//입력한 비밀번호를 -> 암호화하여 -> db에 저장된 암호화된 비밀번호와 비교해야함
//compare(입력한 비번, db에 저장된 암호화된 비번)
    bcrypt.compare(plainPassword, this.password, function(err, isMatch){
        if(err) return cb(err);
        cb(null, isMatch); //만약 일치한다면->콜백(err=null, isMatch=true)
    })
}

// 토큰을 생성하는 메소드 
userSchema.methods.generateToken = function(cb){
    //json web token을 이용하여 토큰을 생성하기
    var user = this;
    var token = jwt.sign(user._id.toHexString(), 'secertToken')
    //user._id + secertToken을 합쳐서 -> token을 만드는 코드
    //secertToken을 가지고 -> user._id를 알 수 있음
    user.token = token
    user.save(function(err, user){
        if(err) return cb(err);
        cb(null, user);  
        //error가 없다면 -> err=null, user정보를 보냄 
        //-> 이 user정보가 index.js의 generateToken의 user매개변수로 들어감
        
    })
}

userSchema.statics.findByToken = function(token, cb){
    var user = this;
    // 복호화과정
    jwt.verify(token, 'secertToken', function(err, decoded){ //decoded된 것은 유저id
        //유저 아이디를 이용하여 -> 유저를 찾고 
        //클라이언트에서 가져온 토큰과 db에 보관된 토큰이 일치하는 지 확인
        user.findOne({"_id" : decoded, "token" : token}, function(err, user){
            if(err) return cb(err);
            cb(null, user);
        })
    })
}


// 3. 생성된 스키마를 모델로 감싸준다. (모델명, 스키마)
const User = mongoose.model('User', userSchema)

// 4. 이 모델을 다른 곳에서도 쓸 수 있게 export
module.exports = {User}