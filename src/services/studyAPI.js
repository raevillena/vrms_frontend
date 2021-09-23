import axios from 'axios'
import { verifyAuth } from './authAPI';

const accessToken = localStorage.getItem("accessToken")
const refreshToken = localStorage.getItem("refreshToken")

export async function onStudyCreate(body) {
    try {
        if (!accessToken || !refreshToken) {
            return {
                status: 'false',
                error: 'Access Token / Refresh Token is missing'
            }
        }
        return axios.post("/v1/studies/createstudy", body, {
            headers: {
                        'Authorization' : `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    } 
        });
    } catch (error) {
        verifyAuth()
    }
}

export async function onGetStudyForUser(body) {
    try {
        return axios.get(`/v1/studies/getStudyForUser/${body.name}`, {
            headers: {
                        'Authorization' : `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    } 
        });
    } catch (error) {
        return {
            error: error
        }
    }
}

export async function onUpdateSummary(body) {
    try {
        if (!accessToken || !refreshToken) {
            return {
                status: 'false',
                error: 'Access Token / Refresh Token is missing'
            }
        }
        return axios.post(`/v1/studies/updateSummary`, body, {
            headers: {
                        'Authorization' : `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    } 
        });
    } catch (error) {
        return {
            error: error
        }
    }
}

export async function onUpdateIntroduction(body) {
    try {
        if (!accessToken || !refreshToken) {
            return {
                status: 'false',
                error: 'Access Token / Refresh Token is missing'
            }
        }
        return axios.post(`/v1/studies/updateIntroduction`, body, {
            headers: {
                        'Authorization' : `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    } 
        });
    } catch (error) {
        return {
            error: error
        }
    }
}

export async function onUpdateMethodology(body) {
    try {
        if (!accessToken || !refreshToken) {
            return {
                status: 'false',
                error: 'Access Token / Refresh Token is missing'
            }
        }
        return axios.post(`/v1/studies/updateMethodology`, body, {
            headers: {
                        'Authorization' : `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    } 
        });
    } catch (error) {
        return {
            error: error
        }
    }
}

export async function onUpdateResultsAndDiscussion(body) {
    try {
        if (!accessToken || !refreshToken) {
            return {
                status: 'false',
                error: 'Access Token / Refresh Token is missing'
            }
        }
        return axios.post(`/v1/studies/updateResultsAndDiscussion`, body, {
            headers: {
                        'Authorization' : `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    } 
        });
    } catch (error) {
        return {
            error: error
        }
    }
}

export async function onUpdateConclusion(body) {
    try {
        if (!accessToken || !refreshToken) {
            return {
                status: 'false',
                error: 'Access Token / Refresh Token is missing'
            }
        }
        return axios.post(`/v1/studies/updateConclusion`, body, {
            headers: {
                        'Authorization' : `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    } 
        });
    } catch (error) {
        return {
            error: error
        }
    }
}

export async function onGetDocumentation(body) {
    try {
        if (!accessToken || !refreshToken) {
            return {
                status: 'false',
                error: 'Access Token / Refresh Token is missing'
            }
        }
        return axios.get(`/v1/studies/getDocumentation/${body.studyID}`, {
            headers: {
                        'Authorization' : `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    } 
        });
    } catch (error) {
        return {
            error: error
        }
    }
}



export async function onGetStudyForDoc(body) {
    try {
        if (!accessToken || !refreshToken) {
            return {
                status: 'false',
                error: 'Access Token / Refresh Token is missing'
            }
        }
        return axios.get(`/v1/studies/getStudyforDoc/${body.studyID}`, {
            headers: {
                        'Authorization' : `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    } 
        });
    } catch (error) {
        return {
            error: error
        }
    }
}


export async function onAddDatagrid(body) {
    try {
        if (!accessToken || !refreshToken) {
            return {
                status: 'false',
                error: 'Access Token / Refresh Token is missing'
            }
        }
        return axios.post(`/v1/studies/addDatagrid`, body, {
            headers: {
                        'Authorization' : `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    } 
        });
    } catch (error) {
        return {
            error: error
        }
    }
}


export async function onGetDatagrid(body) {
    try {
        if (!accessToken || !refreshToken) {
            return {
                status: 'false',
                error: 'Access Token / Refresh Token is missing'
            }
        }
        return axios.get(`/v1/studies/getDataGrid/${body.studyID}`, {
            headers: {
                        'Authorization' : `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    } 
        });
    } catch (error) {
        return {
            error: error
        }
    }
}

export async function onEditDatagrid(body) {
    try {
        if (!accessToken || !refreshToken) {
            return {
                status: 'false',
                error: 'Access Token / Refresh Token is missing'
            }
        }
        return axios.get(`/v1/studies/editDataGrid/${body.tableID}`, {
            headers: {
                        'Authorization' : `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    } 
        });
    } catch (error) {
        return {
            error: error
        }
    }
}


export async function onDeleteDatagrid(body) {
    try {
        if (!accessToken || !refreshToken) {
            return {
                status: 'false',
                error: 'Access Token / Refresh Token is missing'
            }
        }
        return axios.post('/v1/studies/deleteDataGrid', body, {
            headers: {
                        'Authorization' : `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    } 
        });
    } catch (error) {
        return {
            error: error
        }
    }
}

export async function onUpdateDatagrid(body) {
    try {
        if (!accessToken || !refreshToken) {
            return {
                status: 'false',
                error: 'Access Token / Refresh Token is missing'
            }
        }
        return axios.post('/v1/studies/updateDataGrid', body, {
            headers: {
                        'Authorization' : `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    } 
        });
    } catch (error) {
        return {
            error: error
        }
    }
}

export async function onGetAllStudyforProject(body) {
    try {
        if (!accessToken || !refreshToken) {
            return {
                status: 'false',
                error: 'Access Token / Refresh Token is missing'
            }
        }
        return axios.get(`/v1/studies/studyForProject/${body.projectName}`, {
            headers: {
                        'Authorization' : `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    } 
        });
    } catch (error) {
        return {
            error: error
        }
    }
}

export async function onDownloadHistory(body) {
    try {
        if (!accessToken || !refreshToken) {
            return {
                status: 'false',
                error: 'Access Token / Refresh Token is missing'
            }
        }
        return axios.post('/v1/studies/downloadHistory', body, {
            headers: {
                        'Authorization' : `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    } 
        });
    } catch (error) {
        return {
            error: error
        }
    }
}

export async function onGetDownloadHistory(body) {
    try {
        if (!accessToken || !refreshToken) {
            return {
                status: 'false',
                error: 'Access Token / Refresh Token is missing'
            }
        }
        return axios.get(`/v1/studies/getdownloadHistory/${body.tableID}`, {
            headers: {
                        'Authorization' : `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    } 
        });
    } catch (error) {
        return {
            error: error
        }
    }
}

export async function onDeleteStudy(body) {
    try {
        if (!accessToken || !refreshToken) {
            return {
                status: 'false',
                error: 'Access Token / Refresh Token is missing'
            }
        }
        return axios.post('/v1/studies/deleteStudy', body, {
            headers: {
                        'Authorization' : `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    } 
        });
    } catch (error) {
        return {
            error: error
        }
    }
}