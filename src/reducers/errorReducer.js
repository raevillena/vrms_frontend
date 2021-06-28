const initialState = {
    message: {},
    status: null,
}

const errorReducer = (state = initialState, action) => {
    switch(action.type) {
        case "GET_ERRORS":
            return {
                message: action.message,
                status: action.status
            }
        case "CLEAR_ERRORS":
            return {
                message: {},
                status: null
            }
        default:
            return state
    }
}

export default errorReducer;