import axios from 'axios'
import { tokenConfig } from './projectAPI'

export async function onStudyCreate(body) {
    try {
        return axios.post("/v1/studies/createstudy", body, tokenConfig())
    } catch (error) {
        return {
            error: error
        }
    }
}

export async function onGetStudyForUser(body) {

    try {
        return axios.get(`/v1/studies/getStudyForUser/${body.name}`, tokenConfig())
    } catch (error) {
        return {
            error: error
        }
    }
}

export async function onUpdateSummary(body) {
    try {
        return axios.post(`/v1/studies/updateSummary`, body, tokenConfig())
    } catch (error) {
        return {
            error: error
        }
    }
}

export async function onUpdateIntroduction(body) {
    try {
        return axios.post(`/v1/studies/updateIntroduction`, body, tokenConfig())
    } catch (error) {
        return {
            error: error
        }
    }
}

export async function onUpdateMethodology(body) {
    try {
        return axios.post(`/v1/studies/updateMethodology`, body, tokenConfig())
    } catch (error) {
        return {
            error: error
        }
    }
}

export async function onUpdateResultsAndDiscussion(body) {
    try {
        return axios.post(`/v1/studies/updateResultsAndDiscussion`, body, tokenConfig())
    } catch (error) {
        return {
            error: error
        }
    }
}

export async function onUpdateConclusion(body) {
    try {
        return axios.post(`/v1/studies/updateConclusion`, body, tokenConfig())
    } catch (error) {
        return {
            error: error
        }
    }
}

export async function onGetDocumentation(body) {
    try {
        return axios.get(`/v1/studies/getDocumentation/${body.studyID}`, tokenConfig())
    } catch (error) {
        return {
            error: error
        }
    }
}



export async function onGetStudyForDoc(body) {
    try {
        return axios.get(`/v1/studies/getStudyforDoc/${body.studyID}`, tokenConfig())
    } catch (error) {
        return {
            error: error
        }
    }
}


export async function onAddDatagrid(body) {
    try {
        return axios.post(`/v1/studies/addDatagrid`, body, tokenConfig())
    } catch (error) {
        return {
            error: error
        }
    }
}


export async function onGetDatagrid(body) {
    try {
        return axios.get(`/v1/studies/getDataGrid/${body.studyID}`, tokenConfig())
    } catch (error) {
        return {
            error: error
        }
    }
}

export async function onEditDatagrid(body) {
    try {
        return axios.get(`/v1/studies/editDataGrid/${body.tableID}`, tokenConfig())
    } catch (error) {
        return {
            error: error
        }
    }
}


export async function onDeleteDatagrid(body) {
    try {
        return axios.post('/v1/studies/deleteDataGrid', body, tokenConfig())
    } catch (error) {
        return {
            error: error
        }
    }
}

export async function onUpdateDatagrid(body) {
    try {
        return axios.post('/v1/studies/updateDataGrid', body, tokenConfig())
    } catch (error) {
        return {
            error: error
        }
    }
}

export async function onGetAllStudyforProject(body) {
    try {
        return axios.get(`/v1/studies/studyForProject/${body.projectName}`, tokenConfig())
    } catch (error) {
        return {
            error: error
        }
    }
}

export async function onDownloadHistory(body) {
    try {
        return axios.post('/v1/studies/downloadHistory', body, tokenConfig())
    } catch (error) {
        return {
            error: error
        }
    }
}

export async function onGetDownloadHistory(body) {
    try {
        return axios.get(`/v1/studies/getdownloadHistory/${body.tableID}`, tokenConfig())
    } catch (error) {
        return {
            error: error
        }
    }
}

export async function onDeleteStudy(body) {
    try {
        return axios.post('/v1/studies/deleteStudy', body, tokenConfig())
    } catch (error) {
        return {
            error: error
        }
    }
}