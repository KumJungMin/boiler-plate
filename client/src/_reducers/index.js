//combineReducers 
//: store안에 여러 개의 리듀서가 존재할 수 있음(리듀서는 state으 변화를 보고 -> 마지막 값을 리턴해줌)
//->왜 리듀서가 여러개 일 수 있을까? -> 유저 리듀서, 구독 리듀서, 글쓰기 리듀서 등 특징별로 여러 개의 리듀서를 작성해 관리하므로
//이 여러개의 리듀서를 combine리듀서를 이용하여 -> root리듀서에서 하나로 합쳐줌

import {combineReducers} from 'redux';
import user from './user_reducer';


const rootReducer = combineReducers({
    //정의한 여러 개의 리듀서를 적음
    user
    //write
})

export default rootReducer;