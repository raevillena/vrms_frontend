
import { Input, Button, Form, Row, Col, Modal, Typography} from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone, MailOutlined} from '@ant-design/icons';
import React, {useState, useEffect} from 'react';
import { useHistory } from 'react-router-dom';
import {onUserLogin } from '@services/authAPI';
import { useSelector, useDispatch } from 'react-redux';



function Login() {
  const  history = useHistory();
  const dispatch = useDispatch();

  const { Title } = Typography;
  
  const [user, setUser] = useState({email:"", password:""}); //for login state
  
  async function onSubmit(){
    const getUser = {
      email: user.email,
      password: user.password
    }
    try {
      let result = await onUserLogin(getUser)
      
      localStorage.setItem("accessToken", result.data.accessToken);
      localStorage.setItem("refreshToken", result.data.token.refreshToken);

      dispatch({
        type: "SET_USER",
        value: result.data.data
     })
      
      dispatch({
        type: "VERIFIED_AUTHENTICATION",
        value: true
     })

     dispatch({
      type: "LOGIN_SUCCESS"
   })
    
      history.push('/dash ')

    } catch (error) {
      alert(error.response.data.message)
      dispatch({
        type: "GET_ERRORS",
        message: error.response.data.message,
        status: error.response.status
      })
      dispatch({
        type: "LOGIN_FAIL",
      })
    }
  }
 
  const forgotPassword = () => {
    history.push('/forgotpassword')
  }
 
  
  
  return (
    <body style={{background: '#f2f2f2', minHeight: "100vh"}}>
    <Row justify="center">
    <Col  >
      <Form style={{marginTop: "50%"}} name="basic"initialValues={{remember: true,}} onFinish={onSubmit}>
      <Title level={4} style={{fontFamily: "Bangla MN", fontWeight: "bolder"}}>VIRTUAL REASEARCH MANAGEMENT SYSTEM</Title>
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
        <Form.Item><Button type= "link" style={{fontFamily: "Montserrat",color: "#000000", float: 'right'}} onClick={forgotPassword}> Forgot your password?</Button></Form.Item>
        <Form.Item><Button block style={{background: "#A0BF85", borderRadius: "5px"}} htmlType="submit" >LOGIN</Button></Form.Item>
        
    </Form>
    </Col>
    </Row>
    </body>
  )
}


export default Login;