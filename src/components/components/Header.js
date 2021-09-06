import React from 'react'
import { Button, PageHeader } from 'antd'
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

    return (
        <div>
             <PageHeader onBack={()=> window.history.back() } title="Studies" extra={<Button type='link' onClick={handleLogout}  style={{float: 'right', color:'black', fontFamily: 'Montserrat'}}>Logout</Button>}/>
        </div>
    )
}

export default Header
