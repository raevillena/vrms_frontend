import React, {useState, useEffect} from 'react';
import { BrowserRouter, Switch, Route } from "react-router-dom";  
import LoginPage from '@pages/Login';
import Userdash from '@pages/Userdash';
import DataGrid from '@pages/DataGrid';

function App() {
  return (

    <BrowserRouter>
      <Route path="/" exact component={LoginPage} />
      <Route path="/dash" exact component={Userdash} />
      <Route path="/datagrid" exact component={DataGrid} />
     
    </BrowserRouter>
  );
}

export default App;
