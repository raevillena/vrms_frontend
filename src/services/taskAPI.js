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