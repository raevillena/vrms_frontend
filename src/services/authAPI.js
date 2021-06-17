import api from '@services/apiConfig'
// use api in production
import axios from 'axios'

function onUserLogin(body) {
    try {
        return axios.post("/v1/auth/login", body, {
            headers: {
                        'Content-Type': 'application/json',
                    } 
        });
    } catch (error) {
        return {
            status: error,
            error: error
        }
    }
}


export { onUserLogin };