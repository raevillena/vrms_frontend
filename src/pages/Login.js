
import '../styles/CSS/Login.css';
import logo from '../components/images/logo.png'
import { MailOutlined } from '@ant-design/icons';
import { Input, Button, Form } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import React, {useState, useEffect} from 'react';

import { Row, Col } from 'antd';
function Login({Login, error}) {
  const onFinish = (e) => {
    console.log(e);
   
  };
    
   const onFinishFailed = (errorInfo) => {
     console.log('Failed:', errorInfo);
   };      


  return (
    <Row justify="center">
    <Col  className="form-col">
    <Form className="form"name="basic"initialValues={{remember: true,}} onFinish={onFinish} onFinishFailed={onFinishFailed}>
            
    <div className="login-title">
      <img src={logo} className="login-logo"></img>
        <h1 className="h1">Mariano Marcos State University</h1>
        <h2 className="h2">Virtual Research Management System</h2>
    </div>
    <Col sm={24}  md={24} lg={24}>
    <div className="login-input">
      <Form.Item name="username"
            rules={[
                {
                    required: true,
                    message: 'Please input your email!',
                },
                  ]}
       >
          <Input  placeholder="Enter Email" prefix={<MailOutlined />} />
      </Form.Item>

      <Form.Item name="password"
              rules={[
                {
                  required: true,
                   message: 'Please input your password!',
                },
              ]}
        >
          <Input.Password placeholder="Enter password"iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)} />
       </Form.Item>
    </div>   
    </Col> 
    <Col>  
      <Row justify="center">
        <Form.Item >
        <Button className="LoginBtn" htmlType="submit" >LOGIN</Button>
        </Form.Item>   
      </Row>    
    </Col>    
     <Col>
        <Row justify="center">
        <Button type= "link" className="forgot"> Forgot your Password?</Button>
        </Row>
    </Col>   
</Form>
    </Col>
  </Row>
  )
}

export default Login;
