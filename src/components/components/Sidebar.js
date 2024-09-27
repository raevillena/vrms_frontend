import React, {useState, useEffect} from 'react'
import { Menu} from 'antd'
import logo from '../images/logo.png'
import { BookOutlined, UserOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router-dom';


const Sidebar = () => {
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

    const research = async () => {
          history.push("/")
      }

    const account = async () => {
          history.push("/account")
      }

    const offline = async () => {
        history.push("/offline/uploaded")
    }
    return (
        <div>
             <img alt="" src={logo} className="logo" />
          <Menu>
            <Menu.Item disabled={isOnline !== true ? true : false} key="1" icon={<BookOutlined />} className="menu1" onClick={research}>
              Research
            </Menu.Item>
            <Menu.Item disabled={isOnline !== true ? true : false} key="2" icon={<UserOutlined />} className="menu1" onClick={account}>
              Account
            </Menu.Item>
            <Menu.Item disabled={isOnline !== true ? true : false} key="3" icon={<ClockCircleOutlined />} className="menu1" onClick={offline}>
              Offline Data
            </Menu.Item>
          </Menu>
        </div>
    )
}

export default Sidebar
