import { Input, Button, Form, Row, DatePicker, Space, Select, notification} from 'antd';
import React, {useState, useEffect} from 'react';
import { onGetStudyForTask, onTaskCreate } from '../services/taskAPI';
import { onGetAllUsers } from '../services/userAPI';
import { onGetAllProject } from '../services/projectAPI';

const AddTask = () => {
    const { Option } = Select;
    const [task, setTask] = useState({title: "", description:"", deadline: "", projectName: "", studyName: ""})
    const [userData, setUserData] = useState([])
    const [projectData, setProjectData] = useState([])
    const [studyData, setStudyData] = useState([])

    const notif = (type, message) => {
        notification[type]({
          message: 'Notification Title',
          description:
            message,
        });
      };


    function deadline(date) {
        console.log(date);
        setTask({...task, deadline: date})
    }

    function assignee(value) {   //for assigning user
        setTask({...task, assignee: value})
    }

    async function handleProjectChange (value) {
        setTask({...task, projectName: value})
        let resultStudy = await onGetStudyForTask({"projectName": value})
        console.log(resultStudy)
        let x = resultStudy.data.studies
        let tempStudyData = []
        for(let i = 0; i < x.length; i++){ 
            tempStudyData.push({
                key: x[i].studyTitle,
                name:  x[i].studyTitle,
                value:  x[i].studyTitle,
            })
        }
        setStudyData(tempStudyData)
      };

    async function handleStudyChange(value){
        setTask({...task, studyName: value})
    }

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

    async function onSubmit(){
        try {
        console.log('task', task)
        let newTask = await onTaskCreate(task)
        notif('info', newTask.data.message)
           //prompt study number and send email to those who are asigned to this project 
        } catch (error) {
            alert(error.response.data.message)
        }
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

    return (
        <div>
            <Form>
                <h1 style={{fontFamily: "Montserrat", fontWeight: "bolder"}}>CREATE TASK</h1>
                <Form.Item name="taskTitle" 
                    rules={[
                        {
                        required: true,
                        message: 'Task Title is required.',
                        },
                    ]}>
                        <Input placeholder="Enter Task Title" onChange={e => setTask({...task, title: e.target.value})} value={task.title}></Input>
                </Form.Item>
                <Form.Item name="description" 
                    rules={[
                        {
                        required: true,
                        message: 'Task description is required.',
                        },
                    ]}>
                        <Input placeholder="Enter Task Description" onChange={e => setTask({...task, description: e.target.value})} value={task.description}></Input>
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
                <Form.Item name="Study" 
                            rules={[
                                {
                                    required: true,
                                    message: 'Please choose a Study',
                                },
                                ]}>
                       <Select defaultValue={studyData[0]} onChange={handleStudyChange} placeholder="Study">
                        {studyData.map(study => (
                        <Option key={study.key} value={study.value}>{study.name}</Option>
                        ))}
                        </Select>
                    </Form.Item>
                <Form.Item name="Deadline" 
                            rules={[
                            {
                                required: true,
                                message: 'Please input deadline of task!',
                            },
                            ]}>
                        <label>Deadline</label>
                         <Space direction="vertical">
                        <DatePicker onChange={deadline}/>
                         </Space>
                </Form.Item>
                <Form.Item name="Assignee" 
                            rules={[
                            {
                                required: true,
                                message: 'Please assign task!',
                            },
                            ]}>
                         <Select mode="tags" style={{ width: '100%' }} onChange={assignee} tokenSeparators={[',']} placeholder="Assign Study">
                         {userData.map(user => (
                            <Option key={user.key} value={user.value}>{user.name}</Option>
                        ))}
                         </Select>
                </Form.Item>
                <Button onClick={onSubmit} style={{background: "#A0BF85", borderRadius: "5px"}}>CREATE TASK</Button>
            </Form>
        </div>
    )
}

export default AddTask
