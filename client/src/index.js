import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import 'antd/dist/antd.css';
import {Provider} from 'react-redux'
import { applyMiddleware, createStore } from 'redux';
// react-redux의 provider로 app을 감싸면, react-redux를 사용할 수 있는 상태가 됨

import Reducer from './_reducers/index';  //리듀서 가져오기

import promiseMiddleware from 'redux-promise';
import ReduxThunk from 'redux-thunk';
// 미들웨어를 이용해야지, 객체 이외의 형태의 액션을 받아 사용할 수 있음
// applyMiddleware에 (프로미스, 떵크를 가져와서 넣음)
//(createStore:원래는 스토어를 리덕스에서 생성을 하는 거지만, 
//그냥 store는 객체밖에 못받기 때문에 함수, 프로미스를 받는 미들웨어와 함께 여러 개를 받을 수 있는 store를 생성함)
const createStoreMiddleware = applyMiddleware(promiseMiddleware, ReduxThunk)(createStore);

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


