import { Input, Button, Form, Row, Select, Layout, Tooltip, Modal, notification} from 'antd';
import React, {useState, useEffect} from 'react';
import { onProjectCreate } from '../services/projectAPI.js';
import { onGetAllManagers } from '../services/userAPI';
import Sidebar from '../components/components/ManagerSidebar'
import Headers from '../components/components/HeaderManager'
import MobileHeader from '../components/components/ManagerHeaderMobile';
import ManagerDash from './ManagerDash.js';
import { useSelector } from 'react-redux';

const { Header, Content, Sider } = Layout;

const Project = () => {
    const { Option } = Select;
    const userObj = useSelector(state => state.user)

    const [userData, setUserData] = useState([])
    const [project, setProject] = useState({projectName: '', assignee: '', user: userObj.USER.name});
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [forProps, setForProps] = useState()

    function handleChange(value) {   //for assigning user
        setProject({...project, assignee: value})
    }

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
            let resultUsers = await onGetAllManagers()
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

    async function onSubmit(){
        try {
          let result =  await onProjectCreate(project) 
          notif("success",result.data.message)
          setProject({projectName: "", assignee: ""})
          setForProps(result.data.newProject)
        } catch (error) {
           notif("error",error.response.data.message)
        }
    }

    return (
        <div>

        <Layout  > 
            <Sider  className="sidebar" >
            <Sidebar/>
            </Sider>
            <Layout >
                <Header className="header"  >
                    <Headers/>
                </Header>
                <div className="mobile-header">
                    <MobileHeader/>
                </div>
                <Content style={{height: '100vh', width: '100%', background:'#f2f2f2'}} >          
                    <ManagerDash data={forProps}/>
                    <Tooltip placement="top" title="Add Study">
                        <Button className="add-button" onClick={showModal}>+</Button>
                    </Tooltip>
                    <Modal title="Add Project" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                    <Row justify="center">
                        <Form onFinish={onSubmit}>
                            <Form.Item  
                            rules={[
                                {
                                required: true,
                                message: 'Please input project name!',
                                },
                            ]}>
                                <Input placeholder="Enter Project Name" onChange={e => setProject({...project, projectName: e.target.value})} value={project.projectName}></Input>
                            </Form.Item>
                            <Form.Item 
                                    rules={[
                                    {
                                        required: true,
                                        message: 'Please assign the project!',
                                    },
                                    ]}>
                                <Select mode="tags" style={{ width: '100%' }} onChange={handleChange} tokenSeparators={[',']} placeholder="Assign Project">
                                {userData.map(user => (
                                    <Option key={user.key} value={user.value}>{user.name}</Option>
                                ))}
                                </Select>
                            </Form.Item>
                            <Row justify="center">
                            <Button htmlType="submit" block  style={{background: "#A0BF85", borderRadius: "5px"}}>CREATE PROJECT</Button>
                            </Row>
                        </Form>
                    </Row>
                    </Modal>
                </Content> 
            </Layout>      
        </Layout>
        </div>
    )
}

export default Project
