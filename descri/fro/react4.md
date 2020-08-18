# 2. react로 프론트엔드 개발하기(3), 로그아웃 기능
*이 내용은 인프런의 '따라하며 배우는 노드 리액트 기초 강의'를 학습한 자료입니다.*




<img src="./3.png" />

## 1) LandingPage.js 생성
- (1) `<button onClick={onClickHandler}>` : 로그아웃 버튼을 만든다.
- (2) `axios.get(`/api/users/logout`)` : 로그아웃 버튼 클릭시 axios를 통해 통신하게 한다.
- (3) `props.history.push("/login")` : 로그아웃 성공시 login페이지로 redirect한다.

```js
import React, { useEffect } from 'react'
import axios from 'axios';
import { withRouter } from 'react-router-dom'; 
function LandingPage(props) {

    useEffect(() => {
        axios.get('/api/hello')
            .then(response => { console.log(response) })
    }, [])


    const onClickHandler = () => {
        axios.get(`/api/users/logout`)                    //(2)
            .then(response => { 
                if (response.data.success) {  
                    props.history.push("/login")          //(3)
                } else {
                    alert('로그아웃 하는데 실패 했습니다.')
                }
            })
    }

    return (
        <div style={{
            display: 'flex', justifyContent: 'center', alignItems: 'center'
            , width: '100%', height: '100vh'
        }}>
            <h2>시작 페이지</h2>

            <button onClick={onClickHandler}>             //(1)
                로그아웃
            </button>

        </div>
    )
}

export default withRouter(LandingPage)
```


