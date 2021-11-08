import { Input, Button, Form, Row, Select, Tooltip, Modal, notification, Tabs, Space, DatePicker} from 'antd';
import React, {useState, useEffect} from 'react';
import { onGetProgramforManager, onProgramCreate, onProjectCreate } from '../services/projectAPI.js';
import { onGetAllManagers } from '../services/userAPI';
import ManagerDash from './ManagerDash.js';
import { useSelector } from 'react-redux';
import Layout1 from '../components/components/Layout1.js';


const { TabPane } = Tabs;

const Project = () => {
    const { Option } = Select;
    const userObj = useSelector(state => state.user)

    const [userData, setUserData] = useState([])
    const [programData, setProgramData] = useState([])
    const [project, setProject] = useState({projectName: '', program: '', assignee: [userObj.USER._id], assigneeName: [userObj.USER.name], user: userObj.USER._id,username: userObj.USER.name, programName: '', deadline: ''});
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [forProps, setForProps] = useState()

    const initialValues = {projectName: '', assignee: [userObj.USER._id], assigneeName: [], programName: ''}

    function handleChange(value) {   //for assigning user
        let tempArray = [userObj.USER.name]
        let assign = [userObj.USER._id, ...value ]
        value.forEach(id => {
            userData.forEach(user => {
                if(user.value === id){
                   tempArray.push(user.name)
                }
            });
        });
        setProject({...project, assignee: assign, assigneeName: tempArray})
    }

    function handleProgramChange(value) {
        let tempArray =[]
        programData.forEach(prog => {
            if(prog.value === value){
            tempArray.push(prog.name)
            }
        });
        setProject({...project, program: value, programName: tempArray[0]})
      }

    const [form] = Form.useForm();
    const [form1] = Form.useForm();

    const notif = (type, message) => {
        notification[type]({
          message: 'Notification',
          description:
            message,
        });
      };

    const showModal = () => {
        setIsModalVisible(true);
      };
    
      const handleCancel = () => {
        setIsModalVisible(false);
        form.resetFields()
        form1.resetFields()
        setProject({...project, projectName: '', assignee: [userObj.USER._id]})
      };

    useEffect(() => {
        async function getUsers(){
            let resultUsers = await onGetAllManagers()
            let resultPrograms = await onGetProgramforManager({user: userObj.USER._id})
            let x = resultUsers.data
            let y = resultPrograms.data
            let tempUserData = []
            let tempPrograms = []
            for(let i = 0; i < x.length; i++){ 
                tempUserData.push({
                    key: x[i].name,
                    name:  x[i].name,
                    value: x[i]._id
                })
            }
            for(let j = 0; j < y.length; j++){ 
                tempPrograms.push({
                    key: y[j]._id,
                    name:  y[j].programName,
                    value: y[j].programID
                })
            }
            let keys = userObj.USER._id
            let newTempUser = tempUserData.filter(user => !keys.includes(user.value));
            setUserData(newTempUser)
            setProgramData(tempPrograms)
        }
       getUsers()
    }, [])

    async function onSubmit(){
        try {
          let result =  await onProjectCreate(project)
          const data = result.data.newProject
          notif("success",result.data.message)
          form.resetFields()
          form1.resetFields()
          setForProps({type: 'project', data})
          setProject({...project, projectName: '', assignee: [userObj.USER._id]})
        } catch (error) {
           notif("error",error.response.data.message)
        }
    }
    function onChange(date) {
        setProject({...project, deadline: date})
    }


    async function onSubmitProgram(){
        try {
          let result =  await onProgramCreate(project)
          const newProgram = result.data.newProgram
          notif("success",result.data.message1)
          form.resetFields()
          form1.resetFields()
          setForProps({type: 'program', newProgram})
          setProject({...project, projectName: '', assignee: [userObj.USER._id]})
        } catch (error) {
           notif("error",error.response.data.message)
        }
    }

    return (
        <div>  
            <Layout1>      
            <ManagerDash data={forProps}/>
            <Tooltip placement="top" title="Add Study">
                <Button className="add-button" onClick={showModal}>+</Button>
            </Tooltip>
            <Modal title="Add Project" visible={isModalVisible} footer={null} onCancel={handleCancel}>
            <Tabs centered>
                <TabPane tab="Program" key="1">
                    <Row justify="center">
                        <Form onFinish={onSubmitProgram} form={form} initialValues={initialValues}>
                            <Form.Item name='programName' label="Program Name"
                            rules={[
                                {
                                required: true,
                                message: 'Please input program name!',
                                },
                            ]}>
                                <Input placeholder="Enter Program Name" onChange={e => setProject({...project, programName: e.target.value})} value={project.programName} ></Input>
                            </Form.Item>
                            <Form.Item name='assigneeName'  label="Assignee">
                                <Select mode="tags" style={{ width: '100%' }} onChange={handleChange} tokenSeparators={[',']} value={project.assignee} placeholder="Assign Project">
                                {userData.map(user => (
                                    <Option key={user.key} value={user.value}>{user.name}</Option>
                                ))}
                                </Select>
                            </Form.Item>
                            <Row justify="center">
                            <Button htmlType="submit" block  style={{background: "#A0BF85", borderRadius: "5px"}}>CREATE PROGRAM</Button>
                            </Row>
                        </Form>
                    </Row>
                </TabPane>
                <TabPane tab="Project" key="2">
                    <Row justify="center">
                    <Form onFinish={onSubmit} form={form1} initialValues={initialValues}>
                        <Form.Item name='projectName' label="Project Name"
                        rules={[
                            {
                            required: true,
                            message: 'Please input project name!',
                            },
                        ]}>
                            <Input placeholder="Enter Project Name" onChange={e => setProject({...project, projectName: e.target.value})} value={project.projectName}></Input>
                        </Form.Item>
                        <Form.Item name='program'  label="Program" rules={[
                            {
                            required: true,
                            message: 'Please select a program!',
                            },
                        ]}>
                            <Select  style={{ width: '100%' }} onChange={handleProgramChange} value={project.program}  placeholder="Select Program">
                            {programData.map(program => (
                                <Option key={program.value} value={program.value}>{program.name}</Option>
                            ))}
                                <Option key={'others'} value={'others'}>Others</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item  label="Deadline"
                                rules={[
                                {
                                    required: true,
                                    message: 'Please input deadline of study!',
                                },
                                ]}>
                            <Space direction="vertical">
                            <DatePicker value={project.deadline} onChange={onChange}/>
                            </Space>
                        </Form.Item>
                        <Form.Item name='assigneeName'  label="Assignee">
                            <Select mode="tags" style={{ width: '100%' }} onChange={handleChange} tokenSeparators={[',']} value={project.assignee} placeholder="Assign Project">
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
                </TabPane>
            </Tabs>
            </Modal>
            </Layout1>
        </div>
    )
}

export default Project
