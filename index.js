const express = require('express')  //express모듈 가져오기
const app = express()               //새로운 express 앱 생성
const port = 5000                   //포트번호

// mongodb+srv://rmawjdals:<password>@cluster0.bryx4.mongodb.net/<dbname>?retryWrites=true&w=majority
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://rmawjdals:1234@cluster0.bryx4.mongodb.net/<dbname>?retryWrites=true&w=majority',{
    useNewUrlParser : true, useUnifiedTopology : true, useCreateIndex : true, useFindAndModify : false
}).then(()=>console.log("mongoDB is connected"))
.catch((err)=> console.log("failed", err))
// then 연결이 잘 됐는지 확인
//catch 오류가 있을 시

app.get('/', (req, res) => {        //app에 /루트디렉토리롤 오면 -> hello world를 출력
  res.send('Hello World!')
})

app.listen(port, () => {            //5000번 포트에서 실행
  console.log(`Example app listening at http://localhost:${port}`)
})