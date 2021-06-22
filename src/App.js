import React, {useState, useEffect} from 'react';
import { BrowserRouter, Switch, Redirect } from "react-router-dom";  
import { useSelector, useDispatch } from 'react-redux';
import LoginPage from '@pages/Login';
import Userdash from '@pages/Userdash';
import DataGrid from '@pages/DataGrid';
import PrivateRoute from '@routes/privateRoute';
import PublicRoute from '@routes/publicRoute';
import {verifyAuth} from '@services/authAPI'
import { useHistory } from 'react-router-dom';
import Account from '@pages/Account'
import Signup from '@pages/Signup';

function App() {
  let history= useHistory();
  const dispatch = useDispatch();
  const authObj = useSelector(state => state.auth)
  
  const {AUTHENTICATED}  = authObj
 
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
      <PublicRoute path="/" exact component={LoginPage} isAuthenticated={AUTHENTICATED}  />
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
