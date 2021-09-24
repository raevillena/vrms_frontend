
import { Input, Button, Form, Row, Checkbox, notification } from 'antd';
import React, {useState} from 'react';
import { onUserCreate } from '../services/userAPI';



const Signup = () => {
    const [user, setUser] = useState({name: "", email:"", project:"", title:"",password:"", category: ""})

    const notif = (type, message) => {
        notification[type]({
          message: 'Notification',
          description:
            message,
        });
      };

    async function onSubmit(){
        try {
           let res = await onUserCreate(user) 
           setUser({name: "", email:"", title:"",password:"", category: ''})
            notif('success', res.data.message)
        } catch (error) {
            notif('error',error.response.data)
        }
    }

    return (
        <div>
            <Row justify="center" style={{height: '100vh', width: '100%', background: '#f2f2f2'}}>
                <Form >
                <h1 style={{fontFamily: "Montserrat", fontWeight: "bolder"}}>Create User</h1>
                    <Form.Item name="Name" label="Name"
                    rules={[
                        {
                        required: true,
                        message: 'Please input your name!',
                        },
                    ]}>
                        <Input placeholder="Enter Name" onChange={e => setUser({...user, name: e.target.value})} value={user.name}></Input>
                    </Form.Item>
                    <Form.Item name="Email" label="Email"
                            rules={[
                                {
                                    type:'email',
                                required: true,
                                message: 'Please input your email!',
                                },
                            ]}>
                        <Input placeholder="Enter Email" onChange={e => setUser({...user, email: e.target.value})} value={user.email}></Input>
                    </Form.Item>
                    <Form.Item name="Title" label="Job Title"
                            rules={[
                            {
                                required: true,
                                message: 'Please input your title!',
                            },
                            ]}>
                        <Input placeholder="Enter Job Title" onChange={e => setUser({...user, title: e.target.value})} value={user.title}></Input>
                    </Form.Item>
                    <Form.Item name="Category" label="Category"
                            rules={[
                            {
                                required: true,
                                message: 'Please select category!',
                            },
                            ]}>   
                        <Checkbox onChange={e => setUser({...user, category: e.target.checked? "user": ""})} value="user">User</Checkbox>
                        <Checkbox onChange={e => setUser({...user, category: e.target.checked? "manager": ""})} value="manager">Manager</Checkbox>
                        <Checkbox onChange={e => setUser({...user, category: e.target.checked? "director": ""})} value="director">Director</Checkbox>
                    </Form.Item>
                    <Row justify="center">
                    <Button onClick={onSubmit} style={{background: "#A0BF85", borderRadius: "5px"}}>CREATE USER</Button>
                    </Row>
                </Form>
            </Row>
        </div>
    )
}

export default Signup
