import React, {useState, useEffect} from 'react';
import { Input, Button, Form, Row,Typography} from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { useHistory } from 'react-router-dom';
import {onVerifyResetPasswordToken, onResetPassword } from '../services/userAPI';
import * as QueryString from "query-string"

const NewPassword = () => {
    const  history = useHistory();
    const { Title } = Typography;
    const [newPassword, setNewPassword] = useState({newPassword: "", confirmPassword: ""});
    const queryParams = QueryString.parse(window.location.search);
    const token = queryParams  &&  queryParams.token ?  queryParams.token : undefined

    useEffect(() => {
      async function verifyToken() {
        let result = await onVerifyResetPasswordToken(token)
        console.log(result)
      }
      if (token === undefined) {
        history.push('/')
      } else {
        verifyToken() 
      }
    }, [])

    async function handleSubmit()  {
      const newPass = newPassword.newPassword
      const confirmPass = newPassword.confirmPassword
    try {
      if(newPass !== confirmPass){
        alert("Password does not match!")
      }else{
        await onResetPassword(token,newPassword) 
        alert("Password Updated")
        history.push('/')
        }
      } catch (error) {
        alert("Link already expired!")
        history.push('/')
      }
      };

    return (
        <div style={{background: '#f2f2f2', minHeight: "100vh"}}>
        <Row justify="center">
        <Form style={{marginTop: "20%"}}>
            <Title level={2} style={{fontFamily: "Bangla MN", fontWeight: "bolder"}}>Password Reset</Title>
            <Form.Item> <Input.Password placeholder="Enter new password" iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)} onChange={e => setNewPassword({...newPassword,newPassword: e.target.value})} value={newPassword.newPassword}/></Form.Item>
            <Form.Item> <Input.Password placeholder="Confirm new password" iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)} onChange={e => setNewPassword({...newPassword, confirmPassword: e.target.value})} value={newPassword.confirmPassword}/></Form.Item>
            <Form.Item> <Button block style={{background: "#A0BF85", borderRadius: "5px"}} onClick={handleSubmit}>SUBMIT</Button></Form.Item>
        </Form>
        </Row>
        </div>
    )
}

export default NewPassword
