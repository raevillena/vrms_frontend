
import '../styles/CSS/Login.css';
import logo from '../components/images/logo.png'
import { MailOutlined } from '@ant-design/icons';
import { Input, Button, Form, Row, Col } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import React, {useState, useEffect} from 'react';
import { useHistory } from 'react-router-dom';
import Userdash from './Userdash'
import axios from 'axios'

function Login() {
  const  history = useHistory();


  const adminUser = {
    email : "test@test.com",
    password: "1234",
  }

  const [user, setUser] = useState({email:"", password:""});

  function onSubmit(){
  
    const getUser = {
          email: user.email,
          password: user.password
    }
    axios
      .get('/user/', getUser)
      .then(res => {
        console.log(res.data)
      })
      .catch(err => console.log(err))
  }
 
   const onFinishFailed = (errorInfo) => {
     console.log('Failed:', errorInfo);
   };      
  

  return (
    <Row justify="center">
    <Col  className="form-col">
    <Form className="form"name="basic"initialValues={{remember: true,}} onFinish={onSubmit} onFinishFailed={onFinishFailed}>
            
    <div className="login-title">
      <img src={logo} className="login-logo"></img>
        <h1 className="h1">Mariano Marcos State University</h1>
        <h2 className="h2">Virtual Research Management System</h2>
    </div>
    <Col sm={24}  md={24} lg={24}>
    <div className="login-input">
      <Form.Item name="email"
            rules={[
                {
                    required: true,
                    message: 'Please input your email!',
                },
                  ]}
       >
          <Input  placeholder="Enter Email" prefix={<MailOutlined />} onChange={e => setUser({...user, email: e.target.value})} value={user.email}/>
      </Form.Item>

      <Form.Item name="password"
              rules={[
                {
                  required: true,
                   message: 'Please input your password!',
                },
              ]}
        >
          <Input.Password placeholder="Enter password" iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)} onChange={e => setUser({...user, password: e.target.value})} value={user.password}/>
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
