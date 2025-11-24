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
        return axios.get(`/v1/studies/getStudyForUser/${body._id}`, tokenConfig())
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

export async function onUpdateRrl(body) {
    try {
        return axios.post(`/v1/studies/updateRrl`, body, tokenConfig())
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
        return axios.get(`/v1/studies/studyForProject/${body.projectID}`, tokenConfig())
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

export async function onEditLog(body) {
    try {
        return axios.post('/v1/studies/editlog', body, tokenConfig())
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

export async function onGetEditHistory(body) {
    try {
        return axios.get(`/v1/studies/getEditlog/${body.tableID}`, tokenConfig())
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

export async function onGetGallery(body) {
    try {
        return axios.get(`/v1/studies/studyGallery/${body}`, tokenConfig())
    } catch (error) {
        return {
            error: error
        }
    }
}

export async function onGetDatagridCol(body) {
    try {
        return axios.get(`/v1/studies/getStudyCol/${body.study}`, tokenConfig())
    } catch (error) {
        return {
            error: error
        }
    }
}


export async function onUpdateCurrentEditing(body) {
    try {
        return axios.post(`/v1/studies/updateCurrentEditing`, body, tokenConfig())
    } catch (error) {
        return {
            error: error
        }
    }
}

export async function onGetCurrentEditing(body) {
    try {
        return axios.get(`/v1/studies/getCurrentEditing/${body.tableID}`, tokenConfig())
    } catch (error) {
        return {
            error: error
        }
    }
}


export async function onViewLog(body) {
    try {
        return axios.post('/v1/studies/viewlog', body, tokenConfig())
    } catch (error) {
        return {
            error: error
        }
    }
}

export async function onGetViewHistory(body) {
    try {
        return axios.get(`/v1/studies/getViewlog/${body.tableID}`, tokenConfig())
    } catch (error) {
        return {
            error: error
        }
    }
}

export async function onUpdateStudy(body) {
    try {
        return axios.post('/v1/studies/updateStudy', body, tokenConfig())
    } catch (error) {
        return {
            error: error
        }
    }
}

export async function onGetAllStudy() {
    try {
        return axios.get(`/v1/studies/getAllStudy`, tokenConfig())
    } catch (error) {
        console.log('error', error)
    }
}

export async function onGetAllCreatedTable(body) {
    try {
        return axios.get(`/v1/studies/getAllCreatedTable/${body}`, tokenConfig())
    } catch (error) {
        console.log('error', error)
    }
}

export async function onGetAllStudyIP(body) {
    try {
        return axios.get(`/v1/studies/getTaskManager/${body}`, tokenConfig())
    } catch (error) {
        console.log('error', error)
    }
}

export async function onGetAllStudyMonitor(body) {
    try {
        return axios.get(`/v1/studies/getStudyManagerMonitor/${body}`, tokenConfig())
    } catch (error) {
        console.log('error', error)
    }
}

export async function onGetAllDatagridAdmin() {
    try {
        return axios.get(`/v1/studies/getAllDatagridAdmin`, tokenConfig())
    } catch (error) {
        console.log('error', error)
    }
}

export async function onUpdateStudyAdmin(body) {
    try {
        return axios.post('/v1/studies/updateStudyAdmin', body, tokenConfig())
    } catch (error) {
        return {
            error: error
        }
    }
}

export async function onUpdateDatagridAdmin(body) {
    try {
        return axios.post('/v1/studies/updateDataGridAdmin', body, tokenConfig())
    } catch (error) {
        return {
            error: error
        }
    }
}

export async function onGetGalleryAdmin() {
    try {
        return axios.get(`/v1/studies/studyGalleryAdmin`, tokenConfig())
    } catch (error) {
        return {
            error: error
        }
    }
}

export async function onUpdateGalleryAdmin(body) {
    try {
        return axios.post(`/v1/studies/studyGalleryAdminUpdate`, body, tokenConfig())
    } catch (error) {
        return {
            error: error
        }
    }
}

export async function onBackupDatagrid(body) {
    try {
        return axios.post("/v1/studies/backupDatagrid", body, tokenConfig())
    } catch (error) {
        return {
            error: error
        }
    }
}

export async function onUpdateObjective(body){
    try {
        return axios.post("v1/studies/updateObjective", body, tokenConfig())
    } catch (error) {
        return{
            error: error
        }
    }
}

export async function onGetAllBackup(){
    try {
        return axios.get("/v1/studies/getAllBackup", tokenConfig())
    } catch (error) {
        return{
            error: error
        }
    }
}

export async function onRecoverDatagridData(body){
    try {
        return axios.post("/v1/studies/recoverDatagidData", body, tokenConfig())
    } catch (error) {
        return{
            error: error
        }
    }
}