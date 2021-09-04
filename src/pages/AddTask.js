import { Input, Button, Form, DatePicker, Space, Select, notification, Tooltip, Modal} from 'antd';
import React, {useState, useEffect} from 'react';
import { onGetUserForTask, onTaskCreate } from '../services/taskAPI';
import { useSelector } from 'react-redux';
import ManagerDisplayTask from './ManagerDisplayTask';



const AddTask = () => {
    
    const projectObj = useSelector(state => state.project)
    const studyObj = useSelector(state => state.study)
    const userObj = useSelector(state => state.user)


    const { Option } = Select;
    const [task, setTask] = useState({title: "", description:"", deadline: "", assignee:'', projectName:  projectObj.PROJECT.projectName, studyName: studyObj.STUDY.title, user: userObj.USER.name})
    const [userData, setUserData] = useState([])
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [forProps, setForProps] =useState()

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
        setTask({...task, deadline: '', description: '', title: '', assignee: ''})
  
      };
    
      const handleCancel = () => {
        setIsModalVisible(false);
        setTask({...task, deadline: '', description: '', title: '', assignee:''})
   
      };


    function deadline(date) {
        setTask({...task, deadline: date})
    }

    function assignee(value) {   //for assigning user
        setTask({...task, assignee: value})
    }

  


    useEffect(() => {
        async function onGetUser(){
            let resultUsers = await onGetUserForTask({study: studyObj.STUDY.title})
            let x = resultUsers.data.studies[0].assignee
            let tempUserData = []
            for(let i = 0; i < x.length; i++){ 
                tempUserData.push({
                    key: x[i],
                    name:  x[i],
                    value:  x[i],
                })
            }
            setUserData(tempUserData)
        }
       onGetUser()
    }, [studyObj.STUDY.title, studyObj.STUDY.studyName])

    async function onSubmit(){
        try {
        let newTask = await onTaskCreate(task)
        notif('info', newTask.data.message)
        setTask({...task, title: "", description:"", deadline: "", assignee: ''}) 
        setForProps(newTask.data)
        } catch (error) {
            notif("error",error.response.data.message)
        }
    }

    return (
        <div>
            <ManagerDisplayTask data={forProps}/>
            <Tooltip placement="top" title="Add Task">
                <Button style={{background: '#A0BF85', borderRadius: '50%', float: 'right', height:'40px', marginTop: '10px'}} onClick={showModal}>+</Button>
            </Tooltip>
            <Modal title="Add Task" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                <Form onFinish={onSubmit}>
                    <Form.Item 
                        rules={[
                            {
                            required: true,
                            message: 'Task Title is required.',
                            },
                        ]}>
                            <Input placeholder="Enter Task Title" onChange={e => setTask({...task, title: e.target.value})} value={task.title}></Input>
                    </Form.Item>
                    <Form.Item  
                        rules={[
                            {
                            required: true,
                            message: 'Task description is required.',
                            },
                        ]}>
                            <Input placeholder="Enter Task Description" onChange={e => setTask({...task, description: e.target.value})} value={task.description}></Input>
                    </Form.Item>
                    <Form.Item 
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
                    <Form.Item 
                                rules={[
                                {
                                    required: true,
                                    message: 'Please assign task!',
                                },
                                ]}>
                            <Select mode="tags" style={{ width: '100%' }}  onChange={assignee} tokenSeparators={[',']} placeholder="Assign Study">
                            {userData.map(user => (
                                <Option key={user.key} value={user.value}>{user.name}</Option>
                            ))}
                            </Select>
                    </Form.Item>
                    <Button htmlType="submit" style={{background: "#A0BF85", borderRadius: "5px"}}>CREATE TASK</Button>
                </Form>
            </Modal>
        </div>
    )
}

export default AddTask
