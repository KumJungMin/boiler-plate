import React, {useState} from 'react'
import {useDispatch} from 'react-redux';  //1redux를 이용하여 서버와 통신하기
import {loginUser} from '../../../_actions/user_action'
import { withRouter } from 'react-router-dom';
// withRouter 를 사용하면 컴포넌트 프로퍼티로 라우터의 history 를 얻을 수 있다.
function LoginPage(props) {
    const dispatch = useDispatch();      //2dispatch기능을 사용하겠당

    // 컴포넌트안에서 데이터를 변화시킬 때는 state사용
    // email, pw를 위한 state생성
    const [email, setEmail] = useState("");
    const [pw, setPw] = useState("");

    const onEmailHandler =(event)=>{setEmail(event.currentTarget.value)}
    // event.currentTarget.value = 이벤트가 일어난 -> 타겟(input)의 value값
    const onPwHandler =(event)=>{setPw(event.currentTarget.value)}
    const onSubmitHandler =(event)=>{
        event.preventDefault();  //페이지리프레시 막기

        // client가 가지고 있는 state값을 서버에 보내는 코드
        // login api에서 email, password가 맞는지 체크함
        let body = {
            email : email,
            password : pw
        }

        // 3.dispatch(액션명(전달값)) -actions>user_action.js에서 정의한 액션임
        dispatch(loginUser(body))
        .then(response=>{
            if(response.payload.loginSuccess){
                props.history.push('/')  //위치를 렌딩으로 가게하자.
                // 렌딩페이지로 이동시키기(리액트문법)
            }else{
                alert('error')
            }
        })
        
        
     }


    return (
        <div style={{
            display : 'flex', justifyContent : 'center', alignItems :'center',
            width : '100%', height : '100vh'
        }}>
            <form style={{display:'flex', flexDirection : 'column'}}
            onSubmit={onSubmitHandler}
            >
                {/* 빈칸에 타이핑을 하면 -> state이 변경(onChange) -> 빈칸에 value값이 나타나는 로직 */}
                <label>Email</label>
                <input type="email" value={email} onChange={onEmailHandler}/>
                <label>Password</label>
                <input type="password" value={pw} onChange={onPwHandler}/>
                <br/>
                <button>
                    Login
                </button>
            </form>
            
        </div>
    )
}

export default withRouter(LoginPage)
