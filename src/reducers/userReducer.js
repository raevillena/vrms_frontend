const initialState = {
   USER:""
}

const userReducer = (state = initialState, action) => {
    switch(action.type) {
        case "SET_USER":
            return {
                USER: action.value
            }
        default:
            return state
    }
}

export default userReducer;