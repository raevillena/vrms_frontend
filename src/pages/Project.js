import { Input, Button, Form, Row, Select} from 'antd';
import React, {useState, useEffect} from 'react';
import { onProjectCreate } from '../services/projectAPI.js';
import { onGetAllUsers } from '../services/userAPI';

const Project = () => {
    const { Option } = Select;
    const [userData, setUserData] = useState([])
    const [project, setProject] = useState({projectName: '', assignee: ''});

    function handleChange(value) {   //for assigning user
        setProject({...project, assignee: value})
    }

    async function getUsers(){
        let resultUsers = await onGetAllUsers()
        console.log(resultUsers)
        let x = resultUsers.data
        let tempUserData = []
        for(let i = 0; i < x.length; i++){ 
            tempUserData.push({
                key: x[i].name,
                name:  x[i].name,
                value:  x[i].name,
            })
        }
        setUserData(tempUserData)
    }

    useEffect(async () => {
        async function getData() {
            getUsers()
        }

        await getData()
    }, [])

    async function onSubmit(){
        try {
          let result =  await onProjectCreate(project) 
          console.log(result)
          alert(result.data.message)
          setProject({projectName: "", assignee: ""})
        } catch (error) {
           alert(error.response.data.message)
        }
    }

    return (
        <div>
            <Row justify="center" style={{minHeight: '100vh', background: '#f2f2f2'}}>
                <Form style={{marginTop: '15%'}} onFinish={onSubmit}>
                <h1 style={{fontFamily: "Montserrat", fontWeight: "bolder"}}>CREATE PROJECT</h1>
                    <Form.Item name="ProjectName" 
                    rules={[
                        {
                        required: true,
                        message: 'Please input project name!',
                        },
                    ]}>
                        <Input placeholder="Enter Project Name" onChange={e => setProject({...project, projectName: e.target.value})} value={project.projectName}></Input>
                    </Form.Item>
                    <Form.Item name="Assignee" 
                            rules={[
                            {
                                required: true,
                                message: 'Please assign the project!',
                            },
                            ]}>
                         <Select mode="tags" style={{ width: '100%' }} onChange={handleChange} tokenSeparators={[',']} placeholder="Assign Project">
                         {userData.map(user => (
                            <Option key={user.key} value={user.value}>{user.name}</Option>
                        ))}
                         </Select>
                    </Form.Item>
                    <Row justify="center">
                    <Button htmlType="submit" block  style={{background: "#A0BF85", borderRadius: "5px"}}>CREATE PROJECT</Button>
                    </Row>
                </Form>
            </Row>
        </div>
    )
}

export default Project
