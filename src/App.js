import React, {useState, useEffect} from 'react';
import LoginPage from './pages/Login'
import Userdash from './pages/Userdash';
import { BrowserRouter, Link, Route } from "react-router-dom";  

function App() {
  
  return (
    <div className="App">
    <BrowserRouter>
     
    <Route path="/user" component={Userdash} />
    </BrowserRouter>
    </div>
  );
}

export default App;
