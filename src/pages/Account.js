import { Row, Layout, Typography,Avatar, notification, Col } from 'antd'
import React, {useState, useEffect} from 'react';
import { useSelector} from 'react-redux';
import {UserOutlined} from '@ant-design/icons';
import Sidebar from '../components/components/Sidebar'
import ManagerSidebar from '../components/components/ManagerSidebar';
import Headers from '../components/components/Header'
import { onUploadAvatar } from '../services/uploadAPI';
import '../styles/CSS/Account.css'
import ChangePassword from './ChangePassword';
import MobileHeader from '../components/components/MobileHeader';
import ManagerHeaderMobile from '../components/components/ManagerHeaderMobile';

const { Header, Content, Sider } = Layout;

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
      <Layout> 
        <Sider className="sidebar" >
          {userObj.USER.category === "user"?  <Sidebar/> : <ManagerSidebar/>}
        </Sider>
        <Layout>
          <Header className="header" >
            <Headers/>
          </Header>
          <div className="mobile-header">
            {userObj.USER.category ==="user"? <MobileHeader/>: <ManagerHeaderMobile/>}
          </div>
          <Content className="content" > 
            <div className="content-col" >
              <Col >
                <Col span={22} style={{borderRadius: "10px", background:"white", fontFamily: "Montserrat"}}>
                  <Row  style={{marginTop:'10px', marginLeft: '10px', justifyContent:'center', alignItems:'center', margintTop: '20px', display:'flex', marginRight:'20px', marginBottom:'20px'}}>
                  <Col span={12} >
                    <Avatar src={imgData||`/avatar/${avatar}`}  size={128} icon={<UserOutlined />} />
                    <label htmlFor="file_input_id" style={{marginLeft: '20px'}}>Upload Photo</label>
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
                  </Col>
                    <Col span={12} style={{justifyContent:'center', display:'grid', alignItems:'center'}}>
                      <Title style={{margin: '0px'}} level={3}>{userObj.USER.name}</Title>
                      <p style={{margin: '0px'}}>{userObj.USER.title}</p>
                      <p style={{margin: '0px'}}>{userObj.USER.project}</p>
                      <p style={{margin: '0px'}}>{userObj.USER.email}</p>
                    </Col>
                  </Row>
                </Col>
                <Row ><ChangePassword/></Row>
              </Col>
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
          {userObj.USER.category === "user"?  <Sidebar/> : <ManagerSidebar/>}
        </Sider>
        <Layout>
          <Header className="header" >
            <Headers/>
          </Header>
          <div className="mobile-header">
            {userObj.USER.category ==="user"? <MobileHeader/>: <ManagerHeaderMobile/>}
          </div>
          <Content className="content" > 
            <div className="content-col" >
              <Row wrap={true} gutter={16}>
                <Col span={12} style={{borderRadius: "10px", background:"white", fontFamily: "Montserrat"}}>
                  <Row style={{marginTop:'10px', marginLeft: '10px', justifyContent:'center', alignItems:'center', margintTop: '20px', display:'flex', marginRight:'20px', marginBottom:'20px'}}>
                  <Col span={12}  >
                    <Avatar src={imgData||`/avatar/${avatar}`}  size={128} icon={<UserOutlined />} />
                    <label htmlFor="file_input_id" style={{marginLeft: '20px'}}>Upload Photo</label>
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
                  </Col>
                    <Col span={12} style={{justifyContent:'center', display:'grid', alignItems:'center'}}>
                      <Title style={{margin: '0px'}} level={3}>{userObj.USER.name}</Title>
                      <p style={{margin: '0px'}}>{userObj.USER.title}</p>
                      <p style={{margin: '0px'}}>{userObj.USER.project}</p>
                      <p style={{margin: '0px'}}>{userObj.USER.email}</p>
                    </Col>
                  </Row>
                </Col>
                <Col span={12}><ChangePassword/></Col>
              </Row>
            </div>
          </Content>
        </Layout>      
      </Layout>
    </div>
  )
}

export default Account
