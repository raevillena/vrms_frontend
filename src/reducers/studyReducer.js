const initialState = {
    STUDY:""
 }
 
 const userReducer = (state = initialState, action) => {
     switch(action.type) {
         case "SET_STUDY":
             return {
                 ...state,
                 STUDY: action.value
             }
         default:
             return state
     }
 }
 
 export default userReducer;