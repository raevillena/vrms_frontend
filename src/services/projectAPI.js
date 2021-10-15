import axios from 'axios'

export async function onProjectCreate(body) {
    try {
        return axios.post("/v1/project/createproject", body, tokenConfig())
    } catch (error) {
        return {
            status: 'false',
            error: error
        }
    }
}

export async function onProgramCreate(body) {
    try {
        return axios.post("/v1/project/createprogram", body, tokenConfig())
    } catch (error) {
        return {
            status: 'false',
            error: error
        }
    }
}


export async function onGetAllProject() {
    try {
        return axios.get(`/v1/project/getAllProject`, tokenConfig())
    } catch (error) {
        console.log('error', error)
    }
}


export async function onGetAllPrograms() {
    try {
        return axios.get(`/v1/project/getAllPrograms`, tokenConfig())
    } catch (error) {
        console.log('error', error)
    }
}

export async function onGetProjectforManager(body) {
    try {
        return axios.get(`/v1/project/getProjectforManager/${body.user}/${body.program}`, tokenConfig())
    } catch (error) {
        return {
            status: 'false',
            error: error
        }
    }
}

export async function onGetProgramforManager(body) {
    try {
        return axios.get(`/v1/project/getProgramforManager/${body.user}`, tokenConfig())
    } catch (error) {
        return {
            status: 'false',
            error: error
        }
    }
}


export async function onDeleteProject(body) {
    try {
        return axios.post(`/v1/project/deleteProject`, body, tokenConfig())
    } catch (error) {
        return {
            status: 'false',
            error: error
        }
    }
}

export async function onGetProjectforDirector() {
    try {
        return axios.get(`/v1/project/getProjectforDirector`, tokenConfig())
    } catch (error) {
        return {
            status: 'false',
            error: error
        }
    }
}

export async function onUpdateProgram(body) {
    try {
        return axios.post(`/v1/project/updateProgram`, body, tokenConfig())
    } catch (error) {
        return {
            status: 'false',
            error: error
        }
    }
}

export async function onUpdateProject(body) {
    try {
        return axios.post(`/v1/project/updateProject`, body, tokenConfig())
    } catch (error) {
        return {
            status: 'false',
            error: error
        }
    }
}

//set up config with token, helper function
export const tokenConfig = () => {

    //get token from state
    const accessToken = localStorage.getItem("accessToken")

    //headers
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    //if token, add headers to config
    if (accessToken) {
        config.headers['Authorization'] = `Bearer ${accessToken}`
    }
    return config
}