import { Button, Form, Input, Typography, notification} from 'antd'
import React, {useState} from 'react';
import { useSelector} from 'react-redux';
import {EyeInvisibleOutlined, EyeTwoTone} from '@ant-design/icons';
import { onChangePassword } from '../services/userAPI';
import '../styles/CSS/Account.css'

const ChangePassword = () => {
    const userObj = useSelector(state => state.user) //reducer for user data
    const [password, setPassword] = useState({oldPassword: "", newPassword: "", confrimPassword: ""}) //for changepassword
    const { Title } = Typography;

    const [form] = Form.useForm();

    const initialValues = {oldPassword: "", newPassword: "", confrimPassword: ""}

    const notif = (type, message) => {
      notification[type]({
        message: 'Notification',
        description:
          message,
      });
    };

    //for change password
    async function onSubmit(){
      try {
          const data = {
            id : userObj.USER._id,
            newPass: password.newPassword,
            oldPass: password.oldPassword
          }
          if(password.newPassword !== password.confrimPassword){
            notif('error', 'Password does not match!')
          }else{
              let result = await onChangePassword(data)
              form.resetFields()
              setPassword({oldPassword: "", newPassword: "", confrimPassword: ""})
              notif('success', result.data.message)
           }
        } catch (error) {
           notif('error', 'Invalid Password!')
        }
     }

  return (
    <Form name="basic"  style={{fontFamily: "Montserrat"}} onFinish={onSubmit} initialValues={initialValues} form={form}>
      <Title level={2}>Change Password</Title>
        <Form.Item name="cpassword"  label="Current Password"
          rules={[
            {
              required: true,
              message: 'Please enter your current password!',
            },
            ]}
        >
          <Input.Password placeholder="Current Password" iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)} 
            onChange={e => setPassword({...password, oldPassword: e.target.value})} value={password.oldPassword}/>
        </Form.Item>
        <Form.Item name="npassword"  label="New Password" hasFeedback
            rules={[
            {
              required: true,
              message: 'Please input your new password!',
            },
            {
              min: 8,
              message: 'Password cannot be less than 8 characters'
            },
            {
              pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
              message: `Password must atleast consist 1 uppercase letter, 1 lowercase, 1 special character.`
           }
          ]}
        >
          <Input.Password placeholder="New Password" style={{marginLeft: '5px', marginRight: '5px'}} iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)} 
            onChange={e => setPassword({...password, newPassword: e.target.value})} value={password.newPassword}/>
        </Form.Item>
        <Form.Item name='ccpassword' label="Confirm Password" hasFeedback
            rules={[
              {
                required: true,
                message: 'Please confirm your new password!',
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('npassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('The two passwords that you entered do not match!'));
                },
              }),
            ]}
        >
          <Input.Password placeholder="Confirm New Password" iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)} 
          onChange={e => setPassword({...password, confrimPassword: e.target.value})} value={password.confrimPassword}
        />
        </Form.Item>
        <Form.Item>
          <Button block htmlType="submit" style={{background: "#A0BF85", borderRadius: "5px"}} >SUBMIT</Button>
        </Form.Item>
    </Form>
  )
}

export default ChangePassword
