import axios from 'axios'

//creating tasks
export async function onTaskCreate(body) {
    try {
        return axios.post("/v1/tasks/createtask", body, {
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

//get all study for task
export async function onGetStudyForTask(body) {
    try {
        return axios.post(`/v1/tasks/getStudyForTask`, body, {
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

//get all assigned user for the selected study
export async function onGetUserForTask(body) {
    try {
        return axios.post(`/v1/tasks/getUserForTask`, body, {
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

export async function onGetAllTask(body) {
    try {
        return axios.post(`/v1/tasks/getAllTask`, body, {
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

//for adding comment
export async function onAddComment(body) {
    try {
        return axios.post(`/v1/tasks/postComment`, body, {
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

//displaying all comment

export async function onGetALlComment(body) {
    try {
        return axios.post(`/v1/tasks/getAllComment`, body, {
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