import React, {useState, useEffect} from 'react'
import {Form, Input, Button, Select, Space, DatePicker} from 'antd'
import { useSelector } from 'react-redux';
import { notif } from '../functions/datagrid';
import { onGetAllUsers } from '../services/userAPI';
import moment from 'moment';
import { onUpdateStudy } from '../services/studyAPI';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

const { TextArea } = Input;

const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 4 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 20 },
    },
  };
  
const formItemLayoutWithOutLabel = {
    wrapperCol: {
      xs: { span: 24, offset: 0 },
      sm: { span: 20, offset: 4 },
    },
};

const EditStudy = (props) => {
    const userObj = useSelector(state => state.user)
    const projectObj = useSelector(state => state.project)

    const { Option } = Select;
    const [form] = Form.useForm();
    const [userData, setUserData] = useState([])
    const [study, setStudy] = useState({studyID: props.data.record.studyID ,title: props.data.record.title, projectName: projectObj.PROJECT._id, deadline:moment( props.data.record.deadline) ,assignee:props.data.record.assignee, 
        assigneeName:props.data.record.assigneeName, budget: props.data.record.budget, user: userObj.USER.name, fundingAgency: props.data.record.fundingAgency, fundingCategory: props.data.record.fundingCategory})

    const initialValues = {title: props.data.record.title, deadline:moment( props.data.record.deadline) ,assignee:props.data.record.assignee, assigneeName:props.data.record.assigneeName, 
        budget: props.data.record.budget, objectives:props.data.record.objectives, fundingAgency: props.data.record.fundingAgency, fundingCategory: props.data.record.fundingCategory }

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
        setStudy({...study,title: props.data.record.title, assignee: props.data.record.assignee, assigneeName: props.data.record.assigneeName, budget: props.data.record.budget, deadline: moment( props.data.record.deadline),
        fundingAgency: props.data.record.fundingAgency, fundingCategory: props.data.record.fundingCategory })
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

    function handleChangeInFundingCat(value) {   //for assigning user
        setStudy({...study, fundingCategory: value})
    }

    function onChange(date) {
        setStudy({...study, deadline:moment( date)})
    }

    async function handleUpdate(value){
        let res = await onUpdateStudy({study, value})
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
                    <Form.Item name='fundingCategory' label="Funding Category">
                        <Select style={{ width: '100%' }} onChange={handleChangeInFundingCat} value={study.fundingCategory} placeholder="Select funding category">
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
                        <Input placeholder="Enter Funding Agency" onChange={e => setStudy({...study, fundingAgency: e.target.value})} value={study.fundingAgency} ></Input>
                    </Form.Item>
                    <Form.Item name='deadline'  label="Deadline">
                        <Space direction="vertical">
                        <DatePicker value={study.deadline} onChange={onChange}/>
                        </Space>
                    </Form.Item>
                    <Form.List
                                name="objectives"
                                rules={[
                                {
                                    validator: async (_, objective) => {
                                    if (!objective || objective.length < 2) {
                                        return Promise.reject(new Error('At least 2 objectives'));
                                    }
                                    }
                                },
                                ]}
                            >
                                {(fields, { add, remove }, { errors }) => (
                                <>
                                    {fields.map((field, index) => (
                                    <Form.Item
                                        {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
                                        label={index === 0 ? 'Objectives' : ''}
                                        required={false}
                                        key={field.key}
                                    >
                                        <Form.Item
                                        {...field}
                                        validateTrigger={['onChange', 'onBlur']}
                                        rules={[
                                            {
                                            required: true,
                                            whitespace: true,
                                            message: "Please input objective or delete this field.",
                                            },
                                        ]}
                                        noStyle
                                        >
                                        <TextArea autoSize={{ minRows: 3, maxRows: 6 }} placeholder="Objective" style={{width: '95%'}} />
                                        </Form.Item>
                                        {fields.length > 1 ? (
                                        <MinusCircleOutlined
                                            className="dynamic-delete-button"
                                            onClick={() => remove(field.name)}
                                        />
                                        ) : null}
                                    </Form.Item>
                                    ))}
                                    <Form.Item>
                                    <Button
                                        type="dashed"
                                        onClick={() => add()}
                                        style={{ width: '100%' }}
                                        icon={<PlusOutlined />}
                                    >
                                        Add objective
                                    </Button>
                                    <Form.ErrorList errors={errors} />
                                    </Form.Item>
                                </>
                                )}
                            </Form.List>
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
