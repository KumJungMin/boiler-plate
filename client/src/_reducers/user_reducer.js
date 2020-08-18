import {
    LOGIN_USER,
    REGISTER_USER,
    AUTH_USER
} from '../_actions/types';
//리듀서는, 현재의 상태와, 전달 받은 액션을 참고하여 새로운 상태를 만들어서 반환합니다

export default function(state={}, action){
    // 액션의 타입별로 다른 조치를 취하게 함
    switch (action.type){
        // action 폴더에 types.js안에 액션이름들을 정의해두자
        //
        case LOGIN_USER:
            return {...state, loginSuccess : action.payload}   
            //loginSuccess는 login api에서 성공시 -> 클라이언트에게 보내주는(send(json))해주는 속성값 -> 성공시 true임
            break;
        case REGISTER_USER:
            return { ...state, register: action.payload }
            break;
        case AUTH_USER:
            return { ...state, userData: action.payload }
            break;
        default:
            return state;


    }
}