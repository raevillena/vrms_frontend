import React from 'react'
import { Menu} from 'antd'
import logo from '../images/logo.png'
import { BookOutlined, UserOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router-dom';


const Sidebar = () => {
    let history= useHistory();

    const research = async () => {
        try {
          history.push("/dash")
        } catch (error) {
          console.log(error)
        }
      }

    const account = async () => {
        try {
          history.push("/account")
        } catch (error) {
          console.log(error)
        }
      }
    return (
        <div>
             <img alt="" src={logo} className="logo"/>
          <Menu>
          <Menu.Item key="1" icon={<BookOutlined />} className="menu1" onClick={research}>
           Research
          </Menu.Item>
          <Menu.Item key="2" icon={<UserOutlined />} className="menu1" onClick={account}>
            Account
          </Menu.Item>
          </Menu>
        </div>
    )
}

export default Sidebar
