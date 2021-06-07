
import './CSS/Login.css';
import logo from './images/logo.png'
import background from './images/loginpage.png'
import { MailOutlined } from '@ant-design/icons';
import { Input, Button, Form } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import React, {useState, useEffect} from 'react';
import { BrowserRouter, Route } from "react-router-dom"; 
import Userdash from './Userdash';

function Login() {


    const onFinish = (e) => {
        console.log(e)
      };
    
      const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
      };      

    

  return (
      
      <div>
          <img src={background} className="background"></img>
          <Form className="form"name="basic"initialValues={{remember: true,}} onFinish={onFinish} onFinishFailed={onFinishFailed}>
              <h1 className="h1">Mariano Marcos State University</h1>
              <h2 className="h2">Virtual Research Management System</h2>
              <img src={logo} className="logo"></img>
              <Form.Item className="EmailInput"name="username"
                    rules={[
                      {
                          required: true,
                          message: 'Please input your email!',
                        },
                  ]}
              >
                   <Input  placeholder="Enter Email" prefix={<MailOutlined />} />
               </Form.Item>

              <Form.Item className = "PasswordInput"
                  name="password"
                   rules={[
                      {
                           required: true,
                           message: 'Please input your password!',
                      },
                   ]}
              >
                  <Input.Password placeholder="Enter password"iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}/>
              </Form.Item>

              <Form.Item >
              <Button className="LoginBtn"  htmlType="submit" >LOGIN</Button>
               </Form.Item>

               <Button type= "link" className="forgot"> Forgot your Password?</Button>

              </Form>
   </div>
  )
}

export default Login;
