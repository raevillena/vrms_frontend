import { Row, Layout, Typography,Avatar, notification, Col, Card } from 'antd'
import React, {useState, useEffect} from 'react';
import { useSelector} from 'react-redux';
import {UserOutlined} from '@ant-design/icons';
import Sidebar from '../components/components/Sidebar'
import ManagerSidebar from '../components/components/ManagerSidebar';
import DirectorSidebar from '../components/components/DirectorSidebar'
import Headers from '../components/components/Header'
import { onUploadAvatar } from '../services/uploadAPI';
import '../styles/CSS/Account.css'
import ChangePassword from './ChangePassword';
import MobileHeader from '../components/components/MobileHeader';
import ManagerHeaderMobile from '../components/components/ManagerHeaderMobile';
import DirectorHeaderMobile from '../components/components/DirectorHeaderMobile';

const { Header, Content, Sider } = Layout;

const style = { marginTop: '25px', marginLeft: '8px' };

const Account = () => {
    const userObj = useSelector(state => state.user) //reducer for user data
    const [imgData, setImgData] = useState() //for displaying avatar
    const { Title } = Typography;
    let avatar = localStorage.getItem("avatarFilename")

    const notif = (type, message) => {
      notification[type]({
        message: 'Notification Title',
        description:
          message,
      });
    };
    
    function useWindowSize(){
      const [size, setSize] = useState([window.innerHeight, window.innerWidth]);
      useEffect(() => {
        const handleResize = () => {
          setSize([window.innerHeight, window.innerWidth])
        }
        window.addEventListener("resize", handleResize)
        return() => {
          window.removeEventListener("resize", handleResize)
        }
      }, [])
      return size;
    }

    const [height, width] = useWindowSize();

    if(height <= 768 && width <= 768){
      return(
        <div>
      <Layout style={{height: '100%'}}> 
        <Sider className="sidebar" >
          {userObj.USER.category === "user" ?  <Sidebar/> : <ManagerSidebar/> }
        </Sider>
        <Layout>
          <Header className="header" >
            <Headers/>
          </Header>
          <div className="mobile-header">
            {userObj.USER.category ==="user" ? <MobileHeader/>: userObj.USER.category === "manager"?<ManagerHeaderMobile/>: <DirectorHeaderMobile/>}
          </div>
          <Content className="content" > 
          <div  >
              <Card style={{  borderRadius: '10px', fontStyle: 'Montserrat', marginTop: 16, width: 350, height: 300}}  hoverable >
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
              <Card style={{  borderRadius: '10px', fontStyle: 'Montserrat', marginTop: 16, width: 350, height: 450}}  hoverable>
                <ChangePassword/>
              </Card>
            </div>
          </Content>
        </Layout>      
      </Layout>
    </div>
  )
      }

    return (
    <div>
      <Layout> 
        <Sider className="sidebar" >
          {userObj.USER.category === "user"?  <Sidebar/> :  userObj.USER.category === "director"? <DirectorSidebar/> : <ManagerSidebar/>}
        </Sider>
        <Layout>
          <Header className="header" >
            <Headers/>
          </Header>
          <div className="mobile-header">
            {userObj.USER.category ==="user"? <MobileHeader/>: <ManagerHeaderMobile/>}
          </div>
          <Content className="content" > 
              <Row justify="space-around" gutter={16}>
              <Card style={{  borderRadius: '10px', fontStyle: 'Montserrat', marginTop: 16, width: 400, height: 300}}  hoverable >
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
              <Card style={{  borderRadius: '10px', fontStyle: 'Montserrat', marginTop: 16, width: 400, height: 300}}  hoverable>
                <ChangePassword/>
              </Card>
              </div>
              </Row>
          </Content>
        </Layout>      
      </Layout>
    </div>
  )
}

export default Account
