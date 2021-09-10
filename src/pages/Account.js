import { Row, Layout, Typography,Avatar, notification } from 'antd'
import React, {useState} from 'react';
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
   // const[file, setFile] = useState(); //for uploading avatar
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
              <Row style={{gap: '10px'}} >
                <div style={{borderRadius: "10px", background:"white", fontFamily: "Montserrat"}}>
                  <Row style={{marginTop:'10px', marginLeft: '10px', justifyContent:'center', alignItems:'center', margintTop: '20px', display:'flex', gap:'20px', marginRight:'20px', marginBottom:'20px'}}>
                  <div style={{marginLeft:'10px', marginTop:'15px', display:'grid'}} >
                    <Avatar src={imgData||`/avatar/${avatar}`}  size={128} icon={<UserOutlined />} />
                    <label for="file_input_id" style={{marginLeft: '20px'}}>Upload Photo</label>
                    <input type="file" id="file_input_id" accept="image/*" onChange={async e => {
                      const file = e.target.files[0]
                      //setFile(file)
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
                    ></input>
                  </div>
                    <div style={{justifyContent:'center', display:'grid', alignItems:'center'}}>
                    <Title style={{margin: '0px'}} level={3}>{userObj.USER.name}</Title>
                    <p style={{margin: '0px'}}>{userObj.USER.title}</p>
                    <p style={{margin: '0px'}}>{userObj.USER.project}</p>
                    <p style={{margin: '0px'}}>{userObj.USER.email}</p>
                    </div>
                  </Row>
                </div>
                <div><ChangePassword/></div>
              </Row>
            </div>
          </Content>
        
      </Layout>      
      </Layout>
    </div>
    )
    

}

export default Account
