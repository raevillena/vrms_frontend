import React from 'react'
import { Menu} from 'antd'
import logo from '../images/logo.png'
import { BookOutlined, UserOutlined, SearchOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router-dom';

const DirectorSidebar = () => {
    let history= useHistory();

    const project = async () => {
        history.push("/")
      }

      const monitor = async () => {
        history.push("/monitor")
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
          <Menu.Item key="2" icon={<SearchOutlined />} className="menu1" onClick={monitor}>
           Monitor
          </Menu.Item>
          <Menu.Item key="3" icon={<UserOutlined />} className="menu1" onClick={account}>
            Account
          </Menu.Item>
          </Menu>
        </div>
    )
}

export default DirectorSidebar
