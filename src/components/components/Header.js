import React from 'react'
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { onUserLogout } from '../../services/authAPI';


const Header = () => {
    let history= useHistory();
    const dispatch = useDispatch();

    const handleLogout = async () => { 
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

      const studies = async() => {
          try {
              history.push('/dash')
          } catch (error) {
              console.log(error)
          }
      }

    return (
        <div>
             <a onClick={studies} style={{padding: '25px', fontSize: '32px', color: 'black', fontFamily: 'Montserrat'}} >Studies</a>
            <a  onClick={handleLogout}  style={{float: 'right', color:'black', fontFamily: 'Montserrat', margin: '0px 16px 0'}}>Logout</a>
        </div>
    )
}

export default Header
