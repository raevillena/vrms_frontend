import React, {useEffect, useState} from 'react';
import { BrowserRouter, Switch, Redirect, Route } from "react-router-dom";  
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
import {Spin} from 'antd'
import ManagerStudyDash from '@pages/Study';
import PageNotFound from '@pages/PageNotFound';
import {io} from 'socket.io-client'

export const socket = io("http://nberic.org:3002")

function App() {
  const dispatch = useDispatch();
  const authObj = useSelector(state => state.auth)
  const errorObj = useSelector(state => state.error)
  const [loading, setLoading] = useState(true)
  const socketObj = useSelector(state => state.socket)
  let socket = socketObj.SOCKET
  
  

  const {AUTHENTICATED}  = authObj
 //authentication for public and private route
  useEffect(() => {
    async function verify() {
      setLoading(true)
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
    setLoading(false)
}, [errorObj])


//to renew acesstoken
useEffect(()=>{
  async function renew(){
    setLoading(true)
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
setLoading(false)
}, [errorObj, dispatch])

useEffect(() => {
  if(loading === true){
    return <Spin style={{display: 'flex', justifyContent:'center', padding: '25%'}} />
  } 
}, [loading])

useEffect(() => {
  const s = io("http://localhost:3002")
  dispatch({
    type: "SET_SOCKET",
    value: s
  })
  return () =>{
    socket.disconnect()
  }
}, [])


  return (
    <BrowserRouter>
    <Switch>
      <PublicRoute path="/" exact component={Login} isAuthenticated={AUTHENTICATED}  />
      <PublicRoute path="/forgotpassword" exact component={ForgotPassword} isAuthenticated={AUTHENTICATED}/>
      <PublicRoute path="/reset-password/" exact component={ResetPassword} isAuthenticated={AUTHENTICATED}/>
      <PublicRoute path="/secretcreateuser" exact component={Signup} isAuthenticated={AUTHENTICATED}  />
      <PrivateRoute path="/dash" exact component={Userdash} isAuthenticated={AUTHENTICATED} />
      <PrivateRoute path="/studies" exact component={ManagerStudyDash} isAuthenticated={AUTHENTICATED} />
      <PrivateRoute path="/editstudy" exact component={StudyDash} isAuthenticated={AUTHENTICATED}/>
      <PrivateRoute path="/account" exact component={Account} isAuthenticated={AUTHENTICATED}/>
      <Route path='*'>
       <PageNotFound/>
      </Route>
      <Redirect to={AUTHENTICATED ? `/${window.location.pathname}` : '/'} />
    </Switch>
    </BrowserRouter> 
  );
}

export default App;
