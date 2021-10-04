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
    const [project, setProject] = useState({projectName: '', assignee: [], assigneeName: [], user: userObj.USER.name});
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [forProps, setForProps] = useState()

    const initialValues = {projectName: '', assignee: [], assigneeName: []}

    function handleChange(value) {   //for assigning user
        let tempArray =[]
        value.forEach(id => {
            userData.forEach(user => {
                if(user.value === id){
                   tempArray.push(user.name)
                }
            });
        });
        setProject({...project, assignee: value, assigneeName: tempArray})
    }

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
    
      const handleOk = () => {
        form.resetFields()
        setIsModalVisible(false);
      };
    
      const handleCancel = () => {
        setIsModalVisible(false);
        form.resetFields()
        setProject({...project, projectName: '', assignee: []})
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
                    value: x[i]._id
                })
            }
            setUserData(tempUserData)
        }
       getUsers()
    }, [])

    async function onSubmit(){
        try {
          let result =  await onProjectCreate(project)
          const data = result.data.newProject
          notif("success",result.data.message)
          form.resetFields()
          setProject({projectName: "", assignee: ""})
          setForProps(data)
          setProject({...project, projectName: '', assignee: []})
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
                        <Form onFinish={onSubmit} form={form} initialValues={initialValues}>
                            <Form.Item name='projectName' label="Project Name"
                            rules={[
                                {
                                required: true,
                                message: 'Please input project name!',
                                },
                            ]}>
                                <Input placeholder="Enter Project Name" onChange={e => setProject({...project, projectName: e.target.value})} value={project.projectName}></Input>
                            </Form.Item>
                            <Form.Item name='assignee'  label="Assignee"
                                    rules={[
                                    {
                                        required: true,
                                        message: 'Please assign the project!',
                                    },
                                    ]}>
                                <Select mode="tags" style={{ width: '100%' }} onChange={handleChange} tokenSeparators={[',']} value={project.assignee} placeholder="Assign Project">
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
