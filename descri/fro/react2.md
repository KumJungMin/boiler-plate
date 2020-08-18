# 2. react로 프론트엔드 개발하기(2), login 기능
*이 내용은 인프런의 '따라하며 배우는 노드 리액트 기초 강의'를 학습한 자료입니다.*




<img src="./1.png" />

## 0) index.js

- (1) `applyMiddleware, createStore` : react-redux의 provider로 app을 감싸면, react-redux를 사용할 수 있는 상태가 된다.

- (2) `Reducer` : 리듀서 폴더에서 정의했던 리듀서를 가져온다.

- (3) `applyMiddleware(promiseMiddleware, ReduxThunk)(createStore)` : 미들웨어를 이용해야 객체 이외의 형태의 액션을 받아 사용할 수 있다.

- (3-1) `createStore`: 원래는 스토어를 리덕스에서 생성을 하지만, store는 객체만 받기에 함수, 프로미스 등을 받을 수 있는 store를 생성한다.


```js
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import 'antd/dist/antd.css';
import {Provider} from 'react-redux'                    //(1)
import { applyMiddleware, createStore } from 'redux';
import Reducer from './_reducers/index';                //(2)
import promiseMiddleware from 'redux-promise';
import ReduxThunk from 'redux-thunk';

// applyMiddleware에 (프로미스, 떵크)
const createStoreMiddleware = applyMiddleware(promiseMiddleware, ReduxThunk)(createStore);    //(3) (3-1)

ReactDOM.render(
  // {createStoreMiddleware는 미들웨어를 겸비한 store-> 이 안에는 reducer를 괄호(인자)에 넣어야함}
    <Provider store={createStoreMiddleware(Reducer,
      window.__REDUX_DEVTOOLS_EXTENSTION__ &&
      window.__REDUX_DEVTOOLS_EXTENSTION__()
    //두번째 인자로 extension넣기(리덕스를 편하게 쓰게 하는 툴을 추가(구글에서 먼저redux-devtool을 설치
    )}> 
      <App />
    </Provider>,
  document.getElementById('root')
);

serviceWorker.unregister();
```

<br/>


## 1) App.js
### (1) 라우터 생성하기
- 라우터를 생성하기 위해, 각각의 컴포넌트를 import한다.
- react-router-dom을 이용하여 라우터를 생성한다.

```js
import React from 'react';
import './App.css';
import {BrowserRouter as Router, Switch, Route, Link} from 'react-router-dom';
import LandingPage from './components/views/LandingPage/LandingPage'
import LoginPage from './components/views/LoginPage/LoginPage'
import RegisterPage from './components/views/RegisterPage/RegisterPage'

function App() {
  return (
    <div className="App">
      <Router>
          <Switch>
            <Route exact path="/"><LandingPage/></Route>
            {/* <Route exact path="/" component={LandingPage}></Route> */}
            <Route exact path="/login"><LoginPage/></Route>
            <Route exact path="/register"><RegisterPage/></Route>
          </Switch>  
      </Router>      
    </div>
  );
}

export default App;

```

<br/>

## 2) LoginPage.js 생성

- (1) `useState` : state의 변화를 주기 위해 사용한다.
- (2) `useDispatch` : redux를 이용하여 서버와 통신을 위해 라이브러리를 가져온다.
- (3) `loginUser` : action 함수가 정의된 공간
- (4) `withRouter` : withRouter를 사용하면 컴포넌트 프로퍼티로 라우터의 history를 얻을 수 있다.
```js
import React, {useState} from 'react'                         //(1)
import {useDispatch} from 'react-redux';                      //(2)    
import {loginUser} from '../../../_actions/user_action';      //(3)  
import { withRouter } from 'react-router-dom';                //(4)  
```

<br/>

- (1-1) 컴포넌트안에서 데이터를 변화시킬 때는 state사용, email, pw를 위한 state생
- (2-1) `const dispatch = useDispatch()` : dispatch기능을 사용하겠다.(dispatch는 값변화를 감지하여 적용시킴)
- (5) `event.currentTarget.value` :  이벤트가 일어난 -> 타겟(input)의 value값

```js
function LoginPage(props) {
    const dispatch = useDispatch();                         //(2-1)

    const [email, setEmail] = useState("");                 //(1-1)
    const [pw, setPw] = useState("");

    const onEmailHandler =(event)=>{setEmail(event.currentTarget.value)}      //(5)
    const onPwHandler =(event)=>{setPw(event.currentTarget.value)}
    const onSubmitHandler =(event)=>{
        event.preventDefault();  //페이지리프레시 막기

        // client가 가지고 있는 state값을 서버에 보내는 코드
        // login api에서 email, password가 맞는지 체크함
        let body = {
            email : email,
            password : pw
        }
```

