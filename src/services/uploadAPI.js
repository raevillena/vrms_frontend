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


export async function onDownloadImage(body) {
    try {
        console.log('download', body)
        axios({ url: `http://localhost:8080/datagrid/${body}`, method: 'GET', responseType: 'blob'})
        .then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]))
            const link = document.createElement('a')
            link.href =  url
            link.setAttribute('download', 'image.jpg')
            document.body.appendChild(link)
            link.click()
        })
    } catch (error) {
        return {
            error: error
        }
    }
}
