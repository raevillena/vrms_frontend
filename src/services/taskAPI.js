import axios from 'axios'

const accessToken = localStorage.getItem("accessToken")
const refreshToken = localStorage.getItem("refreshToken")

//creating tasks
export async function onTaskCreate(body) {
    try {
        if (!accessToken || !refreshToken) {
            return {
                status: 'false',
                error: 'Access Token / Refresh Token is missing'
            }
        }
        return axios.post("/v1/tasks/createtask", body, {
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


//get all assigned user for the selected study
export async function onGetUserForTask(body) {
    try {
        if (!accessToken || !refreshToken) {
            return {
                status: 'false',
                error: 'Access Token / Refresh Token is missing'
            }
        }
        return axios.get(`/v1/tasks/getUserForTask/${body.study}`, {
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

export async function onGetAllTask(body) {
    try {
        if (!accessToken || !refreshToken) {
            return {
                status: 'false',
                error: 'Access Token / Refresh Token is missing'
            }
        }
        return axios.get(`/v1/tasks/getAllTask/${body.studyName}/${body.assignee}`, {
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

//get al task for manager
export async function onGetAllTaskManager(body) {
    try {
        if (!accessToken || !refreshToken) {
            return {
                status: 'false',
                error: 'Access Token / Refresh Token is missing'
            }
        }
        return axios.get(`/v1/tasks/getAllTaskManager/${body.studyName}`, {
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

//for adding comment
export async function onAddComment(body) {
    try {
        if (!accessToken || !refreshToken) {
            return {
                status: 'false',
                error: 'Access Token / Refresh Token is missing'
            }
        }
        return axios.post(`/v1/tasks/postComment`, body, {
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

//displaying all comment

export async function onGetALlComment(body) {
    console.log(body)
    try {
        if (!accessToken || !refreshToken) {
            return {
                status: 'false',
                error: 'Access Token / Refresh Token is missing'
            }
        }
        return axios.get(`/v1/tasks/getAllComment/${body.taskId}`, {
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

//update task status for manager
export async function onUpdateTask(body) {
    try {
        if (!accessToken || !refreshToken) {
            return {
                status: 'false',
                error: 'Access Token / Refresh Token is missing'
            }
        }
        return axios.post(`/v1/tasks/onUpdateTask`, body, {
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

//update task status for user
export async function onUpdateTaskUser(body) {
    try {
        if (!accessToken || !refreshToken) {
            return {
                status: 'false',
                error: 'Access Token / Refresh Token is missing'
            }
        }
        return axios.post(`/v1/tasks/onUpdateTaskUser`, body, {
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

//delete task
export async function onDeleteTask(body) {
    try {
        if (!accessToken || !refreshToken) {
            return {
                status: 'false',
                error: 'Access Token / Refresh Token is missing'
            }
        }
        return axios.post(`/v1/tasks/onDeleteTask`, body, {
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