import React, {useState, useEffect} from 'react';
import { Input, Button, Form, Row, Col, Typography} from 'antd';
import {MailOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { onForgotPassword } from '../services/userAPI';

const Forgotpassword = () => {
    const  history = useHistory();
    const dispatch = useDispatch();
    const { Title } = Typography;
    const [email, setEmail] = useState({email: ""});

    async function handleOk()  {
        try {
          let result = await onForgotPassword(email)
          alert("password reset link already sent to your email")
        } catch (error) {
          alert(error.response.data.message)
          dispatch({
            type: "GET_ERRORS",
            message: error.response.data.message,
            status: error.response.status
          })
        }
      };

      async function login (){
        try {
            history.push('/')
        } catch (error) {
            dispatch({
                type: "GET_ERRORS",
                message: error.response.data.message,
                status: error.response.status
              })
        }
      }
    
    return (
        <body style={{background: '#f2f2f2', minHeight: "100vh"}}>
        <Row justify="center">
        <Form style={{marginTop: "20%"}}>
            <Title level={2} style={{fontFamily: "Bangla MN", fontWeight: "bolder"}}>Need help with your password?</Title>
            <p>Enter the email you use for Virtual Research Management System, and we’ll help you create a new password.</p>
            <Form.Item> <Input placeholder="Enter Email" prefix={<MailOutlined/>} onChange={e => setEmail({email: e.target.value})} value={email.email}></Input></Form.Item>
            <Form.Item> <Button block style={{background: "#A0BF85", borderRadius: "5px"}} onClick={handleOk}>SUBMIT</Button></Form.Item>
            <Button type='link' block style={{fontFamily: "Montserrat",color: "#000000"}} onClick={login}>LOGIN</Button>
        </Form>
        </Row>
        </body>
    )
}

export default Forgotpassword
