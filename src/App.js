import React, {useState, useEffect} from 'react';
import Login1 from './components/Login'
import Userdash from './components/Userdash';
import { BrowserRouter, Route } from "react-router-dom";  


function App() {

  return (
    <div className="App">
    <BrowserRouter>
          <Route exact path="/" component={Login1} />
          <Route path="/user" component={Userdash} />
    </BrowserRouter>
    </div>
  );
}

export default App;
