import { useHistory } from 'react-router-dom';
import { Layout, Menu, Button, Form, Input} from 'antd'
import React, {useState, useEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import logo from '../components/images/logo.png'
import { BookOutlined, UserOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import Sidebar from '../components/components/Sidebar'



const { Header, Content, Sider } = Layout;

const Account = () => {
    let history= useHistory();
    const dispatch = useDispatch();
    const userObj = useSelector(state => state.userReducer)
    
   
    
    const handleLogout = async () => {
        try {
    
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

    const dataGathering = async () => {
        try {
          history.push("/datagrid")
        } catch (error) {
          console.log(error)
        }
      }

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
        <Sidebar></Sidebar>
      </Sider>
    <Layout style={{ marginLeft: 200 }}>
      <Header style={{ padding: 0, background:'#f2f2f2' }} >
      <a href="/dash"style={{padding: '25px', fontSize: '32px', color: 'black', fontFamily: 'Montserrat'}} >Account</a>
        <a  onClick={handleLogout}  style={{float: 'right', color:'black', fontFamily: 'Montserrat'}}>Logout</a>
      </Header>
      <Content style={{ margin: '24px 16px 0', overflow: 'initial' }} >        
      <Form style={{borderRadius: "10px", background:"white"}}>
          <Form.Item>picture</Form.Item>
          <Form.Item><label>Name:</label>{userObj.USER.name}</Form.Item>
          <Form.Item><label>Title:</label>{userObj.USER.title}</Form.Item>
          <Form.Item><label>Project:</label>{userObj.USER.project}</Form.Item>
          <Form.Item><label>Email:</label>{userObj.USER.email}</Form.Item>
      </Form>
      <Form>
          <h1>CHANGE PASSWORD</h1>
      <Form.Item 
              rules={[
                {
                  required: true,
                   message: 'Please current your password!',
                },
              ]}
        >
            <label>Current Password</label>
          <Input.Password placeholder="Current Password" iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)} />
       </Form.Item>
       <Form.Item 
              rules={[
                {
                  required: true,
                   message: 'Please input your new password!',
                },
              ]}
        >
            <label>New Password</label>
          <Input.Password placeholder="New Password" iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)} />
       </Form.Item>
      </Form>
      <Form.Item 
              rules={[
                {
                  required: true,
                   message: 'Please confirm your new password!',
                },
              ]}
        >
            <label>Confirm Password</label>
          <Input.Password placeholder="Confirm New Password" iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)} />
        <Form.Item>
            <Button htmlType="submit">SUBMIT</Button>
        </Form.Item>
       </Form.Item>
      </Content>
      
    </Layout>      
</Layout>
        </div>
    )
}

export default Account
