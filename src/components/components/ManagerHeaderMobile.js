import React from 'react'
import {  Menu } from 'antd'
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { onUserLogout } from '../../services/authAPI';
import { UserOutlined, BookOutlined, MenuOutlined } from '@ant-design/icons';
import logo from '../images/logo.png'
import '../../styles/CSS/Userdash.css'


const ManagerHeaderMobile = () => {
    let history= useHistory();
    const dispatch = useDispatch();

    const {SubMenu}= Menu

    const handleLogout = async () => { 
      try {
        const tokens = {
          refreshToken: localStorage.getItem("refreshToken"),
          accessToken: localStorage.getItem("accessToken")
        }
        //there should also be logout loading dispatch here for reference of notifications
        //user must be at least when logout is successful
        onUserLogout(tokens)
        dispatch({
          type: "LOGOUT_SUCCESS",
          value: false
       })
        history.push('/')
      } catch (error) {
        console.error(error)
        alert(error.response.data.error);
      }
    };

      const studies = async() => {
        history.push('/')
      }

    const account = async () => {
        history.push("/account")
      }

    return (
        <div  style={{background:'white',height: '50px', width: '100%'}}>
            <div style={{float:'left'}}>
            <Menu triggerSubMenuAction="click">
                    <SubMenu key="sub1" icon={<MenuOutlined/>}>
                        <Menu.Item key="1" icon={<UserOutlined/>} onClick={account}>
                            Account
                        </Menu.Item>
                        <Menu.Item icon={<BookOutlined/>} key="2" onClick={studies}>
                            Projects
                        </Menu.Item>
                        <Menu.Item key="3" onClick={handleLogout}>
                            Logout
                        </Menu.Item>
                    </SubMenu>
                </Menu>
                </div>
        <div style={{display: 'flex', alignItems:'center', justifyContent:'center'}}>
            
            <div style={{display: 'flex', marginTop:'5px', alignItems:'center'}}>
            <img alt="" src={logo} style={{width: '40px', height: '40px'}}/>
            <h3>Virtual Research Management System</h3>
            </div>
            
        </div>
        
        </div>
    )
}

export default ManagerHeaderMobile
