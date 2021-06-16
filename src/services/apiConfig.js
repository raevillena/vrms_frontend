import axios from 'axios'


const apiUrl = process.env.REACT_APP_API

const api = axios.create({
    baseURL: apiUrl
})


export default api