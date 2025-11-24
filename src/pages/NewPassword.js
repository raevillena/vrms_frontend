import React, {useState, useEffect} from 'react';
import { Input, Button, Form, Row,Typography, notification} from 'antd';
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

    const notif = (type, message) => {
      notification[type]({
        message: 'Notification',
        description:
          message,
      });
    };

    useEffect(() => {
      async function verifyToken() {
        await onVerifyResetPasswordToken(token)
      }
      if (token === undefined) {
        history.push('/')
      } else {
        verifyToken() 
      }
    }, [token, history])

    async function handleSubmit()  {
      const newPass = newPassword.newPassword
      const confirmPass = newPassword.confirmPassword
    try {
      if(newPass !== confirmPass){
        notif('error',"Password does not match!")
      }else{
        await onResetPassword(token,newPassword) 
        notif('info',"Password Updated")
        history.push('/')
        }
      } catch (error) {
        notif('error',"Link already expired!")
        history.push('/')
      }
      };

    return (
      <div style={{background: '#f2f2f2', minHeight: "100vh"}}>
      <Row justify="center">
        <Form style={{marginTop: "20%"}}>
          <Title level={2} style={{fontFamily: "Bangla MN", fontWeight: "bolder"}}>Password Reset</Title>
          <Form.Item > 
            <Input.Password placeholder="Enter new password" iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)} onChange={e => setNewPassword({...newPassword,newPassword: e.target.value})} value={newPassword.newPassword}/>
          </Form.Item>
          <Form.Item> 
            <Input.Password placeholder="Confirm new password" iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)} onChange={e => setNewPassword({...newPassword, confirmPassword: e.target.value})} value={newPassword.confirmPassword}/>
          </Form.Item>
          <Form.Item> 
            <Button block style={{background: "#A0BF85", borderRadius: "5px"}} onClick={handleSubmit}>SUBMIT</Button>
          </Form.Item>
        </Form>
      </Row>
      </div>
    )
}

export default NewPassword
