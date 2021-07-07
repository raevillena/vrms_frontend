import {combineReducers} from 'redux' 


import auth from './authReducer'
import userReducer from './userReducer'
import errorReducer from './errorReducer'
import uploadReducer from './uploadReducer'

const appReducer = combineReducers({
    auth,
    userReducer,
    errorReducer,
    uploadReducer
})

export default appReducer