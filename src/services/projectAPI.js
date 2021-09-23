import axios from 'axios'
const accessToken = localStorage.getItem("accessToken")
const refreshToken = localStorage.getItem("refreshToken")

export async function onProjectCreate(body) {
    try {
        if (!accessToken || !refreshToken) {
            return {
                status: 'false',
                error: 'Access Token / Refresh Token is missing'
            }
        }
        return axios.post("/v1/project/createproject", body, {
            headers: {
                        'Authorization' : `Bearer ${accessToken}`,
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


export async function onGetAllProject() {
    try {
        return axios.get(`/v1/project/getAllProject`, {
            headers: {
                        'Content-Type': 'application/json',
                    } 
        });
    } catch (error) {
        console.log('error', error)
    }
}

export async function onGetProjectforManager(body) {
    try {
        if (!accessToken || !refreshToken) {
            return {
                status: 'false',
                error: 'Access Token / Refresh Token is missing'
            }
        }
        return axios.get(`/v1/project/getProjectforManager/${body.user}`, {
            headers: {
                        'Authorization' : `Bearer ${accessToken}`,
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


export async function onDeleteProject(body) {
    try {
        if (!accessToken || !refreshToken) {
            return {
                status: 'false',
                error: 'Access Token / Refresh Token is missing'
            }
        }
        return axios.post(`/v1/project/deleteProject`, body, {
            headers: {
                        'Authorization' : `Bearer ${accessToken}`,
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