import React, {useEffect} from 'react';
import Axios from 'axios';
import {useDispatch} from 'react-redux';
import {auth} from '../_actions/user_action'

export default function (SpecificComponent, option, adminRouter = null){
    //option : null(아무나 출입이 가능한 페이지다!), true(로그인한 유저만 출입이 가능한 페이지), 
    //false(로그인한 유저는 출입불가능한 페이지)라는 옵션이 있음
    //adminRouter 어드민 유저만 들어가길 원하는 페이지면 -> true라고 함

    function AuthenticationCheck(props){
        const dispatch = useDispatch();
        useEffect(()=>{
            //1. 백엔드에 request를 날려서, 현재 사용자의 상태정보를 받는다. 
            
            //dispatch로 액션을 리듀서에게 날림
            dispatch(auth()).then(response=>{
                // response에서는 백엔드api에서 처리하고 clinet에게 보낸 정보가 들어있음 
                // reponse정보를 이용하여 분기처리를 진행한다.

                // 로그인하지 않은 상태
                if(!response.payload.isAuth){
                    if(option){  //option==true -> 로그인한 유저만 출입가능한 곳에 접근할시
                        props.history.push('/login'); //로그인페이지로 보내버림
                    }

                }else{
                    // 로그인한 상태
                    if(adminRouter && !response.payload.isAdmin){
                        // 어드민만 들어갈 수 잇는 페이지에 && 어드민이 아닌 사람이 들어온다면?
                        props.history.push('/'); 
                    }else{
                        if(option == false){
                            // 로그인한 유저가 로그인하지 않은 유저가 들어갈 수 있는 페이지(ㅚ원가입, 로그인)에 들어가려고 할 떄
                            props.history.push('/'); 
                        }
                    }
                }
            })

            
            // node auth에서는 middleware에 auth함수가 있음
            //해당 함수에서 토큰을 발행하고 인증처리함-> 그리고 client에게 인증여부를 보냄
            // Axios.get('/api/users/auth')
            

        })
        return(
            <SpecificComponent/>
        );
    }

    return AuthenticationCheck
}