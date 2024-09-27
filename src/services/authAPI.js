import axios from 'axios'

export async function onUserLogin(body, dispatch) {
    try {
        return axios.post("/v1/auth/login", body, {
            headers: {
                        'Content-Type': 'application/json',
                    } 
        });
    
    } catch (error) {
        dispatch({
            type: "GET_ERRORS",
            message: error.response.data.message,
            status: error.response.status 
        })
    }
}

//for authentication
export async function verifyAuth( accessToken, refreshToken, dispatch) {
    try {
    
        if (accessToken === '' || refreshToken === '') {
            console.log('empty token')
        }else{
            return axios.get("/v1/auth/verify", {
                headers: {
                            'Authorization' : `Bearer ${accessToken}`,
                            'Content-Type': 'application/json',
                        } 
            })
        }
    } catch (error) {
        dispatch({
            type: "GET_ERRORS",
            message: error.response.data.message,
            status: error.response.status 
        })
        dispatch({
            type: "AUTH_ERROR",
        })
        return {
            status: error,
            error: error
        }
    }
}


export async function onUserLogout(body, dispatch) {
    try {
        return axios.post("/v1/auth/logout", body);
    } catch (error) {
        dispatch({
            type: "GET_ERRORS",
            message: error.response.data.message,
            status: error.response.status 
        })
        return {
            status: 'false',
            error: error
        }
    }
}

export async function onRenewToken(body, dispatch) {
    try {
        return axios.post("/v1/auth/renewToken", body);
    } catch (error) {
        dispatch({
            type: "GET_ERRORS",
            message: error.response.data.message,
            status: error.response.status 
        })
    }
}
