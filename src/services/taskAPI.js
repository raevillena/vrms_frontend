import axios from 'axios'
import { tokenConfig } from './projectAPI';


//creating tasks
export async function onTaskCreate(body) {
    try {
        return axios.post("/v1/tasks/createtask", body, tokenConfig());
    } catch (error) {
        return {
            error: error
        }
    }
}


//get all assigned user for the selected study
export async function onGetUserForTask(body) {
    try {
        return axios.get(`/v1/tasks/getUserForTask/${body.study}`, tokenConfig());
    } catch (error) {
        return {
            error: error
        }
    }
}

export async function onGetAllTask(body) {
    try {
        return axios.get(`/v1/tasks/getAllTask/${body.studyName}/${body.assignee}/${body.objective}`, tokenConfig());
    } catch (error) {
        return {
            error: error
        }
    }
}

//get al task for manager
export async function onGetAllTaskManager(body) {
    try {
        return axios.get(`/v1/tasks/getAllTaskManager/${body.studyName}/${body.objective}`, tokenConfig());
    } catch (error) {
        return {
            error: error
        }
    }
}

//for adding comment
export async function onAddComment(body) {
    try {
        return axios.post(`/v1/tasks/postComment`, body, tokenConfig());
    } catch (error) {
        return {
            error: error
        }
    }
}

//displaying all comment

export async function onGetALlComment(body) {
    try {
        return axios.get(`/v1/tasks/getAllComment/${body.taskId}`, tokenConfig());
    } catch (error) {
        return {
            error: error
        }
    }
}

//update task status for manager
export async function onUpdateTask(body) {
    try {
        return axios.post(`/v1/tasks/onUpdateTask`, body, tokenConfig());
    } catch (error) {
        return {
            error: error
        }
    }
}

//update task status for user
export async function onUpdateTaskUser(body) {
    try {
        return axios.post(`/v1/tasks/onUpdateTaskUser`, body, tokenConfig());
    } catch (error) {
        return {
            error: error
        }
    }
}

//delete task
export async function onDeleteTask(body) {
    try {
        return axios.post(`/v1/tasks/onDeleteTask`, body, tokenConfig());
    } catch (error) {
        return {
            error: error
        }
    }
}

//getting all file for specific task
export async function onGetFileList(body) {
    try {
        return axios.get(`/v1/tasks/getFileList/${body}`, tokenConfig());
    } catch (error) {
        return {
            error: error
        }
    }
}

export async function onGetManagerCSV(body) {
    try {
        return axios.get(`/v1/tasks/getManagerFile/${body}`, tokenConfig());
    } catch (error) {
        return {
            error: error
        }
    }
}

export async function onGetTaskProductivity() {
    try {
        return axios.get(`/v1/tasks/getTaskProductivity`, tokenConfig());
    } catch (error) {
        return {
            error: error
        }
    }
}

export async function onGetUserTaskProductivity(body) {
    try {
        return axios.get(`/v1/tasks/getUserTaskProductivity/${body}`, tokenConfig());
    } catch (error) {
        return {
            error: error
        }
    }
}

export async function onGetAllTaskMonitoring(body) {
    try {
        return axios.get(`/v1/tasks/getAllTaskMonitoring/${body}`, tokenConfig());
    } catch (error) {
        return {
            error: error
        }
    }
}

export async function onGetTaskCreatedbyManager(body) {
    try {
        return axios.get(`/v1/tasks/getAllTaskMonitoring/${body}`, tokenConfig());
    } catch (error) {
        return {
            error: error
        }
    }
}

export async function onGetAllTaskAdmin() {
    try {
        return axios.get(`/v1/tasks/getAllTAskAdmin`, tokenConfig());
    } catch (error) {
        return {
            error: error
        }
    }
}

export async function onUpdateTaskAdmin(body) {
    try {
        return axios.post(`/v1/tasks/updatetaskadmin`, body, tokenConfig());
    } catch (error) {
        return {
            error: error
        }
    }
}

export async function onGetAllFileTaskAdmin() {
    try {
        return axios.get(`/v1/tasks/getAllFileListAdmin`, tokenConfig());
    } catch (error) {
        return {
            error: error
        }
    }
}

export async function onUpdateFileTaskAdmin(body) {
    try {
        return axios.post(`/v1/tasks/updatefiletaskadmin`, body, tokenConfig());
    } catch (error) {
        return {
            error: error
        }
    }
}