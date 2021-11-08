import React, {useState, useEffect} from 'react'
import {Button, Input, Form, Row, Select, Space, DatePicker} from 'antd'
import { onGetAllUser } from '../services/userAPI';
import moment from 'moment';
import { onUpdateTaskAdmin } from '../services/taskAPI';
import { notif } from '../functions/datagrid';


const Edittask = (props) => {
    const { Option } = Select;
    const [form] = Form.useForm();
    const active = ['true', 'false']
    const status = ['ONGOING', 'COMPLETED']

    const [task, setTask] = useState({taskId: props.data.key,
        title: props.data.title, 
        assignee: props.data.assignee, 
        assigneeName: props.data.assigneeName, 
        active: props.data.active, 
        status: props.data.status, 
        createdBy: props.data.createdBy, 
        description:props.data.description, 
        verification: props.data.verification, 
        deadline:moment(props.data.deadline),  
        updatedBy: props.data.updatedBy, 
        lastUpdated: moment(props.data.lastUpdated), 
        studyName: props.data.study, 
        projectName: props.data.project, 
        objective: props.data.objectives})
    const [userData, setUserData] = useState([])

    const initialValues = { assignee:props.data.assignee, 
        assigneeName: props.data.assigneeName, 
        programName: props.data.programName, 
        active: props.data.active, 
        status: props.data.status, 
        createdBy: props.data.createdBy, 
        title: props.data.title, 
        description: props.data.description, 
        verification: props.data.verification,
        deadline: moment(props.data.deadline), 
        updatedBy: props.data.updatedBy, 
        lastUpdated: moment(props.data.lastUpdated), 
        studyName: props.data.study, 
        projectName: props.data.project, 
        objective: props.data.objectives}
    
    function handleChange(value) {   //for assigning user
        let tempArray = []
        let assign = value
        value.forEach(id => {
            userData.forEach(user => {
                if(user.value === id){
                    tempArray.push(user.name)
                }
            });
        });
        setTask({...task, assignee: assign, assigneeName: tempArray})
    }

    useEffect(() => {
        async function getUsers(){
            let resultUsers = await onGetAllUser()
            let x = resultUsers.data
            let tempUserData = []
            for(let i = 0; i < x.length; i++){ 
                tempUserData.push({
                    key: x[i]._id,
                    name:  x[i].name,
                    value: x[i]._id
                })
            }
            setUserData(tempUserData)
        }
       getUsers()
        form.resetFields()
        setTask({taskId: props.data.key,
            title: props.data.title, 
            assignee: props.data.assignee, 
            assigneeName: props.data.assigneeName, 
            active: props.data.active, 
            status: props.data.status, 
            createdBy: props.data.createdBy, 
            description:props.data.description, 
            verification: props.data.verification, 
            deadline:moment(props.data.deadline),  
            updatedBy: props.data.updatedBy, 
            lastUpdated: moment(props.data.lastUpdated), 
            studyName: props.data.study, 
            projectName: props.data.project, 
            objective: props.data.objectives})
    }, [props.data])

    function handleChangeActive(value) {   
        setTask({...task, active: value})
    }

    function handleChangeStatus(value) {   
        setTask({...task, status: value})
        }

    function onChange(date) {
        setTask({...task, deadline:moment( date)})
    }

    async function handleUpdate(){
        let res = await onUpdateTaskAdmin(task)
        props.func(task);
        notif('info', res.data.message)
     }

    return (
        <div>
            <Form onFinish={handleUpdate}  form={form} initialValues={initialValues}>
                <Form.Item name='title' label="Task Title">
                    <Input placeholder="Enter Task Title" onChange={e => setTask({...task, title: e.target.value})} value={task.title} ></Input>
                </Form.Item>
                <Form.Item name='description' label="Task Description">
                    <Input placeholder="Enter Task Description" onChange={e => setTask({...task, description: e.target.value})} value={task.description} ></Input>
                </Form.Item>
                <Form.Item name='verification' label="Task Verification">
                    <Input placeholder="Enter Task Verification" onChange={e => setTask({...task, verification: e.target.value})} value={task.verification} ></Input>
                </Form.Item>
                <Form.Item name='studyName' label="Study">
                    <Input placeholder="Study" onChange={e => setTask({...task, studyName: e.target.value})} value={task.studyName} ></Input>
                </Form.Item>
                <Form.Item name='objective' label="Objective">
                    <Input placeholder="Objective" onChange={e => setTask({...task, objective: e.target.value})} value={task.objective} ></Input>
                </Form.Item>
                <Form.Item name='projectName' label="Project">
                    <Input placeholder="Project" onChange={e => setTask({...task, projectName: e.target.value})} value={task.projectName} ></Input>
                </Form.Item>
                <Form.Item name='deadline'  label="Deadline">
                    <Space direction="vertical">
                    <DatePicker value={task.deadline} onChange={onChange}/>
                    </Space>
                </Form.Item>
                <Form.Item name='assignee' label="Assignee">
                    <Select mode="tags" style={{ width: '100%' }} onChange={handleChange} tokenSeparators={[',']} value={task.assignee} placeholder="Assign Task">
                    {userData.map(user => (
                        <Option key={user.key} value={user.value}>{user.name}</Option>
                    ))}
                    </Select>
                </Form.Item>
                <Form.Item name='active' label="Active">
                    <Select style={{ width: '100%' }} onChange={handleChangeActive} value={task.active} placeholder="Active">
                    {active.map(act => (
                        <Option key={act} value={act}>{act}</Option>
                    ))}
                    </Select>
                </Form.Item>
                <Form.Item name='status' label="Status">
                    <Select style={{ width: '100%' }} onChange={handleChangeStatus} value={task.active} placeholder="Status">
                    {status.map(stat => (
                        <Option key={stat} value={stat}>{stat}</Option>
                    ))}
                    </Select>
                </Form.Item>
                <Form.Item name='createdBy' label="Created By;">
                    <Input disabled={true} placeholder="Created By"  value={task.createdBy} ></Input>
                </Form.Item>
                <Form.Item name='updatedBy' label="Updated By">
                    <Input disabled={true} placeholder="Enter Task Description"  value={task.updatedBy} ></Input>
                </Form.Item>
                <Form.Item name='lastUpdated'  label="Last Updated">
                    <Space direction="vertical">
                    <DatePicker disabled={true} value={task.lastUpdated}/>
                    </Space>
                </Form.Item>
                <Row justify="center">
                    <Button htmlType="submit" block  style={{background: "#A0BF85", borderRadius: "5px"}}>UPDATE TASK</Button>
                </Row>
            </Form>
        </div>
    )
}

export default Edittask
