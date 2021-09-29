const initialState = {
    buttonEnable: false, 
    column: null,
    data: null
 }
 
 const undoReducer = (state = initialState, action) => {
     switch(action.type) {
        case "DELETE_COL":
            return {
                ...state,
                column: action.column,
                data: action.data,
                buttonEnable: true, 
            }
        case "PRESS_REDO":
            return {
                ...state,
                buttonEnable: true, 
            }
        case "PRESS_UNDO":
            return {
                ...state,
                buttonEnable: false, 
            }
         default:
             return state
     }
 }
 
 export default undoReducer;