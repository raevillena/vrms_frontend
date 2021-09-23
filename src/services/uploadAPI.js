import axios from 'axios'
const accessToken = localStorage.getItem("accessToken")
const refreshToken = localStorage.getItem("refreshToken")


export async function onUploadAvatar(file) {
    try {
        if (!accessToken || !refreshToken) {
            return {
                status: 'false',
                error: 'Access Token / Refresh Token is missing'
            }
        }
        return axios.post("/v1/upload/avatar", file, {headers:{
            "Content-Type": "multipart/form-data",
            'Authorization' : `Bearer ${accessToken}`,
        }});


    } catch (error) {
        return {
            status: 'false',
            error: error
        }
    }
}


export async function onUploadDataGrid(file) {
    try {
        if (!accessToken || !refreshToken) {
            return {
                status: 'false',
                error: 'Access Token / Refresh Token is missing'
            }
        }
        return axios.post("/v1/upload/datagrid", file, {headers:{
            "Content-Type": "multipart/form-data",
            'Authorization' : `Bearer ${accessToken}`,
        }});
    } catch (error) {
        return {
            status: 'false',
            error: error
        }
    }
}


