import React, {useState, useEffect} from 'react'
import {Form, Input, Button, Row, Select, Space, DatePicker} from 'antd'
import { useSelector } from 'react-redux';
import { onGetAllManagers} from '../services/userAPI';
import {onGetAllPrograms, onUpdateProjectAdmin} from '../services/projectAPI'
import { notif } from '../functions/datagrid';
import moment from 'moment'

const EditProject = (props) => {
    const status = ['ONGOING', 'COMPLETED']
    const active =['true', 'false']

    const userObj = useSelector(state => state.user)
    const { Option } = Select;
    const [form] = Form.useForm();
    const [userData, setUserData] = useState([])
    const [programData, setProgramData] = useState([])
    const [project, setProject] = useState({projectName: props.data.projectName, 
    program: props.data.programID, 
    programName: props.data.programName, 
    assignee: props.data.projectLeaderID, 
    assigneeName: props.data.projectLeader, 
    user: userObj.USER._id, id: props.data.projectID,
    deadline: moment(props.data.deadline), 
    progress: props.data.progress, 
    status: props.data.status, 
    active: props.data.active,
    fundingAgency: props.data.fundingAgency,
    fundingCategory: props.data.fundingCategory, 
    createdBy: props.data.createdBy});

    
    const initialValues = {projectName: props.data.projectName, 
        assignee: props.data.projectLeaderID, 
        assigneeName: props.data.projectLeader, 
        program:props.data.programID, 
        programName:props.data.programName, 
        deadline:moment(props.data.deadline),
        progress: props.data.progress, 
        status: props.data.status, 
        active: props.data.active, 
        createdBy: props.data.createdBy,
        fundingAgency: props.data.fundingAgency,
        fundingCategory: props.data.fundingCategory,
        id:props.data.projectID }
   
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
        setProject({...project, assignee: assign, assigneeName: tempArray})
    }

    function handleProgramChange(value) {
        setProject({...project, program: value})
      }

      function onChange(date) {
        setProject({...project, deadline:moment( date)})
    }

    function handleChangeInFundingCat(value) {   //for assigning user
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
                    key: x[i]._id,
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
            setUserData(tempUserData)
            setProgramData(tempPrograms)
        }
       getUsers()
        form.resetFields()
        setProject({projectName: props.data.projectName, 
            program: props.data.programID, 
            programName: props.data.programName, 
            assignee: props.data.projectLeaderID, 
            assigneeName: props.data.projectLeader, 
            user: userObj.USER._id, id: props.data.projectID,
            deadline: moment(props.data.deadline), 
            progress: props.data.progress, 
            status: props.data.status, 
            active: props.data.active, 
            createdBy: props.data.createdBy})
    }, [props.data])

    async function handleUpdate(){
        let res = await onUpdateProjectAdmin(project)
        props.func(project);
        notif('info', res.data.message)
     }

     function handleChangeActive(value) {   
        setProject({...project, active: value})
    }

    function handleChangeStatus(value) {   
        setProject({...project, status: value})
    }

    return (
        <div>
           <Form onFinish={handleUpdate}  form={form} initialValues={initialValues}>
                <Form.Item name='projectName' label="Project Name">
                    <Input placeholder="Enter Project Name" onChange={e => setProject({...project, projectName: e.target.value})} value={project.projectName}></Input>
                </Form.Item>
                <Form.Item name='program'  label="Program">
                    <Select  style={{ width: '100%' }}  value={project.program} onChange={handleProgramChange}  placeholder="Select Program">
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
                <Form.Item name='deadline'  label="Deadline">
                    <Space direction="vertical">
                    <DatePicker value={project.deadline} onChange={onChange}/>
                    </Space>
                </Form.Item>
                <Form.Item name='progress' label="Progress">
                    <Input type='number' placeholder="Progress" onChange={e => setProject({...project, progress: e.target.value})} value={project.progress}></Input>
                </Form.Item>
                <Form.Item name='assignee'  label="Assignee">
                    <Select mode="tags" style={{ width: '100%' }} onChange={handleChange}  tokenSeparators={[',']} value={project.assignee} placeholder="Assign Project">
                    {userData.map(user => (
                        <Option key={user.key} value={user.value}>{user.name}</Option>
                    ))}
                    </Select>
                </Form.Item>
                <Form.Item name='status' label="Status">
                    <Select style={{ width: '100%' }} onChange={handleChangeStatus} value={project.active} placeholder="Status">
                    {status.map(stat => (
                        <Option key={stat} value={stat}>{stat}</Option>
                    ))}
                    </Select>
                </Form.Item>
                <Form.Item name='active' label="Active">
                    <Select style={{ width: '100%' }} onChange={handleChangeActive} value={project.active} placeholder="Assign Project">
                    {active.map(act => (
                        <Option key={act} value={act}>{act}</Option>
                    ))}
                    </Select>
                </Form.Item>
                <Form.Item name='createdBy' label="Created By">
                    <Input disabled={true} placeholder="Enter Project Name" onChange={e => setProject({...project, createdBy: e.target.value})} value={project.createdBy}></Input>
                </Form.Item>
                <Row justify="center">
                <Button htmlType="submit" block  style={{background: "#A0BF85", borderRadius: "5px"}}>UPDATE PROJECT</Button>
                </Row>
        </Form> 
        </div>
    )
}

export default EditProject
