const initialState = {
    AUTHENTICATED: false
}

const auth = (state = initialState, action) => {
    switch(action.type) {
        case "VERIFIED_AUTHENTICATION":
            return {
                ...state,
                AUTHENTICATED: action.value
            }
        default:
            return state
    }
}

export default auth;