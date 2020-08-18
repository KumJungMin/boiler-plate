import axios from 'axios';

// 액션함수 만들기
export function loginUser(dataToSubmit){  //dataToSubmit에는 객체형태의 {email,pw}값이 들어옴
// 4.액션함수 내에서 axios를 통한 서버와의 통신을 처리
    const request = axios.post('/api/users/login', dataToSubmit)  
    .then(response => response.data);
    //request는 서버에서 json으로 send했던 메시지를 저장함

    // 5. request를 리듀서에 넘겨준다.
    // 리듀서는 이전 state값과 액션을 받아 -> 다음 state를 리턴한다.
    //변화를 일으키는 함수입니다. 리듀서는 두가지의 파라미터를 받아옵니다. 
    //리듀서는, 현재의 상태와, 전달 받은 액션을 참고하여 새로운 상태를 만들어서 반환합니다
    //(액션은 type, response(payload==state)를 넣어줘야함)
    return{
        //이 값들을 _reducer>user_reducer로 보냄
        type : "LOGIN_USER",   //action.type
        payload : request
    }
}


export function registerUser(dataToSubmit) {

    const request = axios.post('/api/users/register', dataToSubmit)
        .then(response => response.data)

    return {
        type: REGISTER_USER,
        payload: request
    }
}



export function auth() {

    const request = axios.get('/api/users/auth')
        .then(response => response.data)

    return {
        type: AUTH_USER,
        payload: request
    }
}

