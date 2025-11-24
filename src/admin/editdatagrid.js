import React, {useState, useEffect} from 'react'
import {Button, Input, Form, Row, Select, Space, DatePicker} from 'antd'
import moment from 'moment';
import { notif } from '../functions/datagrid';
import {onUpdateDatagridAdmin } from '../services/studyAPI';
import { useSelector } from 'react-redux';


const EditDatagrid = (props) => {
    const { Option } = Select;
    const [form] = Form.useForm();
    const active = ['true', 'false']
    const userObj = useSelector(state => state.user)

    const [datagrid, setDatagrid] = useState({user: userObj.USER.name ,
        id:props.data.tableID, 
        active: props.data.active, 
        createdBy: props.data.createdBy, 
        title: props.data.title, 
        description: props.data.description, 
        updatedBy: props.data.updatedBy, 
        studyID: props.data.studyID, 
        dateCreated: moment(props.data.dateCreated) })
    
    const initialValues = { active: props.data.active, 
        createdBy: props.data.createdBy, 
        title: props.data.title, 
        description: props.data.description, 
        updatedBy: props.data.updatedBy, 
        studyID: props.data.studyID, 
        dateCreated: moment(props.data.dateCreated) }

    useEffect(() => {
        setDatagrid({user: userObj.USER.name ,
            id:props.data.tableID, 
            active: props.data.active, 
            createdBy: props.data.createdBy, 
            title: props.data.title, 
            description: props.data.description, 
            updatedBy: props.data.updatedBy, 
            studyID: props.data.studyID, 
            dateCreated: moment(props.data.dateCreated) })
        form.resetFields()
    }, [props.data])
      
    async function handleUpdate(){ //updating datagrid data
     let res = await onUpdateDatagridAdmin(datagrid)
     props.func(datagrid);
        notif('info', res.data.message)
    }

    function handleChangeActive(value) {   //deleting or retrieving
        setDatagrid({...datagrid, active: value})
    }

    return (
        <div>
            <Form onFinish={handleUpdate}  form={form} initialValues={initialValues}>
                <Form.Item name='title' label="Table Title">
                    <Input placeholder="Enter Table Title" onChange={e => setDatagrid({...datagrid, title: e.target.value})} value={datagrid.title} ></Input>
                </Form.Item>
                <Form.Item name='description' label="Table Description">
                    <Input placeholder="Enter Table Description" onChange={e => setDatagrid({...datagrid, description: e.target.value})} value={datagrid.description} ></Input>
                </Form.Item>
                <Form.Item name='studyID' label="Study">
                    <Input placeholder="Study" onChange={e => setDatagrid({...datagrid, studyID: e.target.value})} value={datagrid.studyID} ></Input>
                </Form.Item>
                <Form.Item name='active' label="Active">
                    <Select style={{ width: '100%' }} onChange={handleChangeActive} value={datagrid.active} placeholder="Active">
                    {active.map(act => (
                        <Option key={act} value={act}>{act}</Option>
                    ))}
                    </Select>
                </Form.Item>
                <Form.Item name='createdBy' label="Created By;">
                    <Input disabled={true} placeholder="Created By"  value={datagrid.createdBy} ></Input>
                </Form.Item>
                <Form.Item name='updatedBy' label="Updated By">
                    <Input disabled={true} placeholder="Enter Task Description"  value={datagrid.updatedBy} ></Input>
                </Form.Item>
                <Form.Item name='dateCreated'  label="Date Created">
                    <Space direction="vertical">
                    <DatePicker disabled={true} value={datagrid.dateCreated}/>
                    </Space>
                </Form.Item>
                <Row justify="center">
                    <Button htmlType="submit" block  style={{background: "#A0BF85", borderRadius: "5px"}}>UPDATE DATAGRID</Button>
                </Row>
            </Form>
        </div>
    )
}

export default EditDatagrid
