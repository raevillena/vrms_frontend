import { Input, Button, Form, DatePicker, Space, Select, notification, Layout, Modal, Tooltip, InputNumber} from 'antd';
import React, {useState, useEffect} from 'react';
import { onStudyCreate } from '../services/studyAPI';
import { onGetAllUsers } from '../services/userAPI';
import { useSelector } from 'react-redux';
import ManagerStudyDash from './ManagerStudyDash';
import MobileHeader from '../components/components/ManagerHeaderMobile';
import Sidebar from '../components/components/ManagerSidebar'
import Headers from '../components/components/Header'
import '../styles/CSS/Userdash.css'

const { Header, Content, Sider } = Layout;

const Study = () => {
    const { Option } = Select;
    const projectObj = useSelector(state => state.project) //redux for project
    const userObj = useSelector(state => state.user)

    const [userData, setUserData] = useState([])
    const [study, setStudy] = useState({title: "", projectName: projectObj.PROJECT.projectName, deadline:"",assignee:"", budget: "", user: userObj.USER.name})
    const [forProps, setForProps] = useState()
    const [isModalVisible, setIsModalVisible] = useState(false);
    
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
    
      const handleOk = () => {
        setIsModalVisible(false);
      };
    
      const handleCancel = () => {
        setIsModalVisible(false);
      };
      
    
    useEffect(() => {
        async function getUsers(){
            let resultUsers = await onGetAllUsers()
            let x = resultUsers.data
            let tempUserData = []
            for(let i = 0; i < x.length; i++){ 
                tempUserData.push({
                    key: x[i].name,
                    name:  x[i].name,
                    value:  x[i].name,
                })
            }
            setUserData(tempUserData)
        }
        getUsers()
    }, [])
    

    function handleChange(value) {   //for assigning user
        setStudy({...study, assignee: value})
    }


    async function onSubmit(){
        try {
           let result =  await onStudyCreate(study) 
           notif("success",result.data.message)
           setStudy({title: "  ", projectName:" ", deadline:" ",assignee:" "})
           setForProps(result.data.newStudy)
           //prompt study number and send email to those who are asigned to this project 
        } catch (error) {
            notif("error", error.response.data.message)
        }
    }

    function onChange(date) {
        setStudy({...study, deadline: date})
      }

    function budgetChange(value){
        setStudy({...study, budget: value})
    }

    
    return (
        <div>
            <Layout  > 
                <Sider  className="sidebar" >
                    <Sidebar/>
                </Sider>
            <Layout >
            <Header className="header" style={{ padding: 0, background:'#f2f2f2' }} >
                <Headers/>
            </Header>
            <div className="mobile-header">
                <MobileHeader/>
            </div>
             <Content style={{  minHeight: "200vh", minWidth: '100vh', background: '#f2f2f2' }} >
                <h3 style={{marginTop: '10px', marginLeft: '25px', fontFamily: 'initial'}}>{projectObj.PROJECT.projectName}</h3>          
                <ManagerStudyDash data={forProps}/> 
                <Tooltip placement="top" title="Add Study">
                    <Button className="add-button" onClick={showModal}>+</Button>
                </Tooltip>
                    <Modal title="Add Study" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                        <Form >
                        <h1 style={{fontFamily: "Montserrat", fontWeight: "bolder"}}>CREATE STUDY</h1>
                            <Form.Item 
                            rules={[
                                {
                                required: true,
                                message: 'Please input your title!',
                                },
                            ]}>
                                <Input placeholder="Enter Title" onChange={e => setStudy({...study, title: e.target.value})} value={study.title}></Input>
                            </Form.Item>
                            <Form.Item  
                                    rules={[
                                    {
                                        required: true,
                                        message: 'Please enter budget!',
                                    },
                                    ]}>
                                <label style={{fontWeight:'bolder'}}>Budget: </label>
                                <InputNumber style={{width:'250px'}} placeholder="Enter Budget" min={1} max={1000000000}
                                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                onChange={budgetChange} ></InputNumber>
                            </Form.Item>
                            <Form.Item  
                                    rules={[
                                    {
                                        required: true,
                                        message: 'Please input deadline of study!',
                                    },
                                    ]}>
                                <label style={{fontWeight:'bolder'}}>Deadline: </label>
                                <Space direction="vertical">
                                <DatePicker onChange={onChange}/>
                                </Space>
                            </Form.Item>
                            <Form.Item 
                                    rules={[
                                    {
                                        required: true,
                                        message: 'Please assign the study!',
                                    },
                                    ]}>
                                <Select mode="tags" style={{ width: '100%' }} onChange={handleChange} tokenSeparators={[',']} placeholder="Assign Study">
                                {userData.map(user => (
                                    <Option key={user.key} value={user.value}>{user.name}</Option>
                                ))}
                                </Select>
                            </Form.Item>
                            <Button onClick={onSubmit} style={{background: "#A0BF85", borderRadius: "5px"}}>CREATE STUDY</Button>
                        </Form>
                    </Modal>
            </Content> 
            </Layout>      
            </Layout>
            
        </div>
    )
}

export default Study
