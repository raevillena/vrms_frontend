import { Input, Button, Form, Row, DatePicker, Space, Select, Menu, Dropdown, message  } from 'antd';
import React, {useState, useEffect} from 'react';
import { useHistory } from 'react-router-dom';
import { onStudyCreate } from '../services/studyAPI';
import { onGetAllUsers } from '../services/userAPI';

const Study = () => {
    const { Option } = Select;
    const users = [];  //for assigning user(change to get all user in database)
    async function getUsers(){
        let resultUsers = await onGetAllUsers()
        let x = resultUsers.data
        for(let i = 0; i < x.length; i++){ 
            users.push(<Option key={x[i].name}>{x[i].name}</Option>);
        }
    }
        getUsers()
        console.log(users)

    
    const projectData = ['NBERIC', 'WARP']; //project select
    const [project, setProject] = useState(projectData); //useState for project selection
    const handleProjectChange = value => {
        console.log(value)
        setProject(value);
        setStudy({...study, projectName: value})
      };
    const [study, setStudy] = useState({title: "", projectName:"", deadline:"",assignee:""})

    function handleChange(value) {   //for assigning user
        console.log(`selected ${value}`);
        setStudy({...study, assignee: value})
    }


    async function onSubmit(){
        try {
            console.log(study)
           let result =  await onStudyCreate(study) 
           //prompt study number and send email to those who are asigned to this project 
        } catch (error) {
            console.log(error)
        }
    }

    function onChange(date) {
        console.log(date);
        setStudy({...study, deadline: date})
      }

    return (
        <div>
            <Row justify="center" style={{minHeight: '100vh', background: '#f2f2f2'}}>
                <Form style={{marginTop: '15%'}}>
                <h1 style={{fontFamily: "Montserrat", fontWeight: "bolder"}}>CREATE STUDY</h1>
                    <Form.Item name="Title" 
                    rules={[
                        {
                        required: true,
                        message: 'Please input your title!',
                        },
                    ]}>
                        <Input placeholder="Enter Title" onChange={e => setStudy({...study, title: e.target.value})} value={study.title}></Input>
                    </Form.Item>
                    <Form.Item name="Project" 
                            rules={[
                                {
                                    required: true,
                                    message: 'Please choose a project',
                                },
                                ]}>
                       <Select defaultValue={projectData[0]} onChange={handleProjectChange}>
                        {projectData.map(project => (
                        <Option key={project}>{project}</Option>
                        ))}
                        </Select>
                    </Form.Item>
                    
                    <Form.Item name="Deadline" 
                            rules={[
                            {
                                required: true,
                                message: 'Please input deadline of study!',
                            },
                            ]}>
                        <label>Deadline</label>
                         <Space direction="vertical">
                        <DatePicker onChange={onChange}/>
                         </Space>
                    </Form.Item>
                    <Form.Item name="Assignee" 
                            rules={[
                            {
                                required: true,
                                message: 'Please assign the study!',
                            },
                            ]}>
                        <label>Assign</label>
                         <Select mode="tags" style={{ width: '100%' }} onChange={handleChange} tokenSeparators={[',']}>{users}</Select>
                    </Form.Item>
                    <Row justify="center">
                    <Button onClick={onSubmit} style={{background: "#A0BF85", borderRadius: "5px"}}>CREATE STUDY</Button>
                    </Row>
                </Form>
            </Row>
        </div>
    )
}

export default Study
