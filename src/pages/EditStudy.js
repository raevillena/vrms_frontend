import React, {useState, useEffect} from 'react'
import {Form, Input, Button, Select, Space, DatePicker} from 'antd'
import { useSelector } from 'react-redux';
import { notif } from '../functions/datagrid';
import { onGetAllUsers } from '../services/userAPI';
import moment from 'moment';
import { onUpdateStudy } from '../services/studyAPI';

const EditStudy = (props) => {
    const userObj = useSelector(state => state.user)
    const projectObj = useSelector(state => state.project)

    const { Option } = Select;
    const [form] = Form.useForm();
    const [userData, setUserData] = useState([])
    const [study, setStudy] = useState({studyID: props.data.record.studyID ,title: props.data.record.title, projectName: projectObj.PROJECT._id, deadline:moment( props.data.record.deadline) ,assignee:props.data.record.assignee, assigneeName:props.data.record.assigneeName, budget: props.data.record.budget, user: userObj.USER.name})

    const initialValues = {title: props.data.record.title, deadline:moment( props.data.record.deadline) ,assignee:props.data.record.assignee, 
    assigneeName:props.data.record.assigneeName, budget: props.data.record.budget}

    useEffect(() => {
        async function getUsers(){
            let resultUsers = await onGetAllUsers()
            let x = resultUsers.data
            let tempUserData = []
            for(let i = 0; i < x.length; i++){ 
                tempUserData.push({
                    key: x[i].name,
                    name:  x[i].name,
                    value:  x[i]._id,
                })
            }
            setUserData(tempUserData)
        }
        getUsers()
        setStudy({...study,title: props.data.record.title, assignee: props.data.record.assignee, assigneeName: props.data.record.assigneeName, budget: props.data.record.budget, deadline: moment( props.data.record.deadline)})
        form.resetFields()
    }, [props.data])

    function handleChange(value) {   //for assigning user
        let tempArray =[]
        value.forEach(id => {
            userData.forEach(user => {
                if(user.value === id){
                   tempArray.push(user.name)
                }
            });
        });
        setStudy({...study, assignee: value, assigneeName: tempArray})
    }

    function onChange(date) {
        setStudy({...study, deadline:moment( date)})
    }

    async function handleUpdate(){
        let res = await onUpdateStudy(study)
        props.func({user: userObj.USER._id, study});
        notif('info', res.data.message)
     }

    return (
        <div>
            <Form onFinish={handleUpdate} initialValues={initialValues} form={form} >
                    <Form.Item name='title' label="Study Title">
                        <Input placeholder="Enter Title" onChange={e => setStudy({...study, title: e.target.value})} value={study.title}></Input>
                    </Form.Item>
                    <Form.Item name='budget'  label="Budget">
                        <Input type="number" placeholder="Enter budget" onChange={(e)=> setStudy({...study, budget: e.target.value})} value={study.budget}/>
                    </Form.Item>
                    <Form.Item name='deadline'  label="Deadline">
                        <Space direction="vertical">
                        <DatePicker value={study.deadline} onChange={onChange}/>
                        </Space>
                    </Form.Item>
                    <Form.Item name='assignee' label="Assignee">
                        <Select mode="tags" style={{ width: '100%' }} onChange={handleChange} tokenSeparators={[',']} value={study.assignee} placeholder="Assign Study">
                        {userData.map(user => (
                            <Option key={user.key} value={user.value}>{user.name}</Option>
                        ))}
                        </Select>
                    </Form.Item>
                    <Button htmlType='submit' style={{background: "#A0BF85", borderRadius: "5px"}} block>UPDATE STUDY</Button>
                </Form>
        </div>
    )
}

export default EditStudy
