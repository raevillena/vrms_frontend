
import { Input, Button, Form, Row, Col, Modal } from 'antd';
import React, {useState, useEffect} from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios'
import { onUserCreate } from '../services/authAPI';


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
            <Row>
                <Form>
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

                    <Button onClick={onSubmit}>CREATE USER</Button>
                </Form>
            </Row>
        </div>
    )
}

export default Signup
