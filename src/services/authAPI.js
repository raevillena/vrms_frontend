import api from '@services/apiConfig'
// use api in production
import axios from 'axios'

export async function onUserLogin(body) {
    try {
        return axios.post("/v1/auth/login", body, {
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

export async function verifyAuth() {
    try {
        const accessToken = localStorage.getItem("accessToken")
        const refreshToken = localStorage.getItem("refreshToken")

        if (!accessToken || !refreshToken) {
            return {
                status: 'false',
                error: 'Access Token / Refresh Token is missing'
            }
        }

        return axios.post("/v1/auth/verify", {
            headers: {
                         Authorization : `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    } 
        })
    } catch (error) {
        return {
            status: error,
            error: error
        }
    }
}


export async function onUserCreate(body) {
    try {
        return axios.post("/v1/user/secretcreateuser", body, {
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

