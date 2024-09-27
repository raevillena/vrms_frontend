import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';


import {Provider} from 'react-redux'
import { createStore} from 'redux';
import rootReducer from './reducers/index'
import { composeWithDevTools } from 'redux-devtools-extension'
import {loadState, saveState} from './services/localStorage'

const persistedState = loadState()
const store = createStore(rootReducer, persistedState, composeWithDevTools())



//this updates the localStorage whenever the auth access token is changed or updated
store.subscribe(() =>{
  localStorage.setItem("accessToken", store.getState().auth.accessToken);
  saveState({project: store.getState().project,
    study : store.getState().study
  })
})

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
  document.getElementById('root')
);


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
