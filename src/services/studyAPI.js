import axios from 'axios'


export async function onStudyCreate(body) {
    try {
        return axios.post("/v1/studies/createstudy", body, {
            headers: {
                        'Content-Type': 'application/json',
                    } 
        });
    } catch (error) {
        return {
            error: error
        }
    }
}

export async function onGetStudyForUser(body) {
    try {
        return axios.post(`/v1/studies/getStudyForUser`, body, {
            headers: {
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
        return axios.post(`/v1/studies/updateSummary`, body, {
            headers: {
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
        return axios.post(`/v1/studies/updateIntroduction`, body, {
            headers: {
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
        return axios.post(`/v1/studies/updateMethodology`, body, {
            headers: {
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
        return axios.post(`/v1/studies/updateResultsAndDiscussion`, body, {
            headers: {
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
        return axios.post(`/v1/studies/updateConclusion`, body, {
            headers: {
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
        return axios.post(`/v1/studies/getDocumentation`, body, {
            headers: {
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
        return axios.post(`/v1/studies/getStudyforDoc`, body, {
            headers: {
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
        return axios.post(`/v1/studies/addDatagrid`, body, {
            headers: {
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
        return axios.post('/v1/studies/getDataGrid', body, {
            headers: {
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
        return axios.post('/v1/studies/editDataGrid', body, {
            headers: {
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
        return axios.post('/v1/studies/deleteDataGrid', body, {
            headers: {
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
        return axios.post('/v1/studies/updateDataGrid', body, {
            headers: {
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
        return axios.post('/v1/studies/studyForProject', body, {
            headers: {
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
        return axios.post('/v1/studies/downloadHistory', body, {
            headers: {
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
        return axios.post('/v1/studies/getdownloadHistory', body, {
            headers: {
                        'Content-Type': 'application/json',
                    } 
        });
    } catch (error) {
        return {
            error: error
        }
    }
}