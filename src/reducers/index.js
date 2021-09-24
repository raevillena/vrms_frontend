import {combineReducers} from 'redux' 


import auth from './authReducer'
import userReducer from './userReducer'
import errorReducer from './errorReducer'
import studyReducer from './studyReducer'
import projectReducer from './projectReducer'




const rootReducer = combineReducers({
    auth : auth,
   user : userReducer,
    error:errorReducer,
    study: studyReducer,
    project: projectReducer,
})

export default  rootReducer