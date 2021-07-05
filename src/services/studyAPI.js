import axios from 'axios'


export async function onStudyCreate(body, dispatch) {
    try {
        return axios.post("/v1/studies/createStudy", body, {
            headers: {
                        'Content-Type': 'application/json',
                    } 
        });
    } catch (error) {
        dispatch({
            type: "GET_ERRORS",
            message: error.response.data.message,
            status: error.response.status 
        })
        return {
            status: 'false',
            error: error
        }
    }
}