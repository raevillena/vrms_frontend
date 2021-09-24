import React from 'react'
import { Menu} from 'antd'
import logo from '../images/logo.png'
import { BookOutlined, UserOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router-dom';


const ManagerSidebar = () => {
    let history= useHistory();

    const project = async () => {
        history.push("/")
      }

    const account = async () => {
        history.push("/account")
      }
    return (
        <div>
             <img alt="" src={logo} className="logo"/>
          <Menu>
          <Menu.Item key="1" icon={<BookOutlined />} className="menu1" onClick={project}>
           Project
          </Menu.Item>
          <Menu.Item key="2" icon={<UserOutlined />} className="menu1" onClick={account}>
            Account
          </Menu.Item>
          </Menu>
        </div>
    )
}

export default ManagerSidebar
