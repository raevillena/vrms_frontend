import React, {useEffect} from 'react';
import { BrowserRouter, Switch, Route } from "react-router-dom";  
import { useSelector, useDispatch } from 'react-redux';
import Login from '@pages/Login';
import Userdash from '@pages/Userdash';
import StudyDash from '@pages/StudyDash';
import PrivateRoute from '@routes/privateRoute';
import PublicRoute from '@routes/publicRoute';
import Account from '@pages/Account'
import ForgotPassword from '@pages/Forgotpassword';
import ResetPassword from '@pages/NewPassword'
import { onRenewToken } from '@/services/authAPI';
import ManagerStudyDash from '@pages/Study';
import PageNotFound from '@pages/PageNotFound';
import DirectorMonitor from '@pages/DirectorMonitor';
import Users from'./admin/users'
import Programs from './admin/programs';
import Datagrids from './admin/datagrids';
import Tasks from './admin/tasks';
import Projects from './admin/projects';
import Studies from './admin/studies';
import Files from './admin/files'

function App() {
  const dispatch = useDispatch();
  const authObj = useSelector(state => state.auth)
  
  /*
  //authentication for public and private route
  useEffect(() => {
    console.log("entering verify...")
    async function verify() {
      dispatch({
        type: "VERIFY_LOADING"
      })
      let result = await verifyAuth(authObj.accessToken, authObj.refreshToken)
      console.log("RESULT FROM VERIFY: ", result)
      if (result.error) {
        dispatch({
          type: "VERIFY_ERROR",
        })
      } else {
        dispatch({
          type: "VERIFY_SUCCESS",
          value: true
       })
      }
      console.log("exiting verify...")
      return
    }
    verify()
  }, [])
  */

  
  //to renew acesstoken
  useEffect(()=>{
    async function renew(){
      let token = {refreshToken : localStorage.getItem("refreshToken")}
      dispatch({
        type: "RENEW_LOADING",
        LOADING: true
      })
      let result = null
      
      try{
        result = await onRenewToken(token)
        if (result.status === 200) {
          localStorage.setItem("accessToken", result.data.accessToken);
          dispatch({
            type: "SET_USER",
            value: result.data.user.user,
            LOADING: true
          })
          dispatch({
            type: "RENEW_SUCCESS",
            AUTHENTICATED: true,
            accessToken: result.data.accessToken,
            LOADING: false
          })
        }
      }catch(err){
        //RENDER NOTIF HERE or handle appropriately
        dispatch({
          type: "RENEW_ERROR",
          payload: err
        })
      }
    }
    renew()
    const interval = setInterval(() => {
      renew()
    }, 3600000);//perform refresh at every hour or UPDATE based on the set expiration time, it must be renewed just before it expires
    return () => clearInterval(interval);
  }, [])

  

  //refresh token before it expires
  //this prevents the app from getting 401 error due to expired tokens
  //401s due to expired token can be bad UX as user can use the web app without page reload
  //thus not refreshing the token.

  return (
    <BrowserRouter>
    <Switch>
      <PublicRoute path="/login" exact component={Login} auth={authObj} />
      <PublicRoute path="/forgotpassword" exact component={ForgotPassword} auth={authObj}/>
      <PublicRoute path="/reset-password/" exact component={ResetPassword} auth={authObj}/>
      <PrivateRoute path="/" exact component={Userdash} auth={authObj} />
      <PrivateRoute path="/monitor" exact component={DirectorMonitor} auth={authObj} />
      <PrivateRoute path="/studies" exact component={ManagerStudyDash} auth={authObj} />
      <PrivateRoute path="/editstudy" exact component={StudyDash} auth={authObj}/>
      <PrivateRoute path="/account" exact component={Account} auth={authObj}/>
      <PrivateRoute path="/admin/users" exact component={Users} auth={authObj}/>
      <PrivateRoute path="/admin/programs" exact component={Programs} auth={authObj}/>
      <PrivateRoute path="/admin/projects" exact component={Projects} auth={authObj}/>
      <PrivateRoute path="/admin/studies" exact component={Studies} auth={authObj}/>
      <PrivateRoute path="/admin/tasks" exact component={Tasks} auth={authObj}/>
      <PrivateRoute path="/admin/datagrids" exact component={Datagrids} auth={authObj}/>
      <PrivateRoute path="/admin/files" exact component={Files} auth={authObj}/>
      <Route path='*'>
        <PageNotFound/>
      </Route>
    </Switch>
    </BrowserRouter> 
  );
}

export default App;
