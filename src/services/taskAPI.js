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

//get al task for manager
export async function onGetAllTaskManager(body) {
    try {
        return axios.post(`/v1/tasks/getAllTaskManager`, body, {
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

//update task status for manager
export async function onUpdateTask(body) {
    try {
        return axios.post(`/v1/tasks/onUpdateTask`, body, {
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

//update task status for user
export async function onUpdateTaskUser(body) {
    try {
        return axios.post(`/v1/tasks/onUpdateTaskUser`, body, {
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

//delete task
export async function onDeleteTask(body) {
    try {
        return axios.post(`/v1/tasks/onDeleteTask`, body, {
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