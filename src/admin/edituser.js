
import { Input, Button, Form, Select, notification } from 'antd';
import React, {useState, useEffect} from 'react';
import { onResetPasswordAdmin, onUpdateUserAdmin } from '../services/userAPI';



const EditUser = (props) => {
    const { Option } = Select;
    const [user, setUser] = useState({name: props.data.name, 
        email:props.data.email, 
        project:'', 
        title: props.data.title, 
        password:"", 
        category: props.data.category, 
        id: props.data.key})
    const usertype = ['user', 'manager', 'director', 'admin']

    const [form] = Form.useForm();

    const initialValues = {name: props.data.name, 
        email: props.data.email, 
        project: props.data.project, 
        title:props.data.title,password:"", 
        category: props.data.category}

    const notif = (type, message) => {
        notification[type]({
          message: 'Notification',
          description:
            message,
        });
      };

      useEffect(() => {
          setUser({name: props.data.name, 
            email:props.data.email, 
            project:'', 
            title: props.data.title, 
            password:"", 
            category: props.data.category, 
            id: props.data.key})

            form.resetFields()
      }, [props.data])

    async function onSubmit(){
        try {
           let res = await onUpdateUserAdmin(user) 
           props.func(user);
            notif('success', res.data.message)
        } catch (error) {
            notif('error',error.response.data)
        }
    }

    async function onReset(){
        try {
           let res = await onResetPasswordAdmin(user) 
           notif('success', res.data.message)
        } catch (error) {
            notif('error',error.response.data)
        }
    }

    function handleChange(value) {
        setUser({...user, category: value})
      }

    return (
        <div>
                <Form initialValues={initialValues} form={form}>
                    <Form.Item name="name" label="Name"
                    rules={[
                        {
                        required: true,
                        message: 'Please input your name!',
                        },
                    ]}>
                        <Input placeholder="Enter Name" onChange={e => setUser({...user, name: e.target.value})} value={user.name}></Input>
                    </Form.Item>
                    <Form.Item name="email" label="Email"
                            rules={[
                                {
                                    type:'email',
                                required: true,
                                message: 'Please input your email!',
                                },
                            ]}>
                        <Input placeholder="Enter Email" onChange={e => setUser({...user, email: e.target.value})} value={user.email}></Input>
                    </Form.Item>
                    <Form.Item name="title" label="Job Title"
                            rules={[
                            {
                                required: true,
                                message: 'Please input your title!',
                            },
                            ]}>
                        <Input placeholder="Enter Job Title" onChange={e => setUser({...user, title: e.target.value})} value={user.title}></Input>
                    </Form.Item>
                    <Form.Item name="category" label="Category"
                            rules={[
                            {
                                required: true,
                                message: 'Please select category!',
                            },
                            ]}>   
                        <Select  style={{ width: '100%' }} onChange={handleChange} value={user.category}  placeholder="Select Category">
                            {usertype.map(program => (
                                <Option key={program} value={program}>{program}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Button onClick={onReset} block style={{background: "#A0BF85", borderRadius: "5px"}}>Reset Password</Button>
                    <Button onClick={onSubmit} block style={{background: "#A0BF85", borderRadius: "5px"}}>Update User</Button>
                </Form>
        </div>
    )
}

export default EditUser
