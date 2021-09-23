import {combineReducers} from 'redux' 


import auth from './authReducer'
import userReducer from './userReducer'
import errorReducer from './errorReducer'
import studyReducer from './studyReducer'
import projectReducer from './projectReducer'
import socketReducer from './socketReducer'



const rootReducer = combineReducers({
    auth : auth,
   user : userReducer,
    error:errorReducer,
    study: studyReducer,
    project: projectReducer,
    socket: socketReducer

})

export default  rootReducer