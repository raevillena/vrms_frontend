

const initialState = {
    UNDO:""
 }
 
 const undoReducer = (state = initialState, action) => {
     switch(action.type) {
         case "SET_UNDO":
             return {
                 ...state,
                 column: action.column,
                 data: action.data
             }
         default:
             return state
     }
 }
 
 export default undoReducer;