import axios from 'axios'

export async function onUserCreate(body, dispatch) {
    try {
        return axios.post("/v1/user/secretcreateuser", body, {
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
        return {
            status: 'false',
            error: error
        }
    }
}

export async function onChangePassword(body, dispatch) {
    try {
        return axios.post("/v1/user/updatepassword", body, {
            headers: {
                        'Content-Type': 'application/json',
                    } 
        });
    } catch (error) {
        dispatch({
            type: "GET_ERRORS",
            message: error && error.response && error.response.data &&  error.response.data.message ? error.response.data.message : "Server is having an issue right now, Please try again later.",
            status: error.response.status 
        })   
    }
}

export async function onForgotPassword(body, dispatch) {
    
    try {
        return axios.post("/v1/user/forgotpassword", body, {
            headers: {
                        'Content-Type': 'application/json',
                    } 
        });
    } catch (error) {
        dispatch({
            type: "GET_ERRORS",
            message: error && error.response && error.response.data &&  error.response.data.message ? error.response.data.message : "Server is having an issue right now, Please try again later.",
            status: error.response.status 
        })
        return {
            status: 'false',
            error: error
        }
    }
}

export async function onVerifyResetPasswordToken(token) {
    try {
        return axios.get(`/v1/user/reset-password/${token}`, {
            headers: {
                        'Content-Type': 'application/json',
                    } 
        });
    } catch (error) {
        return {
            status: 'false',
            error: error
        }
    }
}

export async function onResetPassword(token, body) {
    try {
        return axios.post(`/v1/user/reset-password/${token}`,body , {
            headers: {
                        'Content-Type': 'application/json',
                    } 
        });
    } catch (error) {
        return {
            status: 'false',
            error: error
        }
    }
}


export async function onGetAllUsers() {
    try {
        return axios.get(`/v1/user/getAllUser`, {
            headers: {
                        'Content-Type': 'application/json',
                    } 
        });
    } catch (error) {
        return {
            status: 'false',
            error: error
        }
    }
}

export async function onGetAllManagers() {
    try {
        return axios.get(`/v1/user/getAllManager`, {
            headers: {
                        'Content-Type': 'application/json',
                    } 
        });
    } catch (error) {
        return {
            status: 'false',
            error: error
        }
    }
}

export async function onGetAllUser() {
    try {
        return axios.get(`/v1/user/getAllUserDashboard`, {
            headers: {
                        'Content-Type': 'application/json',
                    } 
        });
    } catch (error) {
        return {
            status: 'false',
            error: error
        }
    }
}

export async function onUpdateUserAdmin(body) {
    try {
        return axios.post(`/v1/user/updateUserAdmin/`,body , {
            headers: {
                        'Content-Type': 'application/json',
                    } 
        });
    } catch (error) {
        return {
            status: 'false',
            error: error
        }
    }
}

export async function onResetPasswordAdmin(body) {
    try {
        return axios.post(`/v1/user/resetpasswordadmin/`,body , {
            headers: {
                        'Content-Type': 'application/json',
                    } 
        });
    } catch (error) {
        return {
            status: 'false',
            error: error
        }
    }
}