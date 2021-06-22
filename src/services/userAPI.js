import api from '@services/apiConfig'
// use api in production
import axios from 'axios'

export async function onChangePassword(body) {
    try {
        return axios.post("/v1/user/updatepassword", body, {
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