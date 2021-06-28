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
        case "USER_LOADING":
            return {
                ...state,
                LOADING: true
            }
        case "USER_LOADED":
            return {
                ...state,
                AUTHENTICATED: true,
                LOADING: false,
                USER: action.payload
            }
        case "LOGIN_SUCCESS":
            return {
                ...state,
                ...action.payload,
                AUTHENTICATED: true,
                LOADING: false
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