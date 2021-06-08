import React, {useState, useEffect} from 'react';
import { BrowserRouter, Link, Route } from "react-router-dom";  
import LoginPage from '@pages/Login'
import Userdash from '@pages/Userdash';
function App() {


  return (
    <BrowserRouter>
      <Route path="/" exact component={LoginPage} />
      <Route path="/user" exact component={Userdash} />
    </BrowserRouter>
  );
}

export default App;
