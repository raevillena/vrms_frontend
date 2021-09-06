import axios from 'axios'



export async function onUploadAvatar(file) {
    try {
        return axios.post("/v1/upload/avatar", file, {headers:{
            "Content-Type": "multipart/form-data",
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
        }});
    } catch (error) {
        return {
            status: 'false',
            error: error
        }
    }
}


