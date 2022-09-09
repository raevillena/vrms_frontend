import { Input, Button, Form, DatePicker, Space, Select, notification} from 'antd';
import React, {useState, useEffect} from 'react';
import { onTaskCreate } from '../services/taskAPI';
import { useSelector } from 'react-redux';
import { onGetAllUser } from '../services/userAPI';
import { onGetAllProject } from '../services/projectAPI';
import { onGetAllStudyforProject } from '../services/studyAPI';
import _ from 'lodash'
const { TextArea }= Input
const Addtask = () => {

    const userObj = useSelector(state => state.user)

    const [form] = Form.useForm();

    const { Option } = Select;
    const [task, setTask] = useState({title: "", description:"", deadline: "", assignee:'', assigneeName: '', projectName:  '', studyName: '', user: userObj.USER._id, username: userObj.USER.name, objective: [], verification:''})
    const [userData, setUserData] = useState([])
    const [projectData, setProjectData] = useState([])
    const [studyData, setStudyData] = useState([])
    const [objData, setObjData] = useState([])


    const initialValues = {title: "", description:"", deadline: "", assignee:'', assigneeName: '', objective: [], verification:'', projectName: '', studyName: ''}
    const notif = (type, message) => {
        notification[type]({
          message: 'Notification Title',
          description:
            message,
        });
      };

    function deadline(date) { //setting deadline
        setTask({...task, deadline: date})
    }

    const assignee = (value) => {   //for assigning user
        let tempArray =[]
        value.forEach(id => {
            userData.forEach(user => {
                if(user.value === id){
                   tempArray.push(user.name)
                }
            });
        })
        setTask({...task, assignee: value, assigneeName: tempArray})
    }

    const objChange = (value) => {   //for choosing objective

        setTask({...task, objective: value})
    }

    const projectChange = async (value) => {   //for choosing project
       setTask({...task, projectName: value})
       let res = await onGetAllStudyforProject({'projectID': value})
       let y = res.data
       let tempStudyData = []
       for(let i = 0; i < y.length; i++){ 
            tempStudyData.push({
                key: y[i].studyID,
                name:  y[i].studyTitle,
                value:  y[i].studyID,
                objective: y[i].objectives
            })
        }
        setStudyData(tempStudyData)
    }

    const studyChange = async (value) => {   //for choosing study
        let filteredData =  _.filter(studyData, function(item) { return item.key === value })
        setTask({...task, studyName: value})
        setObjData(filteredData[0].objective)
     }


    useEffect(() => {
        async function onGetUser(){
            let resultUsers = await onGetAllUser()
            let resultProjects = await onGetAllProject()
            let x = resultUsers.data
            let y = resultProjects.data
            let tempUserData = []
            let tempProjectData = []
            for(let i = 0; i < x.length; i++){ 
                tempUserData.push({
                    key: x[i]._id,
                    name:  x[i].name,
                    value:  x[i]._id,
                })
            }
            for(let i = 0; i < y.length; i++){ 
                tempProjectData.push({
                    key: y[i].projectID,
                    name:  y[i].projectName,
                    value:  y[i].projectID,
                })
            }
            setUserData(tempUserData)
            setProjectData(tempProjectData)
        }
       onGetUser()
    }, [])

    async function onSubmit(){ //creating task
        try {
        let newTask = await onTaskCreate(task)
        notif('info', newTask.data.message)
        form.resetFields()
        setTask({...task, title: "", description:"", deadline: "", assignee: []}) 
        } catch (error) {
            notif("error",error.response.data.message)
        }
    }
    const { TextArea } = Input
    return (
        <div>
        <Form onFinish={onSubmit} form={form}  initialValues={initialValues}> 
            <Form.Item name='title' label="Task title"
                rules={[
                    {
                    required: true,
                    message: 'Task Title is required.',
                    },
                ]}>
                    <TextArea autoSize={{ minRows: 2, maxRows: 6,}} placeholder="Enter Task Title" onChange={e => setTask({...task, title: e.target.value})} value={task.title}/>

                <TextArea autoSize={{ minRows: 2, maxRows: 6, }} placeholder="Enter Task Title" onChange={e => setTask({...task, title: e.target.value})} value={task.title}/>

            </Form.Item>
            <Form.Item name='description'   label="Task Description"
                rules={[
                    {
                    required: true,
                    message: 'Task description is required.',
                    },
                ]}>
                    <TextArea autoSize={{ minRows: 2, maxRows: 6,}} placeholder="Enter Task Description" onChange={e => setTask({...task, description: e.target.value})} value={task.description}/>
                    <TextArea autoSize={{ minRows: 2, maxRows: 6, }} placeholder="Enter Task Description" onChange={e => setTask({...task, description: e.target.value})} value={task.description}/>

            </Form.Item>
            <Form.Item name='verification'   label="Means of Verification"
                rules={[
                    {
                    required: true,
                    message: 'Means of verification is required.',
                    },
                ]}>
                    <Input placeholder="Enter menas of verification" onChange={e => setTask({...task, verification: e.target.value})} value={task.verification}></Input>
            </Form.Item>
            <Form.Item  label="Deadline"
                        rules={[
                        {
                            required: true,
                            message: 'Please input deadline of task!',
                        },
                        ]}>
                    <Space direction="vertical">
                    <DatePicker value={task.deadline} onChange={deadline}/>
                    </Space>
            </Form.Item>
            <Form.Item name='projectName' label="Select Project"
                        rules={[
                        {
                            required: true,
                            message: 'Please select project!',
                        },
                        ]}>
                    <Select style={{ width: '100%' }} onChange={projectChange} placeholder="Select Project">
                    {projectData.map(object => (
                        <Option key={object.key} value={object.value}>{object.name}</Option>
                    ))}
                    </Select>
            </Form.Item>
            <Form.Item name='studyName' label="Select Study"
                        rules={[
                        {
                            required: true,
                            message: 'Please select study!',
                        },
                        ]}>
                    <Select style={{ width: '100%' }} onChange={studyChange} placeholder="Select Study">
                    {studyData.map(object => (
                        <Option key={object.key} value={object.value}>{object.name}</Option>
                    ))}
                    </Select>
            </Form.Item>
            <Form.Item name='objective' label="Select Objective"
                        rules={[
                        {
                            required: true,
                            message: 'Please select objective!',
                        },
                        ]}>
                    <Select style={{ width: '100%' }} onChange={objChange} placeholder="Select Objective">
                    {objData.map(object => (
                        <Option key={object} value={object}>{object}</Option>
                    ))}
                    </Select>
            </Form.Item>
            <Form.Item name='assign' label="Assign Task"
                        rules={[
                        {
                            required: true,
                            message: 'Please assign task!',
                        },
                        ]}>
                    <Select mode="tags" style={{ width: '100%' }} value={task.assignee}  onChange={assignee} tokenSeparators={[',']} placeholder="Assign Task">
                    {userData.map(user => (
                        <Option key={user.key} value={user.value}>{user.name}</Option>
                    ))}
                    </Select>
            </Form.Item>
            <Button htmlType="submit" block style={{background: "#A0BF85", borderRadius: "5px"}}>CREATE TASK</Button>
        </Form>
        </div>
    )
}

export default Addtask
