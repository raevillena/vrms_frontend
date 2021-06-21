import {combineReducers} from 'redux' 


import auth from './authReducer'
import userReducer from './userReducer'


const appReducer = combineReducers({
    auth,
    userReducer
})

export default appReducer