<br/>

- (2-2) `dispatch(액션명(전달값))` : actions>user_action.js에서 정의한 액션이다.
- (4-1) `props.history.push('/')` :  위치를 렌딩페이지로 가게하자.

```js
        dispatch(loginUser(body))                                           //(2-2)
        .then(response=>{
            if(response.payload.loginSuccess){
                props.history.push('/')                                     //(4-1)
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

```

<br/>


## 3) action 만들기
### (1) action/types.js
- 액션 타입을 따로 정의해둔다.
```js
export const LOGIN_USER = "login_user";
export const REGISTER_USER = "register_user";
export const AUTH_USER = "auth_user";
```

<br/>

### (2) action/user_action.js
- 액션함수 만든다.

- (1) `loginUser(dataToSubmit)` : dataToSubmit에는 객체형태의 {email,pw}값이 들어옴|body

- (2) `axios.post('/api/users/login', dataToSubmit)` : 액션함수 내에서 axios를 통한 서버와의 통신을 처리한다.

- (3) `return{type :..., payload:...}` : 리듀서는 현재의 상태와 전달 받은 액션을 참고하여 새로운 상태를 만들어서 반환한다.

```js
import axios from 'axios';

export function loginUser(dataToSubmit){                            //(1)
    const request = axios.post('/api/users/login', dataToSubmit)    //(2)
    .then(response => response.data);         //request는 서버에서 json으로 send했던 메시지를 저장함
    
    return{                                                       //(3)
        //(액션은 type, response(payload==state)를 넣어줘야함)
        //이 값들을 _reducer>user_reducer로 보냄
        type : "LOGIN_USER",   //action.type
        payload : request
    }
}

```
<br/>

## 4) reducer 만들기
### (1) reducer/user_reducer.js
- 액션의 타입별로 다른 조치를 취하게 한다.

- (1) `switch (action.type)`: action 폴더에 types.js안에 액션이름들을 정의되어 있다.
```js
import {
    LOGIN_USER,
    REGISTER_USER,
    AUTH_USER
} from '../_actions/types';

export default function(state={}, action){
    switch (action.type){                   //(1)
        case LOGIN_USER:
            return {...state, loginSuccess : action.payload}   
            //loginSuccess는 login api에서 성공시 
            //-> 클라이언트에게 보내주는(send(json))해주는 속성값 -> 성공시 true임
            break;

        default:
            return state;
    }
}
```

<br/>

### (2) reducer/index.js
- (1) `combineReducers` 

  : store안에 여러 개의 리듀서가 존재할 수 있다.
  
  : 왜 리듀서가 여러개 일 수 있을까? 유저, 구독, 글쓰기 리듀서 등 특징별로 여러 개의 리듀서를 작성해 관리하기 때문!
  
  : 이 여러개의 리듀서를 combine리듀서를 이용하여 -> root리듀서에서 하나로 합쳐준다.

```js
import {combineReducers} from 'redux';            //(1)
import user from './user_reducer';


const rootReducer = combineReducers({
    //정의한 여러 개의 리듀서를 적음
    user
})

export default rootReducer;
```



<br/><br/><br/>

-----

#### node를 이용하여 backend 구축하기

- <a href="https://github.com/KumJungMin/boiler-plate/blob/master/descri/node1.md"> 사전설정하기 </a>

- <a href="https://github.com/KumJungMin/boiler-plate/blob/master/descri/node2.md"> 회원가입만들기 </a>

- <a href="https://github.com/KumJungMin/boiler-plate/blob/master/descri/node3.md"> 비밀번호 암호화하기 </a>

- <a href="https://github.com/KumJungMin/boiler-plate/blob/master/descri/node4.md"> 로그인 기능 만들기 </a>

- <a href="https://github.com/KumJungMin/boiler-plate/blob/master/descri/node5.md"> 권한설정 하기 </a>

- <a href="https://github.com/KumJungMin/boiler-plate/blob/master/descri/node6.md"> 로그아웃만들기 </a>

<br/>

#### react를 이용하여 frontend 구축하기

- <a href="https://github.com/KumJungMin/boiler-plate/blob/master/descri/fro/react1.md"> 사전설정하기 </a>

- <a href="https://github.com/KumJungMin/boiler-plate/blob/master/descri/fro/react2.md"> 로그인만들기 </a>

- <a href="https://github.com/KumJungMin/boiler-plate/blob/master/descri/fro/react3.md"> 회원가입만들기 </a>

- <a href="https://github.com/KumJungMin/boiler-plate/blob/master/descri/fro/react4.md"> 로그아웃만들기 </a>

- <a href="https://github.com/KumJungMin/boiler-plate/blob/master/descri/fro/react5.md"> 인증만들기 </a>
