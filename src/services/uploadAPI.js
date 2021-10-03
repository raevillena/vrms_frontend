import axios from 'axios'
const accessToken = localStorage.getItem("accessToken")


export async function onUploadAvatar(file) {
    try {
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


export function onUploadGallery(file) {
    try {
        return axios.post("/v1/upload/gallery", file, {headers:{
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


