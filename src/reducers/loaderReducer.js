const initialState = {
    LOADING: false
 }
 
 const loaderReducer = (state = initialState, action) => {
     switch(action.type) {
         case "SET_LOADING":
             return {
                 LOADING: action.value
             }
         default:
             return state
     }
 }
 
 export default loaderReducer;