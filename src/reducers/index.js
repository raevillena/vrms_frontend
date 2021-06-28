import {combineReducers} from 'redux' 


import auth from './authReducer'
import userReducer from './userReducer'
import errorReducer from './errorReducer'

const appReducer = combineReducers({
    auth,
    userReducer,
    errorReducer
})

export default appReducer