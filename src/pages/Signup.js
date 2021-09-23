
import { Input, Button, Form, Row, Select, Checkbox, notification } from 'antd';
import React, {useState, useEffect} from 'react';
import { onUserCreate } from '../services/userAPI';
import { onGetAllProject } from '../services/projectAPI';


const Signup = () => {
    const { Option } = Select;
    const [user, setUser] = useState({name: "", email:"", project:"", title:"",password:"", category: ""})
    const [projectData, setProjectData] = useState([]) //for showing all project

    const notif = (type, message) => {
        notification[type]({
          message: 'Notification',
          description:
            message,
        });
      };

    useEffect( () => { //for showing all project
        async function getProjects(){ //for showing all project
            let resultProject = await onGetAllProject()
            let y = resultProject.data
            let tempProjectData = []
            for(let i = 0; i < y.length; i++){ 
                tempProjectData.push({
                    key: y[i].projectName,
                    name:  y[i].projectName,
                    value:  y[i].projectName,
                });
            }
            setProjectData(tempProjectData)
        }

        getProjects()
    }, [])

    const handleProjectChange = value => {
        setUser({...user, project: value})
      };

    async function onSubmit(){
        try {
           let res = await onUserCreate(user) 
            notif('success', res.data.message)
            setUser({name: "", email:"", project:"", title:"",password:""})
        } catch (error) {
            notif('error',error.response.data)
        }
    }

    return (
        <div>
            <Row justify="center" style={{height: '100vh', width: '100%', background: '#f2f2f2'}}>
                <Form >
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
                         <Select defaultValue={projectData[0]} onChange={handleProjectChange} placeholder="Project">
                        {projectData.map(project => (
                        <Option key={project.key} value={project.value}>{project.name}</Option>
                        ))}
                        </Select>
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
                    <Form.Item name="Category" 
                            rules={[
                            {
                                required: true,
                                message: 'Please select category!',
                            },
                            ]}>
                         <label>Category: </label>       
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
