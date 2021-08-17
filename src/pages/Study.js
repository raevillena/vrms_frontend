import { Input, Button, Form, Row, DatePicker, Space, Select} from 'antd';
import React, {useState, useEffect} from 'react';
import { onGetAllProject } from '../services/projectAPI';
import { onStudyCreate } from '../services/studyAPI';
import { onGetAllUsers } from '../services/userAPI';


const Study = () => {
    const { Option } = Select;
    const [projectData, setProjectData] = useState([])
    const [userData, setUserData] = useState([])
    const [study, setStudy] = useState({title: "", projectName:"", deadline:"",assignee:"", budget: ""})
    
    async function getUsers(){
        let resultUsers = await onGetAllUsers()
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
  
    async function getProjects(){
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
    
    useEffect(async () => {
        async function getData() {
            getUsers()
            getProjects()
        }

        await getData()
    }, [])
    
    
  
    const handleProjectChange = value => {
        console.log(value)
        setStudy({...study, projectName: value})
      };
      

    function handleChange(value) {   //for assigning user
        setStudy({...study, assignee: value})
    }


    async function onSubmit(){
        try {
            
            console.log(study)
           let result =  await onStudyCreate(study) 
           alert(result.data.message)
           setStudy({title: "", projectName:"", deadline:"",assignee:""})
           //prompt study number and send email to those who are asigned to this project 
        } catch (error) {
            alert(error.response.data.message)
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
                       <Select defaultValue={projectData[0]} onChange={handleProjectChange} placeholder="Project">
                        {projectData.map(project => (
                        <Option key={project.key} value={project.value}>{project.name}</Option>
                        ))}
                        </Select>
                    </Form.Item>
                    <Form.Item name="Budget" 
                            rules={[
                            {
                                required: true,
                                message: 'Please enterbudget!',
                            },
                            ]}>
                         <Input placeholder="Enter Budget" onChange={e => setStudy({...study, budget: e.target.value})} value={study.budget}></Input>
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
                         <Select mode="tags" style={{ width: '100%' }} onChange={handleChange} tokenSeparators={[',']} placeholder="Assign Study">
                         {userData.map(user => (
                            <Option key={user.key} value={user.value}>{user.name}</Option>
                        ))}
                         </Select>
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
