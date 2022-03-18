import axios from 'axios'
import download from 'downloadjs'
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

export function onUploadTaskFile(file) {
    try {
        return axios.post("/v1/upload/tasksfile", file, {headers:{
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


export async function onDownloadFileTask(body) {
    try {
         axios.get(`/v1/upload/downloadFileTask/${body}`, { key: 'value', headers: {
            "Content-Type": "multipart/form-data",
            "Content-Disposition": "inline",
            'Authorization' : `Bearer ${accessToken}`,
        }, responseType: 'blob' }).then(async function (response) {
            let blob  = new Blob([response.data])
            download(blob, body)
        })
    } catch (error) {
        return {
            error: error
        }
    }
}


