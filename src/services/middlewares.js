import { onUserLogout } from '../services/authAPI';


export const handleLogout = async () => {
    let history= useHistory();
  const dispatch = useDispatch();
    try {
      const tokens = {
        refreshToken: localStorage.getItem("refreshToken"),
        accessToken: localStorage.getItem("accessToken")
      }
      
      onUserLogout(tokens)
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      dispatch({
        type: "VERIFIED_AUTHENTICATION",
        value: false
     })
      history.push('/')
    } catch (error) {
      console.error(error)
      alert(error.response.data.error);
    }
  };


  