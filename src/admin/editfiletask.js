import { Form, Select, Row, Button, Input } from 'antd'
import React, {useState, useEffect} from 'react'
import { notif } from '../functions/datagrid';
import { onUpdateFileTaskAdmin } from '../services/taskAPI';

const EditFileTask = (props) => {
    const [state, setstate] = useState({id: props.data.key, 
        description: props.data.description, 
        taskID: props.data.taskID, 
        active: props.data.active, 
        uploadedBy: props.data.uploadedBy, 
        uploadedByID: props.data.uploadedByID })
    const { Option } = Select;
    const [form] = Form.useForm();

    const initialValues = {id: props.data.key, 
        description: props.data.description, 
        taskID: props.data.taskID, 
        active: props.data.active, 
        uploadedBy: props.data.uploadedBy, 
        uploadedByID: props.data.uploadedByID }
    const active = ['true', 'false']

    useEffect(() => {
        form.resetFields()
        setstate({id: props.data.key, 
            description: props.data.description, 
            taskID: props.data.taskID, 
            active: props.data.active, 
            uploadedBy: props.data.uploadedBy, 
            uploadedByID: props.data.uploadedByID })
    }, [props.data])

    function handleChangeActive(value) {   //deleting or retrieving
        setstate({...state, active: value})
    }

    async function handleUpdate(){
        let res = await onUpdateFileTaskAdmin(state)
        props.func2(state);
        notif('info', res.data.message)
     }
    return (
        <div>
            <Form onFinish={handleUpdate}  form={form} initialValues={initialValues}>
                <Form.Item name='description' label="Description"
                rules={[
                    {
                    message: 'Please input Description!',
                    },
                ]}>
                    <Input placeholder="Enter description" onChange={e => setstate({...state, description: e.target.value})} value={state.description} ></Input>
                </Form.Item>
                <Form.Item>
                <Form.Item name='taskID' label="Task ID"
                rules={[
                    {
                    message: 'Please input task ID!',
                    },
                ]}>
                    <Input placeholder="Enter task ID" onChange={e => setstate({...state, taskID: e.target.value})} value={state.taskID} ></Input>
                </Form.Item>
                <Form.Item name='active' label="Active">
                    <Select style={{ width: '100%' }} onChange={handleChangeActive} value={state.active}>
                    {active.map(act => (
                        <Option key={act} value={act}>{act}</Option>
                    ))}
                    </Select>
                </Form.Item>
                </Form.Item>
                <Form.Item name='uploadedBy' label="Task ID">
                    <Input placeholder="Enter task ID" disabled={true} onChange={e => setstate({...state, uploadedBy: e.target.value})} value={state.uploadedBy} ></Input>
                </Form.Item>
                <Row justify="center">
                    <Button htmlType="submit" block  style={{background: "#A0BF85", borderRadius: "5px"}}>UPDATE PROGRAM</Button>
                </Row>
            </Form>
        </div>
    )
}

export default EditFileTask
