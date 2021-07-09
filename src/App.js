import React, {useEffect} from 'react';
import { BrowserRouter, Switch, Redirect } from "react-router-dom";  
import { useSelector, useDispatch } from 'react-redux';
import LoginPage from '@pages/Login';
import Userdash from '@pages/Userdash';
import DataGrid from '@pages/DataGrid';
import PrivateRoute from '@routes/privateRoute';
import PublicRoute from '@routes/publicRoute';
import {verifyAuth} from '@services/authAPI'
import Account from '@pages/Account'
import Signup from '@pages/Signup';
import ForgotPassword from '@pages/Forgotpassword';
import ResetPassword from '@pages/NewPassword'
import CreateStudy from '@pages/Study'
import CreateProject from '@pages/Project'
import { onRenewToken } from './services/authAPI';

function App() {
  const dispatch = useDispatch();
  const authObj = useSelector(state => state.auth)
  const errorObj = useSelector(state => state.errorReducer)
  console.log(errorObj)
  
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
      } else {
        dispatch({
          type: "VERIFIED_AUTHENTICATION",
          value: true
       })
      }
     
    }
    verify()
}, [])


//to renew acesstoken
useEffect(()=>{
  async function renew(){
  let token = {refreshToken : localStorage.getItem("refreshToken")}
   console.log('updating access token')
  let result = await onRenewToken(token)

   if (result.status === 200) {
     localStorage.setItem("accessToken", result.data.accessToken);
     console.log("access token updated")
     dispatch({
       type: "SET_USER",
       value: result.data.user.user
     })
     dispatch({
      type: "VERIFIED_AUTHENTICATION",
      value: true
   })
  }else {
    console.log('auth')
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
      <PublicRoute path="/" exact component={LoginPage} isAuthenticated={AUTHENTICATED}  />
      <PublicRoute path="/forgotpassword" exact component={ForgotPassword} isAuthenticated={AUTHENTICATED}/>
      <PublicRoute path="/createstudy" exact component={CreateStudy} isAuthenticated={AUTHENTICATED}/>
      <PublicRoute path="/createproject" exact component={CreateProject} isAuthenticated={AUTHENTICATED}/>
      <PublicRoute path="/reset-password/" exact component={ResetPassword} isAuthenticated={AUTHENTICATED}/>
      <PublicRoute path="/secretcreateuser" exact component={Signup} isAuthenticated={AUTHENTICATED}  />
      <PrivateRoute path="/dash" exact component={Userdash} isAuthenticated={AUTHENTICATED} />
      <PrivateRoute path="/datagrid" exact component={DataGrid} isAuthenticated={AUTHENTICATED}/>
      <PrivateRoute path="/account" exact component={Account} isAuthenticated={AUTHENTICATED}/>
      <Redirect to={AUTHENTICATED ? '/dash' : '/'} />
    </Switch>
    </BrowserRouter>
  );
}

export default App;
