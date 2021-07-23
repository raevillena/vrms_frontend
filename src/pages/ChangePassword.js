import { Button, Form, Input, Typography} from 'antd'
import React, {useState} from 'react';
import { useSelector} from 'react-redux';
import {EyeInvisibleOutlined, EyeTwoTone} from '@ant-design/icons';
import { onChangePassword } from '../services/userAPI';
import '../styles/CSS/Account.css'

const ChangePassword = () => {
    const userObj = useSelector(state => state.user) //reducer for user data
    const [password, setPassword] = useState({oldPassword: "", newPassword: "", confrimPassword: ""}) //for changepassword
    const { Title } = Typography;

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
               setPassword({oldPassword: "", newPassword: "", confrimPassword: ""})
           }
        } catch (error) {
           console.log(error)
           alert("Invalid password")
        }
     }

    return (
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
              <Button htmlType="submit" style={{background: "#A0BF85", borderRadius: "5px"}} >SUBMIT</Button>
            </Form.Item>
    </Form>
    )
}

export default ChangePassword
