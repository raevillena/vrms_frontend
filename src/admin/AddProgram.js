import React, {useEffect, useState} from 'react'
import { Tabs, Select, Form, notification, Row, Input, Button, Space, DatePicker } from 'antd';
import { useSelector } from 'react-redux';
import { onGetAllManagers } from '../services/userAPI';
import { onGetAllPrograms } from '../services/projectAPI';
import { onProjectCreate, onProgramCreate } from '../services/projectAPI';

const { TabPane } = Tabs;
const { TextArea } = Input
const AddProgram = () => {

    const { Option } = Select;
    const userObj = useSelector(state => state.user)

    const [userData, setUserData] = useState([])
    const [programData, setProgramData] = useState([])
    const [project, setProject] = useState({projectName: '', program: '', assignee: [userObj.USER._id], assigneeName: [userObj.USER.name], user: userObj.USER._id,username: userObj.USER.name, programName: '', deadline: '', fundingAgency: '', fundingCategory: ''});

    const initialValues = {projectName: '', assignee: [userObj.USER._id], assigneeName: [], programName: '', fundingAgency: '', fundingCategory: ''}

    const [form] = Form.useForm();
    const [form1] = Form.useForm();

    const notif = (type, message) => {
        notification[type]({
          message: 'Notification',
          description:
            message,
        });
      };

    function handleChangeInFundingCat(value) {   //for changes in funding category
        setProject({...project, fundingCategory: value})
    }

    useEffect(() => {
        async function getUsers(){
            let resultUsers = await onGetAllManagers()
            let resultPrograms = await onGetAllPrograms()
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

    function handleChange(value) {   //for assigning user
        let tempArray = []
        value.forEach(id => {
            userData.forEach(user => {
                if(user.value === id){
                   tempArray.push(user.name)
                }
            });
        });
        setProject({...project, assignee: value, assigneeName: tempArray})
    }

    function handleProgramChange(value) { // for assigning program
        console.log(value)
        let tempArray =[]
        programData.forEach(prog => {
            if(prog.value === value){
            tempArray.push(prog.name)
            }
        });
        if(value === 'others'){
            setProject({...project, program: value, programName: value})
        }else{
            setProject({...project, program: value, programName: tempArray[0]})
        }
      }

    async function onSubmit(){ // creating project
        try {
          let result =  await onProjectCreate(project)
          notif("success",result.data.message)
          form.resetFields()
          form1.resetFields()
          setProject({...project, projectName: '', assignee: [userObj.USER._id]})
        } catch (error) {
           notif("error",error.response.data.message)
        }
    }
    function onChange(date) { //for change in deadline
        setProject({...project, deadline: date})
    }


    async function onSubmitProgram(){ //creating program
        try {
          let result =  await onProgramCreate(project)
          notif("success",result.data.message1)
          form.resetFields()
          form1.resetFields()
          setProject({...project, projectName: '', assignee: [userObj.USER._id]})
        } catch (error) {
           notif("error",error.response.data.message)
        }
    }

    return (
        <div>
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
                                <TextArea autoSize={{ minRows: 2, maxRows: 6, }} placeholder="Enter Program Name" onChange={e => setProject({...project, programName: e.target.value})} value={project.programName}/>
                            </Form.Item>
                            <Form.Item name='fundingCategory' label="Funding Category">
                                <Select style={{ width: '100%' }} onChange={handleChangeInFundingCat} value={project.fundingCategory} placeholder="Select funding category">
                                    <Option key={1} value={'GIA'}>{'GIA'}</Option>
                                    <Option key={2} value={'GAA'}>{'GAA'}</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item name='fundingAgency' label="Funding Agency"
                            rules={[
                                {
                                message: 'Please input funding agency!',
                                },
                            ]}>
                                <Input placeholder="Enter Funding Agency" onChange={e => setProject({...project, fundingAgency: e.target.value})} value={project.fundingAgency} ></Input>
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
                            <TextArea autoSize={{ minRows: 2, maxRows: 6, }} placeholder="Enter Project Name" onChange={e => setProject({...project, projectName: e.target.value})} value={project.projectName}/>
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
                        <Form.Item name='fundingCategory' label="Funding Category">
                            <Select style={{ width: '100%' }} onChange={handleChangeInFundingCat} value={project.fundingCategory} placeholder="Select funding category">
                                <Option key={1} value={'GIA'}>{'GIA'}</Option>
                                <Option key={2} value={'GAA'}>{'GAA'}</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item name='fundingAgency' label="Funding Agency"
                        rules={[
                            {
                            message: 'Please input funding agency!',
                            },
                        ]}>
                            <Input placeholder="Enter Funding Agency" onChange={e => setProject({...project, fundingAgency: e.target.value})} value={project.fundingAgency} ></Input>
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
        </div>
    )
}

export default AddProgram
