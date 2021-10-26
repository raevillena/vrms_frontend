import { Input, Button, Form, DatePicker, Space, Select, notification, Layout, Modal, Tooltip} from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import React, {useState, useEffect} from 'react';
import { onStudyCreate } from '../services/studyAPI';
import { onGetAllUsers } from '../services/userAPI';
import { useSelector } from 'react-redux';
import ManagerStudyDash from './ManagerStudyDash';
import MobileHeader from '../components/components/ManagerHeaderMobile';
import Sidebar from '../components/components/ManagerSidebar'
import DirectorSidebar from '../components/components/DirectorSidebar';
import Headers from '../components/components/Header'
import '../styles/CSS/Userdash.css'

const { Header, Content, Sider } = Layout;
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



const Study = () => {
    const { Option } = Select;
    const projectObj = useSelector(state => state.project) //redux for project
    const userObj = useSelector(state => state.user)
    const authObj = useSelector(state => state.auth)

    const [userData, setUserData] = useState([])
    const [study, setStudy] = useState({title: "", projectName: projectObj.PROJECT.projectID, deadline:"", startDate: "" ,assignee:[], assigneeName:[], budget: "", user: userObj.USER.name})
    const [forProps, setForProps] = useState()
    const [isModalVisible, setIsModalVisible] = useState(false);

    const initialValues = {title: "", deadline:"", startDate: "" ,assignee:[], assigneeName:[], budget: ""}

    const [form] = Form.useForm();
    
    const notif = (type, message) => {
        notification[type]({
          message: 'Notification',
          description:
            message,
        });
      };

      const showModal = () => {
        setIsModalVisible(true);
      };

    
      const handleCancel = () => {
        setIsModalVisible(false);
        form.resetFields()
        setStudy({...study, assignee: [], title: "", deadline: "", budget: "" ,startDate: ''})
      };
      
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
    }, [])
    
    async function onSubmit(values){
        try {
           let result = await onStudyCreate({values, study}, authObj.accessToken, authObj.refreshToken) 
           notif("success",result.data.message)
           form.resetFields()
           setForProps(result.data.newStudy)
           setStudy({title: " ", projectName:" ", deadline:"",assignee:[], startDate:''})
        } catch (error) {
            notif("error", error)
        }
    }

    function onChangeStartDate(date) {
        setStudy({...study, startDate: date})
    }

    function onChange(date) {
        setStudy({...study, deadline: date})
    }

    
    return (
        <div>
            <Layout  > 
                <Sider  className="sidebar" >
                {userObj.USER.category === "manager"? <Sidebar/> : <DirectorSidebar/>}
                </Sider>
            <Layout >
            <Header className="header" style={{ padding: 0, background:'#f2f2f2' }} >
                <Headers/>
            </Header>
            <div className="mobile-header">
                <MobileHeader/>
            </div>
             <Content style={{  width: '100%', height: '100vh', background: '#f2f2f2' }} >
                <h3 style={{marginTop: '10px', marginLeft: '25px', fontFamily: 'initial'}}>{projectObj.PROJECT.projectName}</h3>          
                <ManagerStudyDash data={forProps}/> 
                <Tooltip placement="top" title="Add Study">
                    <Button className="add-button" onClick={showModal}>+</Button>
                </Tooltip>
                    <Modal title="Add Study" visible={isModalVisible} footer={null} onCancel={handleCancel}>
                        <Form initialValues={initialValues} form={form} onFinish={onSubmit} name="dynamic_form_item" {...formItemLayoutWithOutLabel}>
                            <Form.Item {...formItemLayout} name='title' label="Study Title"
                            rules={[
                                {
                                required: true,
                                message: 'Please input your title!',
                                },
                            ]}>
                                <Input placeholder="Enter Title" onChange={e => setStudy({...study, title: e.target.value})} value={study.title}></Input>
                            </Form.Item>
                            <Form.Item {...formItemLayout} name='budget'  label="Budget"
                                    rules={[
                                    {
                                        required: true,
                                        message: 'Please enter budget!',
                                    },
                                    ]}>
                                <Input type="number" placeholder="Enter budget" onChange={(e)=> setStudy({...study, budget: e.target.value})} value={study.budget}/>
                            </Form.Item>
                            <Form.Item {...formItemLayout}  label="Start Date"
                                    rules={[
                                    {
                                        required: true,
                                        message: 'Please input start date of study!',
                                    },
                                    ]}>
                                <Space direction="vertical">
                                <DatePicker value={study.startDate} onChange={onChangeStartDate}/>
                                </Space>
                            </Form.Item>
                            <Form.Item {...formItemLayout}  label="Deadline"
                                    rules={[
                                    {
                                        required: true,
                                        message: 'Please input deadline of study!',
                                    },
                                    ]}>
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
                            <Form.Item {...formItemLayout} name='assignee' label="Assignee"
                                    rules={[
                                    {
                                        required: true,
                                        message: 'Please assign the study!',
                                    },
                                    ]}>
                                <Select mode="tags" style={{ width: '100%' }} onChange={handleChange} tokenSeparators={[',']} value={study.assignee} placeholder="Assign Study">
                                {userData.map(user => (
                                    <Option key={user.key} value={user.value}>{user.name}</Option>
                                ))}
                                </Select>
                            </Form.Item>
                            <Button htmlType='submit' block style={{background: "#A0BF85", borderRadius: "5px"}}>CREATE STUDY</Button>
                        </Form>
                    </Modal>
            </Content> 
            </Layout>      
            </Layout>
            
        </div>
    )
}

export default Study
