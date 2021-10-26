import React, {useState, useEffect} from 'react'
import {Form, Input, Button, Row, Select} from 'antd'
import { useSelector } from 'react-redux';
import { onGetAllManagers} from '../services/userAPI';
import {onUpdateProgram} from '../services/projectAPI'
import { notif } from '../functions/datagrid';

const EditProgram = (props) => {
    const { Option } = Select;
    const [form] = Form.useForm();
    const [program, setProgram] = useState({programName: '', assignee: '', assigneeName: ''})
    const [userData, setUserData] = useState([])
    const initialValues = { assignee:props.data.record.programLeaderID, assigneeName: props.data.record.programLeader, programName: props.data.record.programName}

    const userObj = useSelector(state => state.user)

    
   

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
        setProgram({...program, assignee: assign, assigneeName: tempArray})
    }

    useEffect(() => {
        async function getUsers(){
            let resultUsers = await onGetAllManagers()
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
       setProgram({programName: props.data.record.programName, assignee: props.data.record.programLeaderID, assigneeName: props.data.record.programLeader})
    }, [props.data])

    async function handleUpdate(){
       let res = await onUpdateProgram({user: userObj.USER._id, programName: program.programName, assignee: program.assignee, assigneeName: program.assigneeName, program: props.data.record.programID})
       props.func({user: userObj.USER._id, programName: program.programName, assignee: program.assignee, assigneeName: program.assigneeName, program: props.data.record.programID});
       notif('info', res.data.message)
    }

    return (
        <div>
            <Form onFinish={handleUpdate}  form={form} initialValues={initialValues}>
                <Form.Item name='programName' label="Program Name"
                rules={[
                    {
                    message: 'Please input program name!',
                    },
                ]}>
                    <Input placeholder="Enter Program Name" onChange={e => setProgram({...program, programName: e.target.value})} value={program.programName} ></Input>
                </Form.Item>
                <Form.Item name='assignee' label="Assignee">
                    <Select mode="tags" style={{ width: '100%' }} onChange={handleChange} tokenSeparators={[',']} value={program.assignee} placeholder="Assign Project">
                    {userData.map(user => (
                        <Option key={user.key} value={user.value}>{user.name}</Option>
                    ))}
                    </Select>
                </Form.Item>
                <Row justify="center">
                <Button htmlType="submit" block  style={{background: "#A0BF85", borderRadius: "5px"}}>UPDATE PROGRAM</Button>
                </Row>
            </Form>
        </div>
    )
}

export default EditProgram