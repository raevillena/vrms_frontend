const initialState = {
    AUTHENTICATED: false,
    accessToken: localStorage.getItem("accessToken"),
    refreshToken: localStorage.getItem("refreshToken"),
    LOADING: false,
    USER: null
}

const auth = (state = initialState, action) => {
    switch(action.type) {
        case "VERIFIED_AUTHENTICATION":
            return {
                ...state,
                AUTHENTICATED: action.value
            }
        case "AUTH_ERROR":
        case "LOGIN_FAIL":
            localStorage.removeItem("accessToken")
            localStorage.removeItem("refreshToken")
            return {
                ...state,
                AUTHENTICATED: false,
                accessToken: null,
                refreshToken: null,
                USER: null,
                LOADING: false
            }
        default:
            return state
    }
}

export default auth;