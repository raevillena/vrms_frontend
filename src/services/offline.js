import axios from 'axios'
import { tokenConfig } from './projectAPI'

export async function onPostOffline(body) {
    try {
        return axios.post("/v1/studies/postOffline", body, tokenConfig())
    } catch (error) {
        return {
            error: error
        }
    }
}


export async function onGetOffline(body) {
    try {
        return axios.get(`/v1/studies/getOffline/${body._id}`, tokenConfig())
    } catch (error) {
        return {
            error: error
        }
    }
}


export async function onMoveOfflineData(body) {
    try {
        return axios.post(`/v1/studies/moveOffline/`, body, tokenConfig())
    } catch (error) {
        return {
            error: error
        }
    }
}

export async function onDeleteOfflineData(body) {
    console.log(body)
    try {
        return axios.post(`/v1/studies/deleteOffline`, body, tokenConfig())
    } catch (error) {
        return {
            error: error
        }
    }
}
