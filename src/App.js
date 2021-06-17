import React, {useState, useEffect} from 'react';
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";  
import { useSelector, useDispatch } from 'react-redux';
import LoginPage from '@pages/Login';
import Userdash from '@pages/Userdash';
import DataGrid from '@pages/DataGrid';
import PrivateRoute from '@routes/privateRoute';
import PublicRoute from '@routes/publicRoute';
import {verifyAuth} from '@services/authAPI'
import { useHistory } from 'react-router-dom';

function App() {
  let history= useHistory();
  const dispatch = useDispatch();
  const authObj = useSelector(state => state.auth)

  const {AUTHENTICATED}  = authObj

  useEffect(() => {
    async function verify() {
      await verifyAuth()
      .then(res => {
        dispatch({
          type: "VERIFIED_AUTHENTICATION",
       })
      })
      .catch(err => {
        dispatch({
          type: "UNVERIFIED_AUTHENTICATION",
       })
      })
    }

    verify()
}, [])


  return (

    <BrowserRouter>
    <Switch>
      <PublicRoute path="/" exact component={LoginPage} isAuthenticated={AUTHENTICATED} />
      <PrivateRoute path="/dash" exact component={Userdash} isAuthenticated={AUTHENTICATED}/>
      <PrivateRoute path="/datagrid" exact component={DataGrid} isAuthenticated={AUTHENTICATED}/>
      <Redirect to={AUTHENTICATED ? '/dash' : '/'} />
    </Switch>
    </BrowserRouter>

  );
}

export default App;
