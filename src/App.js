import React, {useState, useEffect} from 'react';
import { BrowserRouter, Link, Route } from "react-router-dom";  
import LoginPage from '@pages/Login'
import Userdash from '@pages/Userdash';
import DataPage from '@pages/Data';
import DataGrid from '@pages/DataGrid'
function App() {


  return (
    <BrowserRouter>
      <Route path="/" exact component={LoginPage} />
      <Route path="/user" exact component={Userdash} />
      <Route path="/data" exact component={DataPage} />
      <Route path="/datagrid" exact component={DataGrid} />
    </BrowserRouter>
  );
}

export default App;
