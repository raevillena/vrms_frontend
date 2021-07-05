import React from 'react'
import { Button } from 'antd'
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
             <Button type='link' onClick={studies} style={{padding: '25px', fontSize: '32px', color: 'black', fontFamily: 'Montserrat'}} >Studies</Button>
            <Button type='link' onClick={handleLogout}  style={{float: 'right', color:'black', fontFamily: 'Montserrat', margin: '35px 16px 0'}}>Logout</Button>
        </div>
    )
}

export default Header
