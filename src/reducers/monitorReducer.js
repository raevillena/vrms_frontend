const initialState = {
    MONITOR:""
 }
 
 const monitorReducer = (state = initialState, action) => {
     switch(action.type) {
         case "SET_MONITOR":
             return {
                 ...state,
                 MONITOR: action.value
             }
         default:
             return state
     }
 }
 
 export default monitorReducer;