import api from '@services/apiConfig'
// use api in production
import axios from 'axios'

export async function getUserdata(body) {
    try {
        return axios.get("/v1/user/account", body, {
            headers: {
                        'Content-Type': 'application/json',
                    } 
        });
    } catch (error) {
        return {
            error: error
        }
    }
}