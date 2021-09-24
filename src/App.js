import React, {useEffect} from 'react';
import { BrowserRouter, Switch, Route } from "react-router-dom";  
import { useSelector, useDispatch } from 'react-redux';
import Login from '@pages/Login';
import Userdash from '@pages/Userdash';
import StudyDash from '@pages/StudyDash';
import PrivateRoute from '@routes/privateRoute';
import PublicRoute from '@routes/publicRoute';
import {verifyAuth} from '@services/authAPI'
import Account from '@pages/Account'
import Signup from '@pages/Signup';
import ForgotPassword from '@pages/Forgotpassword';
import ResetPassword from '@pages/NewPassword'
import { onRenewToken } from './services/authAPI';
import ManagerStudyDash from '@pages/Study';
import PageNotFound from '@pages/PageNotFound';




function App() {
  const dispatch = useDispatch();
  const authObj = useSelector(state => state.auth)
  const errorObj = useSelector(state => state.error)
  
  

  const {AUTHENTICATED}  = authObj
 //authentication for public and private route
  useEffect(() => {
    async function verify() {
      let result = await verifyAuth()
      if (result.error) {
        dispatch({
          type: "VERIFIED_AUTHENTICATION",
          value: false
       })
        return
      } else {
        dispatch({
          type: "VERIFIED_AUTHENTICATION",
          value: true
       })
      }
     return
    }
    verify()
}, [errorObj])


//to renew acesstoken
useEffect(()=>{
  async function renew(){
  let token = {refreshToken : localStorage.getItem("refreshToken")}
  let result = await onRenewToken(token)

   if (result.status === 200) {
     localStorage.setItem("accessToken", result.data.accessToken);
     dispatch({
       type: "SET_USER",
       value: result.data.user.user
     })
     dispatch({
      type: "VERIFIED_AUTHENTICATION",
      value: true
   })
  }else {
     dispatch({
       type: "AUTH_ERROR"
     })
 }
}
renew()
}, [errorObj])




  return (
    <BrowserRouter>
    <Switch>
      <PublicRoute path="/login" exact component={Login} isAuthenticated={AUTHENTICATED}  />
      <PublicRoute path="/forgotpassword" exact component={ForgotPassword} isAuthenticated={AUTHENTICATED}/>
      <PublicRoute path="/reset-password/" exact component={ResetPassword} isAuthenticated={AUTHENTICATED}/>
      <PublicRoute path="/secretcreateuser" exact component={Signup} isAuthenticated={AUTHENTICATED}  />
      <PrivateRoute path="/" exact component={Userdash} isAuthenticated={AUTHENTICATED} />
      <PrivateRoute path="/studies" exact component={ManagerStudyDash} isAuthenticated={AUTHENTICATED} />
      <PrivateRoute path="/editstudy" exact component={StudyDash} isAuthenticated={AUTHENTICATED}/>
      <PrivateRoute path="/account" exact component={Account} isAuthenticated={AUTHENTICATED}/>
      <Route path='*'>
        <PageNotFound/>
      </Route>
    </Switch>
    </BrowserRouter> 
  );
}

export default App;
