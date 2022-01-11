import { Row, Typography,Avatar, notification, Col, Card } from 'antd'
import React, {useState, useEffect} from 'react';
import { useSelector} from 'react-redux';
import {UserOutlined} from '@ant-design/icons';
import { onUploadAvatar } from '../services/uploadAPI';
import '../styles/CSS/Userdash.css'
import ChangePassword from './ChangePassword';
import Layout1 from '../components/components/Layout1';
import Offline from './Offline';



const style = { marginTop: '25px', marginLeft: '8px' };

const Account = () => {
    const userObj = useSelector(state => state.user) //reducer for user data
    const [imgData, setImgData] = useState() //for displaying avatar
    const { Title } = Typography;
    let avatar = localStorage.getItem("avatarFilename")
    const [isOnline, set_isOnline] = useState(true);
    let interval = null;
    const InternetErrMessagenger = () => set_isOnline(navigator.onLine);

    const notif = (type, message) => {
      notification[type]({
        message: 'Notification Title',
        description:
          message,
      });
    };

    useEffect(() => {
      interval = setInterval(InternetErrMessagenger, 6000);
      return () => {
        clearInterval(interval)
      }
    }, [isOnline])
    

    return (
    <div>
      <Layout1>
      {isOnline !== true ? <Offline/> :
      <Row justify="start" style={{marginLeft: '20px', marginRight: '20px'}} >
              <Card style={{  borderRadius: '10px', fontStyle: 'Montserrat', marginTop: 16}}  hoverable >
                <Row justify="space-around" gutter={16}>
                <Col className="gutter-row" span={12}  >
                <Avatar src={imgData||`/avatar/${avatar}`}  size={150} icon={<UserOutlined />} />
                  <div style={{marginLeft: '30px'}}>
                      <label htmlFor="file_input_id" >Upload Photo</label>
                      <input type="file" id="file_input_id" accept="image/*" onChange={async e => {
                        const file = e.target.files[0]
                        const reader = new FileReader();
                          reader.addEventListener("load", () => {
                            setImgData(reader.result);
                          });
                          reader.readAsDataURL(file)
                          const data = new FormData()
                          data.append("user", userObj.USER._id )
                          data.append("file", file)
                          let result = await onUploadAvatar(data)
                          localStorage.setItem("avatarFilename", result.data.user.avatarFilename)
                          notif('info', result.data.message)
                        }
                      }
                      >
                      </input>
                  </div>
                  </Col>
                  <Col className="gutter-row" span={12} >
                    <div style={style}>
                      <Title level={3}>{userObj.USER.name}</Title>
                      <p >{userObj.USER.title}</p>
                      <p >{userObj.USER.project}</p>
                      <p >{userObj.USER.email}</p>
                      </div>
                  </Col>
                </Row>
              </Card>
              <div style={{padding: '0 8px'}} >
              <Card style={{  borderRadius: '10px', fontStyle: 'Montserrat', marginTop: 16}}  hoverable>
                <ChangePassword/>
              </Card>
              </div>
              </Row>}
      </Layout1>
    </div>
  )
}

export default Account
