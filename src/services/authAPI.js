import api from '@services/apiConfig'


function onUserLogin(body) {
    try {
        return client.post("/user", body, {
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