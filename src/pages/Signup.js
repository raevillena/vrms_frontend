
import { Input, Button, Form, Row } from 'antd';
import React, {useState} from 'react';
import { onUserCreate } from '../services/userAPI';


const Signup = () => {

    const [user, setUser] = useState({name: "", email:"", project:"", title:"",password:""})

    async function onSubmit(){
        try {
            await onUserCreate(user)  
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div>
            <Row justify="center" style={{minHeight: '100vh', background: '#f2f2f2'}}>
                <Form style={{marginTop: '25%'}}>
                <h1 style={{fontFamily: "Montserrat", fontWeight: "bolder"}}>SIGN UP</h1>
                    <Form.Item name="Name" 
                    rules={[
                        {
                        required: true,
                        message: 'Please input your name!',
                        },
                    ]}>
                        <Input placeholder="Enter Name" onChange={e => setUser({...user, name: e.target.value})} value={user.name}></Input>
                    </Form.Item>
                    <Form.Item name="Email"
                            rules={[
                                {
                                    type:'email',
                                required: true,
                                message: 'Please input your email!',
                                },
                            ]}>
                        <Input placeholder="Enter Email" onChange={e => setUser({...user, email: e.target.value})} value={user.email}></Input>
                    </Form.Item>
                    <Form.Item name="Project" 
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your project!',
                                },
                                ]}>
                        <Input placeholder="Enter Project" onChange={e => setUser({...user, project: e.target.value})} value={user.project}></Input>
                    </Form.Item>
                    
                    <Form.Item name="Title" 
                            rules={[
                            {
                                required: true,
                                message: 'Please input your title!',
                            },
                            ]}>
                        <Input placeholder="Enter Title" onChange={e => setUser({...user, title: e.target.value})} value={user.title}></Input>
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