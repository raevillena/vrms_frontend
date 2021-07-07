import { Row, Layout, Button, Form, Input, Typography, Upload, Modal, Avatar, Col } from 'antd'
import React, {useState, useEffect} from 'react';
import { useSelector} from 'react-redux';
import {EyeInvisibleOutlined, EyeTwoTone, PlusOutlined, UserOutlined} from '@ant-design/icons';
import Sidebar from '../components/components/Sidebar'
import { onChangePassword } from '../services/userAPI';
import Headers from '../components/components/Header'
import Mobile from '../pages/mobile/Userdash'
import { onUploadAvatar } from '../services/uploadAPI';
import '../styles/CSS/Account.css'

const { Header, Content, Sider } = Layout;

const Account = () => {
    const userObj = useSelector(state => state.userReducer) //reducer for user data
    const [password, setPassword] = useState({oldPassword: "", newPassword: "", confrimPassword: ""}) //for changepassword
    const[file, setFile] = useState(); //for uploading avatar
    const { Title } = Typography;
    console.log(userObj)
    //for change password
    async function onSubmit(){
       try {
         console.log(userObj.USER._id)
          const data = {
            id : userObj.USER._id,
            newPass: password.newPassword,
            oldPass: password.oldPassword
          }
           if(password.newPassword !== password.confrimPassword){
            alert("Password does not match!")
           }else{
              await onChangePassword(data)
              alert("Password Updated")
          }
       } catch (error) {
          console.log(error)
          alert("Invalid password")
       }
    }
    
   //for mobile UI 
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

  //for mobile ui
  const [height, width] = useWindowSize();
  if(height <= 768 && width <= 768){
    return <Mobile/>}


    return (
    <div>
      <Layout  > 
        <Sider  style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          background:'white'
        }} >
          <Sidebar/>
        </Sider>
        <Layout style={{ marginLeft: 200 }}>
          <Header style={{ padding: 0, background:'#f2f2f2' }} >
            <Headers/>
          </Header>
          <Content style={{ margin: '24px 16px 0', minHeight: "100vh" }} > 
          <div style={{display: 'flex', flexDirection: 'row'}}>
            <Row style={{rowGap:'0px', gap: '10px'}} >
            <div style={{borderRadius: "10px", background:"white", fontFamily: "Montserrat"}}>
              <Row style={{marginTop:'10px', marginLeft: '10px', justifyContent:'center', alignItems:'center', margintTop: '20px'}}>
                <Col span={10} >
              <div style={{marginLeft:'10px', marginTop:'15px'}} >
              <Avatar src={userObj.USER.avatar}  size={128} icon={<UserOutlined />} />
              <label for="file_input_id">Upload Photo</label>
              <input type="file" id="file_input_id" accept=".png" onChange={e => {
                const file = e.target.files[0]
                console.log(file)
                setFile(file)
                const data = new FormData()
                data.append("user", userObj.USER._id )
                data.append("file", file)
                onUploadAvatar(data)
              }
            }
              ></input>
              </div>
              </Col>
              <Col span={14}>
                <div style={{justifyContent:'center', display:'grid', alignItems:'center'}}>
                <Title style={{margin: '0px'}} level={3}>{userObj.USER.name}</Title>
                <p style={{margin: '0px'}}>{userObj.USER.title}</p>
                <p style={{margin: '0px'}}>{userObj.USER.project}</p>
                <p style={{margin: '0px'}}>{userObj.USER.email}</p>
                </div>
                </Col>
              </Row>
            </div>
            
            <Form style={{borderRadius: "10px", background:"white", fontFamily: "Montserrat", display: 'grid', justifyItems: 'center'}} onFinish={onSubmit}>
                <Title level={3}>Change Password</Title>
                <Form.Item  style={{maxWidth:"50%", margin:'0px'}}
                    rules={[
                      {
                        required: true,
                        message: 'Please enter your current password!',
                      },
                    ]}
                >
                  <label>Current Password</label>
                  <Input.Password placeholder="Current Password" iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)} 
                  onChange={e => setPassword({...password, oldPassword: e.target.value})} value={password.oldPassword}/>
                </Form.Item>
                <Form.Item  style={{maxWidth:"50%", margin:'0px'}}
                  rules={[
                  {
                    required: true,
                    message: 'Please input your new password!',
                  },
                ]}
                >
                <label>New Password</label>
                <Input.Password placeholder="New Password" iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)} 
                  onChange={e => setPassword({...password, newPassword: e.target.value})} value={password.newPassword}/>
                </Form.Item>
                <Form.Item   style={{maxWidth:"50%", marginTop:'0px'}}
                    rules={[
                      {
                        required: true,
                        message: 'Please confirm your new password!',
                      },
                    ]}
                >
                  <label>Confirm Password</label>
                  <Input.Password placeholder="Confirm New Password" iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)} 
                  onChange={e => setPassword({...password, confrimPassword: e.target.value})} value={password.confrimPassword}
                />
                </Form.Item>
                <Form.Item>
                  <Button htmlType="submit" style={{background: "#A0BF85", borderRadius: "5px"}}>SUBMIT</Button>
                </Form.Item>
        </Form>
        </Row>
      </div>
        </Content>
        
      </Layout>      
      </Layout>
    </div>
    )
    

}

export default Account
