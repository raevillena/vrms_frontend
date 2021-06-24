import { useHistory } from 'react-router-dom';
import { Layout, Menu, Button, Form, Input} from 'antd'
import React, {useState, useEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import logo from '../components/images/logo.png'
import { BookOutlined, UserOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import Sidebar from '../components/components/Sidebar'
import { onChangePassword } from '../services/userAPI';
import { onUserLogout } from '../services/authAPI';



const { Header, Content, Sider } = Layout;

const Account = () => {
    let history= useHistory();
    const dispatch = useDispatch();
    const userObj = useSelector(state => state.userReducer)
    const [password, setPassword] = useState({oldPassword: "", newPassword: "", confrimPassword: ""})

    async function onSubmit(){
       try {
         console.log(userObj.USER._id)
          const data = {
            id : userObj.USER._id,
            newPass: password.newPassword,
            oldPass: password.oldPassword
          }
           if(password.newPassword != password.confrimPassword){
            alert("Password does not match!")
           }else{
              await onChangePassword(data)
              alert("Successfully Updated Password")
          }
       } catch (error) {
           console.log(error)
       }
    }
    
    const handleLogout = async () => {
   
      try {
        const tokens = {
          refreshToken: localStorage.getItem("refreshToken"),
          accessToken: localStorage.getItem("accessToken")
        }
        
        onUserLogout(tokens)
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        dispatch({
          type: "VERIFIED_AUTHENTICATION",
          value: false
       })
        history.push('/')
      } catch (error) {
        console.error(error)
        alert(error.response.data.error);
      }
    };


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
      <a href="/dash"style={{padding: '25px', fontSize: '32px', color: 'black', fontFamily: 'Montserrat'}} >Account</a>
        <a  onClick={handleLogout}  style={{float: 'right', color:'black', fontFamily: 'Montserrat', margin: '0px 16px 0'}}>Logout</a>
      </Header>
      <Content style={{ margin: '24px 16px 0', overflow: 'initial', minHeight: "100vh" }} >        
      <Form style={{borderRadius: "10px", background:"white",maxWidth: "40%", fontFamily: "Montserrat"}}>
          <Form.Item>picture</Form.Item>
          <Form.Item>{userObj.USER.name}</Form.Item>
          <Form.Item>{userObj.USER.title}</Form.Item>
          <Form.Item>{userObj.USER.project}</Form.Item>
          <Form.Item>{userObj.USER.email}</Form.Item>
      </Form>
      <Form style={{borderRadius: "10px", background:"white", maxWidth:"40%", fontFamily: "Montserrat"}}>
          <h1>CHANGE PASSWORD</h1>
      <Form.Item style={{maxWidth:"50%"}}
              rules={[
                {
                  required: true,
                   message: 'Please current your password!',
                },
              ]}
        >
            <label>Current Password</label>
          <Input.Password placeholder="Current Password" iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)} 
          onChange={e => setPassword({...password, oldPassword: e.target.value})} value={password.oldPassword}
          />
       </Form.Item>
       <Form.Item style={{maxWidth:"50%"}}
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
      <Form.Item style={{maxWidth:"50%"}}
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
            <Button htmlType="submit" style={{background: "#A0BF85", borderRadius: "5px"}}onClick={onSubmit}>SUBMIT</Button>
        </Form.Item>
       </Form>
      </Content>
      
    </Layout>      
</Layout>
        </div>
    )
}

export default Account
