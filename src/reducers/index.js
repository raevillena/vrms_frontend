import {combineReducers} from 'redux' 


import auth from './authReducer'
import userReducer from './userReducer'
import errorReducer from './errorReducer'
import uploadReducer from './uploadReducer'
import loaderReducer from './uploadReducer'


const rootReducer = combineReducers({
    auth : auth,
   user : userReducer,
    error:errorReducer,
    upload: uploadReducer,
    loader: loaderReducer
})

export default  rootReducer