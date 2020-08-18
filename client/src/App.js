import React from 'react';
import './App.css';
import {BrowserRouter as Router, Switch, Route, Link} from 'react-router-dom';
import LandingPage from './components/views/LandingPage/LandingPage'
import LoginPage from './components/views/LoginPage/LoginPage'
import RegisterPage from './components/views/RegisterPage/RegisterPage'
// hoc적용하기
import Auth from './hoc/auth'

function App() {
  return (
    <div className="App">
      <Router>
          <Switch>
            {/* component를 auth로 감싸주는 됨 
            function (SpecificComponent, option, adminRouter = null)
            
            Auth(컴포넌트, 옵션) */}
            {/* <Route exact path="/"><LandingPage/></Route> */}
            <Route exact path="/" component={Auth(LandingPage, null)}></Route>
            <Route exact path="/login" component={Auth(LoginPage, false)}></Route>
            <Route exact path="/register" component={Auth(RegisterPage, false)}></Route>
            {/* <Route exact path="/login"><LoginPage/></Route>
            <Route exact path="/register"><RegisterPage/></Route> */}
          </Switch>  
      </Router>      
    </div>
  );
}

export default App;
