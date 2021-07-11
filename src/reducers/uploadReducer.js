const initialState = {
    FILE:""
 }

const uploadReducer = (state = initialState, action) => {
    switch(action.type) {
        case "UPLOAD_SUCCESS":
            return {
                ...state,
                FILE: action.value
            }
        case "UPLOAD_FAIL":
            return{
                ...state,
                FILE: action.value
            }
        case "UPLOAD_LOADING":
            return{
                ...state,
                FILE: action.value
            }
        default:
            return state
    }
}

export default uploadReducer;