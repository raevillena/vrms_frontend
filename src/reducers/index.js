import {combineReducers} from 'redux' 


import auth from './authReducer'
import userReducer from './userReducer'
import errorReducer from './errorReducer'
import studyReducer from './studyReducer'



const rootReducer = combineReducers({
    auth : auth,
   user : userReducer,
    error:errorReducer,
    study: studyReducer

})

export default  rootReducer