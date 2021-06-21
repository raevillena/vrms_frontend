import React, {useState, useEffect} from 'react';
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";  
import { useSelector, useDispatch, Provider } from 'react-redux';
import LoginPage from '@pages/Login';
import Userdash from '@pages/Userdash';
import DataGrid from '@pages/DataGrid';
import PrivateRoute from '@routes/privateRoute';
import PublicRoute from '@routes/publicRoute';
import {verifyAuth} from '@services/authAPI'
import { useHistory } from 'react-router-dom';
import Account from '@pages/Account'
import userReducer from './reducers/userReducer';

function App() {
  let history= useHistory();
  const dispatch = useDispatch();
  const authObj = useSelector(state => state.auth)
  const userObj = useSelector(state => state.userReducer)
  const {AUTHENTICATED}  = authObj
  const {USER} = userObj
 
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


  return (

    <BrowserRouter>
    
    <Switch>
      <PublicRoute path="/" exact component={LoginPage} isAuthenticated={AUTHENTICATED} user={USER} />
      <PrivateRoute path="/dash" exact component={Userdash} isAuthenticated={AUTHENTICATED} user={USER}/>
      <PrivateRoute path="/datagrid" exact component={DataGrid} isAuthenticated={AUTHENTICATED}user={USER}/>
      <PrivateRoute path="/account" exact component={Account} isAuthenticated={AUTHENTICATED} user={USER}/>
      <Redirect to={AUTHENTICATED ? '/dash' : '/'} />
    </Switch>
 
    </BrowserRouter>

  );
}

export default App;
