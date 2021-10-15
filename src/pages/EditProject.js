import React, {useState, useEffect} from 'react'
import {Form, Input, Button, Row, Select} from 'antd'
import { useSelector } from 'react-redux';
import { onGetAllManagers} from '../services/userAPI';
import {onGetProgramforManager, onUpdateProject} from '../services/projectAPI'
import { notif } from '../functions/datagrid';

const EditProject = (props) => {
    const userObj = useSelector(state => state.user)

    const { Option } = Select;
    const [form] = Form.useForm();
    const [userData, setUserData] = useState([])
    const [programData, setProgramData] = useState([])
    const [project, setProject] = useState({projectName: '', program: props.data.programs.programID, programName: props.data.programs.programName, assignee: props.data.record.projectLeaderID, assigneeName: props.data.record.projectLeader, user: userObj.USER._id, id: props.data.record.projectID});

    
    const initialValues = {projectName: props.data.record.projectName, assignee: props.data.record.projectLeaderID, assigneeName: props.data.record.projectLeader, program:props.data.programs.programID, programName:props.data.programs.programName }
   
    function handleChange(value) {   //for assigning user
        console.log(value)
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
        console.log(value)
        setProject({...project, program: value})
      }

    useEffect(() => {
        console.log('props', props)
        async function getUsers(){
            let resultUsers = await onGetAllManagers()
            let resultPrograms = await onGetProgramforManager({user: userObj.USER._id})
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
        setProject({...project,projectName: props.data.record.projectName, assignee: props.data.record.projectLeaderID, assigneeName: props.data.record.projectLeader})
    }, [props.data])

    async function handleUpdate(){
        let res = await onUpdateProject(project)
        props.func({user: userObj.USER._id, project});
        notif('info', res.data.message)
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
                <Form.Item name='assignee'  label="Assignee">
                    <Select mode="tags" style={{ width: '100%' }} onChange={handleChange}  tokenSeparators={[',']} value={project.assignee} placeholder="Assign Project">
                    {userData.map(user => (
                        <Option key={user.key} value={user.value}>{user.name}</Option>
                    ))}
                    </Select>
                </Form.Item>
                <Row justify="center">
                <Button htmlType="submit" block  style={{background: "#A0BF85", borderRadius: "5px"}}>UPDATE PROJECT</Button>
                </Row>
        </Form> 
        </div>
    )
}

export default EditProject
