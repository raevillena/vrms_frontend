import React, {useState, useEffect} from 'react'
import {Form, Input, Button, Row, Select} from 'antd'
import { useSelector } from 'react-redux';
import { onGetAllManagers} from '../services/userAPI';
import {onUpdateProgram} from '../services/projectAPI'
import { notif } from '../functions/datagrid';

const EditProgram = (props) => {
    const { Option } = Select;
    const [form] = Form.useForm();
    const [program, setProgram] = useState({programName: '', assignee: '', assigneeName: '', fundingAgency: '', fundingCategory: ''})
    const [userData, setUserData] = useState([])
    const initialValues = { assignee:props.data.record.programLeaderID, assigneeName: props.data.record.programLeader, programName: props.data.record.programName, 
                            fundingCategory: props.data.record.fundingCategory, fundingAgency: props.data.record.fundingAgency
                        }

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

    function handleChangeInFundingCat(value) {   //for assigning user
        setProgram({...program, fundingCategory: value})
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
       setProgram({programName: props.data.record.programName, assignee: props.data.record.programLeaderID, assigneeName: props.data.record.programLeader, fundingAgency: props.data.record.fundingAgency, fundingCategory: props.data.record.fundingCategory})
    }, [props.data])

    async function handleUpdate(){
       let res = await onUpdateProgram({user: userObj.USER._id, programName: program.programName, assignee: program.assignee, assigneeName: program.assigneeName, program: props.data.record.programID, fundingAgency: program.fundingAgency, fundingCategory: program.fundingCategory})
       props.func({user: userObj.USER._id, programName: program.programName, assignee: program.assignee, assigneeName: program.assigneeName, program: props.data.record.programID, fundingAgency: program.fundingAgency, fundingCategory: program.fundingCategory});
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
                <Form.Item name='fundingCategory' label="Funding Category">
                    <Select style={{ width: '100%' }} onChange={handleChangeInFundingCat} value={program.fundingCategory} placeholder="Select funding category">
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
                    <Input placeholder="Enter Funding Agency" onChange={e => setProgram({...program, fundingAgency: e.target.value})} value={program.fundingAgency} ></Input>
                </Form.Item>
                {/* to always require an assignee */}
                <Form.Item name='assignee' label="Assignee" rules={[
                    {
                    required:true,
                    message: 'Please Select atleast 1 User'
                    },
                ]}>
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
