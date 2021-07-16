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


export async function onUpdateDatagrid(body) {
    try {
        return axios.post(`/v1/studies/updateDatagrid`, body, {
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
        return axios.post(`/v1/studies/getdatagrid`, body, {
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