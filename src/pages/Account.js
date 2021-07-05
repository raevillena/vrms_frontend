import { Row, Col, Layout, Button, Form, Input, Typography, Upload, Modal } from 'antd'
import React, {useState, useEffect} from 'react';
import { useSelector} from 'react-redux';
import {EyeInvisibleOutlined, EyeTwoTone, PlusOutlined} from '@ant-design/icons';
import Sidebar from '../components/components/Sidebar'
import { onChangePassword } from '../services/userAPI';
import Headers from '../components/components/Header'
import Mobile from '../pages/mobile/Userdash'


const { Header, Content, Sider } = Layout;

const Account = () => {
    const userObj = useSelector(state => state.userReducer) //reducer for user data
    const [password, setPassword] = useState({oldPassword: "", newPassword: "", confrimPassword: ""}) //for changepassword
    const { Title } = Typography;
    //for change password
    async function onSubmit(){
       try {
         console.log(userObj.USER._id)
          const data = {
            id : userObj.USER._id,
            newPass: password.newPassword,
            oldPass: password.oldPassword
          }
           if(password.newPassword !== password.confrimPassword){
            alert("Password does not match!")
           }else{
              await onChangePassword(data)
              alert("Password Updated")
          }
       } catch (error) {
          console.log(error)
          alert("Invalid password")
       }
    }

    function getBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
      });
    }

    const[state, setState] = useState({previewVisible: false,previewImage: '',previewTitle: '', fileList: {uid: '', name: '', status: 'done', url:''}})

    const handleCancel = () => setState({ 
        ...state,
        previewVisible: false,
     });

    const handlePreview = async file => {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
      }
      console.log("preview props",fileList)
      setState({
        previewImage: file.url || file.preview,
        previewVisible: true,
        previewTitle: previewTitle,
        fileList: fileList
      });
    };
    
    const { previewVisible, previewImage, previewTitle, fileList } = state;
    const uploadButton = (
      <div>
        <PlusOutlined />
        <div style={{ marginTop: 8}}>Upload</div>
      </div>
    );
    function handleChange(fileList){
      setState({ fileList: [{...fileList.fileList}]})
    }
    
  function useWindowSize(){
    const [size, setSize] = useState([window.innerHeight, window.innerWidth]);
    useEffect(() => {
      const handleResize = () => {
        setSize([window.innerHeight, window.innerWidth])
      }
      window.addEventListener("resize", handleResize)
      return() => {
        window.removeEventListener("resize", handleResize)
      }
    }, [])
    return size;
  }

  const [height, width] = useWindowSize();
  if(height <= 768 && width <= 768){
    return <Mobile/>}

    return (
    <div>
      <Layout  > 
        <Sider  style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          background:'white'
        }} >
          <Sidebar/>
        </Sider>
        <Layout style={{ marginLeft: 200 }}>
          <Header style={{ padding: 0, background:'#f2f2f2' }} >
            <Headers/>
          </Header>
          <Content style={{ margin: '24px 16px 0', minHeight: "100vh" }} > 
          <div style={{display: 'flex', flexDirection: 'row'}}>
            <Row style={{gap:'10px'}} >
            <div style={{borderRadius: "10px", background:"white", fontFamily: "Montserrat"}}>
              <Row style={{marginTop:'20px', marginLeft: '20px'}}>
                <Col xs={{span: 12}}  >
                <Upload 
                  //action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                  listType="picture-card"
                  onPreview={handlePreview}
                  onChange={handleChange}
                >{fileList.length === 1 ? null : uploadButton}
                </Upload>
                <Modal 
                  visible={previewVisible}
                  title={previewTitle}
                  footer={null}
                  onCancel={handleCancel}
                >
                  <img alt="example" style={{ width: '100%'}} src={previewImage} />
                </Modal>
                </Col>
                <Col xs={{span: 12}}>
                <Title level={3}>{userObj.USER.name}</Title>
                <p>{userObj.USER.title}</p>
                <p >{userObj.USER.project}</p>
                <p>{userObj.USER.email}</p>
              </Col>
              </Row>
            </div>
            <Col span={12}>
            <Form style={{borderRadius: "10px", background:"white", fontFamily: "Montserrat", display: 'grid', justifyItems: 'center'}} onFinish={onSubmit}>
                <Title level={3}>Change Password</Title>
                <Form.Item name="currentPassword" style={{maxWidth:"50%"}}
                    rules={[
                      {
                        required: true,
                        message: 'Please enter your current password!',
                      },
                    ]}
                >
                  <label>Current Password</label>
                  <Input.Password placeholder="Current Password" iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)} 
                  onChange={e => setPassword({...password, oldPassword: e.target.value})} value={password.oldPassword}/>
                </Form.Item>
                <Form.Item name="newPassword" style={{maxWidth:"50%"}}
                  rules={[
                  {
                    required: true,
                    message: 'Please input your new password!',
                  },
                ]}
                >
                <label>New Password</label>
                <Input.Password placeholder="New Password" iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)} 
                  onChange={e => setPassword({...password, newPassword: e.target.value})} value={password.newPassword}/>
                </Form.Item>
                <Form.Item  name="confirmPassword" style={{maxWidth:"50%"}}
                    rules={[
                      {
                        required: true,
                        message: 'Please confirm your new password!',
                      },
                    ]}
                >
                  <label>Confirm Password</label>
                  <Input.Password placeholder="Confirm New Password" iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)} 
                  onChange={e => setPassword({...password, confrimPassword: e.target.value})} value={password.confrimPassword}
                />
                </Form.Item>
                <Form.Item>
                  <Button htmlType="submit" style={{background: "#A0BF85", borderRadius: "5px"}}>SUBMIT</Button>
                </Form.Item>
        </Form>
        </Col>
        </Row>
      </div>
        </Content>
        
      </Layout>      
      </Layout>
    </div>
    )
    

}

export default Account
