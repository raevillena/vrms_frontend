import {combineReducers} from 'redux' 


import auth from './authReducer'
import userReducer from './userReducer'
import errorReducer from './errorReducer'
import studyReducer from './studyReducer'
import projectReducer from './projectReducer'
import undoReducer from './undoReducers'
import redoReducer from './redoReducer'




const rootReducer = combineReducers({
    auth : auth,
   user : userReducer,
    error:errorReducer,
    study: studyReducer,
    project: projectReducer,
    undo : undoReducer,
    redo: redoReducer
})

export default  rootReducer