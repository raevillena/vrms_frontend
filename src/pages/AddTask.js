import { Input, Button, Form, DatePicker, Space, Select, notification, Tooltip, Modal} from 'antd';
import React, {useState, useEffect} from 'react';
import { onGetUserForTask, onTaskCreate } from '../services/taskAPI';
import { useSelector } from 'react-redux';
import ManagerDisplayTask from './ManagerDisplayTask';



const AddTask = () => {
    
    const projectObj = useSelector(state => state.project)
    const studyObj = useSelector(state => state.study)
    const userObj = useSelector(state => state.user)
    let obj = studyObj.STUDY.objectives

    const [form] = Form.useForm();

    const { Option } = Select;
    const [task, setTask] = useState({title: "", description:"", deadline: "", assignee:'', assigneeName: '', projectName:  projectObj.PROJECT.projectID, studyName: studyObj.STUDY.studyID, user: userObj.USER._id, username: userObj.USER.name, objective: [], verification:''})
    const [userData, setUserData] = useState([])
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [forProps, setForProps] =useState()


    const initialValues = {title: "", description:"", deadline: "", assignee:'', assigneeName: '', objective: [], verification:''}

    const notif = (type, message) => {
        notification[type]({
          message: 'Notification Title',
          description:
            message,
        });
      };

      const showModal = () => {
        setIsModalVisible(true);
      };
    
      const handleOk = () => {
        setIsModalVisible(false);
        form.resetFields()
        setTask({...task, deadline: '', description: '', title: '', assignee: []})
      };
    
      const handleCancel = () => {
        setIsModalVisible(false);
        form.resetFields()
        setTask({...task, deadline: '', description: '', title: '', assignee:[]})
      };


    function deadline(date) {
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


    useEffect(() => {
        async function onGetUser(){
            let resultUsers = await onGetUserForTask({study: studyObj.STUDY.studyID})
            let x = resultUsers.data.studies[0].assigneeName
            let y = resultUsers.data.studies[0].assignee
            let tempUserData = []
            for(let i = 0; i < x.length; i++){ 
                tempUserData.push({
                    key: x[i],
                    name:  x[i],
                    value:  y[i],
                })
            }
            setUserData(tempUserData)
        }
       onGetUser()
    }, [studyObj])

    async function onSubmit(){
        try {
        let newTask = await onTaskCreate(task)
        notif('info', newTask.data.message)
        form.resetFields()
        setTask({...task, title: "", description:"", deadline: "", assignee: []}) 
        setForProps(newTask.data)
        } catch (error) {
            notif("error",error.response.data.message)
        }
    }

    return (
        <div style= {{width: '100%'}}>
            <ManagerDisplayTask data={forProps}/>
            <Tooltip placement="top" title="Add Task">
                <Button style={{background: '#A0BF85', borderRadius: '50%', float: 'right', height:'40px', marginTop: '10px', display: userObj.USER.category === 'manager'? 'initial': 'none'}} onClick={showModal}>+</Button>
            </Tooltip>
            <Modal title="Add Task" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                <Form onFinish={onSubmit} form={form}  initialValues={initialValues}> 
                    <Form.Item name='title' label="Task title"
                        rules={[
                            {
                            required: true,
                            message: 'Task Title is required.',
                            },
                        ]}>
                            <Input placeholder="Enter Task Title" onChange={e => setTask({...task, title: e.target.value})} value={task.title}></Input>
                    </Form.Item>
                    <Form.Item name='description'   label="Task Description"
                        rules={[
                            {
                            required: true,
                            message: 'Task description is required.',
                            },
                        ]}>
                            <Input placeholder="Enter Task Description" onChange={e => setTask({...task, description: e.target.value})} value={task.description}></Input>
                    </Form.Item>
                    <Form.Item name='verification'   label="Means of Verification"
                        rules={[
                            {
                            required: true,
                            message: 'MEans of verification is required.',
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
                    <Form.Item name='objective' label="Select Objective"
                                rules={[
                                {
                                    required: true,
                                    message: 'Please select objective!',
                                },
                                ]}>
                            <Select style={{ width: '100%' }} onChange={objChange} placeholder="Select Objective">
                            {obj.map(object => (
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
            </Modal>
        </div>
    )
}

export default AddTask
