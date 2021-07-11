import { Input, Button, Form, Row, DatePicker, Space, Select} from 'antd';
import React, {useState, useEffect} from 'react';
import { onGetAllProject } from '../services/projectAPI';
import { onStudyCreate } from '../services/studyAPI';
import { onGetAllUsers } from '../services/userAPI';

import { useDispatch, useSelector } from 'react-redux';



const Study = () => {
    const { Option } = Select;
    const dispatch = useDispatch()
    const [projectData, setProjectData] = useState([])
    const [userData, setUserData] = useState([])
    const [study, setStudy] = useState({title: "", projectName:"", deadline:"",assignee:""})
    
    async function getUsers(){
        let resultUsers = await onGetAllUsers(dispatch)
        let x = resultUsers.data
        // console.log('user',resultUsers)
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
    
    
   // const [project, setProject] = useState(projectData); //useState for project selection
    const handleProjectChange = value => {
        console.log(value)
       // setProject(value);
        setStudy({...study, projectName: value})
      };
      

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
                       <Select defaultValue={projectData[0]} onChange={handleProjectChange} placeholder="Project">
                        {projectData.map(project => (
                        <Option key={project.key} value={project.value}>{project.name}</Option>
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
