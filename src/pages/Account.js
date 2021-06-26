import { Row, Col, Layout, Button, Form, Input, Typography, Upload, message } from 'antd'
import React, {useState} from 'react';
import { useSelector} from 'react-redux';
import {EyeInvisibleOutlined, EyeTwoTone, LoadingOutlined, PlusOutlined} from '@ant-design/icons';
import Sidebar from '../components/components/Sidebar'
import { onChangePassword } from '../services/userAPI';
import Headers from '../components/components/Header'



const { Header, Content, Sider } = Layout;

const Account = () => {
    const userObj = useSelector(state => state.userReducer) //reducer for user data
    const [password, setPassword] = useState({oldPassword: "", newPassword: "", confrimPassword: ""})
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
           if(password.newPassword != password.confrimPassword){
            alert("Password does not match!")
           }else{
              await onChangePassword(data)
              alert("Successfully Updated Password")
          }
       } catch (error) {
           console.log(error)
       }
    }

    function getBase64(img, callback) {
      const reader = new FileReader();
      reader.addEventListener('load', () => callback(reader.result));
      reader.readAsDataURL(img);
    }
    
    function beforeUpload(file) {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJpgOrPng) {
        message.error('You can only upload JPG/PNG file!');
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error('Image must smaller than 2MB!');
      }
      return isJpgOrPng && isLt2M;
    }

    const handleChange = info => {
      if (info.file.status === 'uploading') {
        this.setState({ loading: true });
        return;
      }
      if (info.file.status === 'done') {
        // Get this url from response in real world.
        getBase64(info.file.originFileObj, imageUrl =>
          this.setState({
            imageUrl,
            loading: false,
          }),
        );
      }
    }

    const { loading, imageUrl } = this.state;
    const uploadButton = (
      <div>
        {loading ? <LoadingOutlined /> : <PlusOutlined />}
        <div style={{ marginTop: 8 }}>Upload</div>
      </div>
    );
 
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
          <Content style={{ margin: '24px 16px 0', overflow: 'initial', minHeight: "100vh" }} > 
            <Row gutter={48}> 
            <Col xs={{span: 8}}>
            <Form style={{borderRadius: "10px", background:"white", fontFamily: "Montserrat", maxHeight:'100%'}}>
              <Row gutter={8}>
                <Col xs={{span: 12}}>
                <Upload
                    name="avatar"
                    listType="picture-card"
                    className="avatar-uploader"
                    showUploadList={false}
                    action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                    beforeUpload={beforeUpload}
                    onChange={handleChange}
                  >
                    {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
                </Upload>
                </Col>
                <Col xs={{span: 12}}>
                <Title level={3}>{userObj.USER.name}</Title>
                <Title level={5}>{userObj.USER.title}</Title>
                <Title level={5}>{userObj.USER.project}</Title>
                <Title level={5}>{userObj.USER.email}</Title>
              </Col>
              </Row>
            </Form>
            </Col> 
            <Col xs={{span: 8}}>
            <Form style={{borderRadius: "10px", background:"white", fontFamily: "Montserrat", display: 'grid', justifyItems: 'center'}}>
            <Title>Change Password</Title>
            <Form.Item style={{maxWidth:"50%"}}
                rules={[
                  {
                    required: true,
                    message: 'Please current your password!',
                  },
                ]}
            >
              <label>Current Password</label>
              <Input.Password placeholder="Current Password" iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)} 
              onChange={e => setPassword({...password, oldPassword: e.target.value})} value={password.oldPassword}
            />
            </Form.Item>
            <Form.Item style={{maxWidth:"50%"}}
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
            <Form.Item style={{maxWidth:"50%"}}
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
              <Button htmlType="submit" style={{background: "#A0BF85", borderRadius: "5px"}}onClick={onSubmit}>SUBMIT</Button>
            </Form.Item>
          
        </Form>
        </Col>
        </Row>  
        </Content>
        
      </Layout>      
      </Layout>
    </div>
    )
    

}

export default Account
