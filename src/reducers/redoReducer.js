const initialState = {
    REDO:""
 }
 
 const redoReducer = (state = initialState, action) => {
     switch(action.type) {
         case "SET_REDO":
             return {
                 ...state,
                 column: action.column,
                 data: action.data
             }
         default:
             return state
     }
 }
 
 export default redoReducer;