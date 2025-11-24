const initialState = {
    PROJECT:""
 }
 
 const userReducer = (state = initialState, action) => {
     switch(action.type) {
         case "SET_PROJECT":
             return {
                 ...state,
                 PROJECT: action.value
             }
         default:
             return state
     }
 }
 
 export default userReducer;