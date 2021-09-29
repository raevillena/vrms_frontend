const initialState = {
    buttonEnable: false, 
    column: null,
    data: null
 }
 
 const redoReducer = (state = initialState, action) => {
     switch(action.type) {
        case "PRESS_UNDO":
            return {
                ...state,
                column: action.column,
                data: action.data,
                buttonEnable: true
            }
        case "PRESS_REDO":
            return {
                ...state,
                buttonEnable: false, 
            }
    
        default:
             return state
     }
 }
 
 export default redoReducer;