import { Input, Button, Form, Row, Select} from 'antd';
import React, {useState} from 'react';
import { onProjectCreate } from '../services/projectAPI.js';

const Project = () => {
    const { Option } = Select;
    const children = [];  //for assigning user(change to get all user in database)
        for (let i = 10; i < 36; i++) {
        children.push(<Option key={i.toString(36) + i}>{i.toString(36) + i}</Option>);
    }
    const [project, setProject] = useState({projectName: '', assignee: ''});

    function handleChange(value) {   //for assigning user
        console.log(`selected ${value}`);
        setProject({...project, assignee: value})
    }

    async function onSubmit(){
        try {
          let result =  await onProjectCreate(project) 
          console.log(result)
            alert(result.data.message)
        } catch (error) {
           alert(error.response.data.message)
        }
    }

    return (
        <div>
            <Row justify="center" style={{minHeight: '100vh', background: '#f2f2f2'}}>
                <Form style={{marginTop: '15%'}}>
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
                                message: 'Please assign the study!',
                            },
                            ]}>
                        <label>Assign</label>
                         <Select mode="tags" style={{ width: '100%' }} onChange={handleChange} tokenSeparators={[',']}>{children}</Select>
                    </Form.Item>
                    <Row justify="center">
                    <Button onClick={onSubmit} style={{background: "#A0BF85", borderRadius: "5px"}}>CREATE PROJECT</Button>
                    </Row>
                </Form>
            </Row>
        </div>
    )
}

export default Project
