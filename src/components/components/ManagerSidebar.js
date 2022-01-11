import React, {useState, useEffect} from 'react'
import { Menu} from 'antd'
import logo from '../images/logo.png'
import { BookOutlined, UserOutlined, SearchOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router-dom';


const ManagerSidebar = () => {
    let history= useHistory();
    const [isOnline, set_isOnline] = useState(true);
    let interval = null;
    const InternetErrMessagenger = () => set_isOnline(navigator.onLine);

    useEffect(()=>{
        interval = setInterval(InternetErrMessagenger, 6000); // call the function name only not with function with call `()`
        return ()=>{
           clearInterval(interval) // for component unmount stop the interval
        }
     },[])

      const project = async () => {
        history.push("/")
      }

      const account = async () => {
        history.push("/account")
      }
      const monitor = async () => {
        history.push("/monitor")
      }

      const offline = async () => {
        history.push("/offline/uploaded")
      }

    return (
        <div>
             <img alt="" src={logo} className="logo"/>
          <Menu>
            <Menu.Item key="1" disabled={isOnline !== true ? true : false} icon={<BookOutlined />} className="menu1" onClick={project}>
            Project
            </Menu.Item>
            <Menu.Item key="2" disabled={isOnline !== true ? true : false} icon={<SearchOutlined />} className="menu1" onClick={monitor}>
              Monitor
            </Menu.Item>
            <Menu.Item key="3" disabled={isOnline !== true ? true : false} icon={<UserOutlined />} className="menu1" onClick={account}>
              Account
            </Menu.Item>
            <Menu.Item disabled={isOnline !== true ? true : false} key="4" icon={<ClockCircleOutlined />} className="menu1" onClick={offline}>
              Offline Data
            </Menu.Item>
          </Menu>
        </div>
    )
}

export default ManagerSidebar
