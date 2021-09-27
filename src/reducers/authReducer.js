const initialState = {
    AUTHENTICATED: false,
    accessToken: localStorage.getItem("accessToken"),
    refreshToken: localStorage.getItem("refreshToken"),
    LOADING: true,
    USER: null
}

const auth = (state = initialState, action) => {
    switch(action.type) {
        case "LOGIN_LOADING":
            return {
                ...state,
                LOADING: action.LOADING
            }
        case "LOGIN_SUCCESS":
            return {
                ...state,
                AUTHENTICATED: action.value,
                accessToken: action.accessToken,
                refreshToken: action.refreshToken,
                LOADING: action.LOADING
            }
        case "VERIFY_LOADING":
            return {
                ...state,
                LOADING: true
            }
        case "VERIFY_SUCCESS":
            return {
                ...state,
                LOADING: false,
            }
        case "RENEW_LOADING":
            return {
                ...state,
                LOADING: action.LOADING,
            }
        case "RENEW_SUCCESS":
            return {
                ...state,
                AUTHENTICATED: action.AUTHENTICATED,
                accessToken: action.accessToken,
                LOADING: action.LOADING
            }
        case "VERIFY_ERROR":   
        case "RENEW_ERROR":
        case "LOGOUT_SUCCESS":
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