import { Form, Select, Row, Button, Input } from 'antd'
import React, {useState, useEffect} from 'react'
import { onUpdateGalleryAdmin } from '../services/studyAPI';
import { notif } from '../functions/datagrid';

const EditGallery = (props) => {
    const [state, setstate] = useState({id: props.data.key, 
        active: props.data.active, 
        caption: props.data.caption, 
        studyID: props.data.studyID })
    const { Option } = Select;
    const [form] = Form.useForm();

    const initialValues = {active: props.data.active, 
        caption: props.data.caption, 
        studyID: props.data.studyID}
    const active = ['true', 'false']

    
    useEffect(() => {
        form.resetFields()
        setstate({id: props.data.key, 
            active: props.data.active, 
            caption: props.data.caption, 
            studyID: props.data.studyID})
    }, [props.data])

    function handleChangeActive(value) {   
        setstate({...state, active: value})
    }

    async function handleUpdate(){
        let res = await onUpdateGalleryAdmin(state)
        props.func(state);
        notif('info', res.data.message)
     }
    return (
        <div>
            <Form onFinish={handleUpdate}  form={form} initialValues={initialValues}>
                <Form.Item name='caption' label="Caption"
                rules={[
                    {
                    message: 'Please input program name!',
                    },
                ]}>
                    <Input placeholder="Enter comment" onChange={e => setstate({...state, caption: e.target.value})} value={state.caption} ></Input>
                </Form.Item>
                <Form.Item>
                <Form.Item name='studyID' label="Study ID"
                rules={[
                    {
                    message: 'Please input studyID!',
                    },
                ]}>
                    <Input placeholder="Enter Study ID" onChange={e => setstate({...state, studyID: e.target.value})} value={state.studyID} ></Input>
                </Form.Item>
                <Form.Item name='active' label="Active">
                    <Select style={{ width: '100%' }} onChange={handleChangeActive} value={state.active}>
                    {active.map(act => (
                        <Option key={act} value={act}>{act}</Option>
                    ))}
                    </Select>
                </Form.Item>
                </Form.Item>
                <Row justify="center">
                    <Button htmlType="submit" block  style={{background: "#A0BF85", borderRadius: "5px"}}>UPDATE GALLERY</Button>
                </Row>
            </Form>
        </div>
    )
}

export default EditGallery
