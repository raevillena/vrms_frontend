
import { Input, Button, Form, Row, Col, Typography, Spin, notification} from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone, MailOutlined} from '@ant-design/icons';
import React, {useState, useEffect} from 'react';
import { useHistory } from 'react-router-dom';
import {onUserLogin } from '@services/authAPI';
import { useDispatch } from 'react-redux';
import '../styles/CSS/Userdash.css'



function Login() {
  const  history = useHistory();
  const dispatch = useDispatch();
  const { Title } = Typography;

  const [user, setUser] = useState({email:"", password:""}); //for login state
  const [loading, setLoading] = useState(false)

  const notif = (type, message) => {
    notification[type]({
      message: 'Notification',
      description:
        message,
    });
  };

  async function onSubmit(){
    const getUser = {
      email: user.email,
      password: user.password
    }
    try {
      setLoading(true)
      let result = await onUserLogin(getUser)
      dispatch({
        type: "SET_USER",
        value: result.data.data
     })
      
      dispatch({
        type: "VERIFIED_AUTHENTICATION",
        value: true
     })

     dispatch({
      type: "LOGIN_SUCCESS"
   })
   localStorage.setItem("accessToken", result.data.accessToken);
   localStorage.setItem("refreshToken", result.data.token.refreshToken);
   localStorage.setItem("avatarFilename", result.data.data.avatarFilename);
   
     history.push('/')
    
    } catch (error) {
      setLoading(false)
      notif("error", error.response.data.message)
      dispatch({
        type: "GET_ERRORS",
        message: error.response.data.message,
        status: error.response.status
      })
      dispatch({
        type: "LOGIN_FAIL",
      })
    }
  }
 
  const forgotPassword = () => {
    history.push('/forgotpassword')
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
  if(height <= 760 && width <= 768){
    return(
      <div> {loading? <Spin className="spinner" />  :
      <div style={{background: '#f2f2f2',height:'100%', width: '100%'}}>
        <Row justify="center">
      <Col  >
        <Form style={{marginTop: "40%", width: '100%', alignItems:'center', justifyContent:'center' , minHeight: "90vh"}} name="basic"initialValues={{remember: true}} onFinish={onSubmit}>
        <Title style={{fontFamily: "Bangla MN", fontWeight: "bolder", fontSize: '16px'}}>VIRTUAL REASEARCH MANAGEMENT SYSTEM</Title>
          <Form.Item name="email"  
              rules={[
              {
                required: true,
                message: 'Please input your email!',
              },
              ]}
          >
            <Input  placeholder="Enter Email" prefix={<MailOutlined />} onChange={e => setUser({...user, email: e.target.value})} value={user.email}/>
          </Form.Item>
  
          <Form.Item name="password" 
            rules={[
              {
                required: true,
                message: 'Please input your password!'
              },
            ]}
            >
              <Input.Password placeholder="Enter password" iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)} onChange={e => setUser({...user, password: e.target.value})} value={user.password}/>
          </Form.Item>
          <Form.Item><Button type= "link" style={{fontFamily: "Montserrat",color: "#000000", float: 'right'}} onClick={forgotPassword}> Forgot your password?</Button></Form.Item>
          <Form.Item><Button block style={{background: "#A0BF85", borderRadius: "5px"}} htmlType="submit" >LOGIN</Button></Form.Item>
          
      </Form>
      </Col>
      </Row>
      </div>}
      </div>
    )}

  return (
    <div>
      {loading? <Spin className="spinner" />  :
    <div style={{background: '#f2f2f2', minHeight: "100vh"}}>
     <Row justify="center">
    <Col  >
      <Form style={{marginTop: "40%"}} name="basic" initialValues={{remember: true,}} onFinish={onSubmit}>
      <Title level={4} style={{fontFamily: "Bangla MN", fontWeight: "bolder"}}>VIRTUAL REASEARCH MANAGEMENT SYSTEM</Title>
        <Form.Item name="email"  
            rules={[
            {
              type: 'email',
              required: true,
            },
            ]}
        >
          <Input  placeholder="Enter Email" prefix={<MailOutlined />} onChange={e => setUser({...user, email: e.target.value})} value={user.email}/>
        </Form.Item>

        <Form.Item name="password" 
          rules={[
            {
              required: true,
              message: 'Please input your password!',
            },
          ]}
          >
            <Input.Password placeholder="Enter password" iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)} onChange={e => setUser({...user, password: e.target.value})} value={user.password}/>
        </Form.Item>
        <Form.Item><Button type= "link" style={{fontFamily: "Montserrat",color: "#000000", float: 'right'}} onClick={forgotPassword}> Forgot your password?</Button></Form.Item>
        <Form.Item><Button block style={{background: "#A0BF85", borderRadius: "5px"}} htmlType="submit" >LOGIN</Button></Form.Item>
        
    </Form>
    </Col>
    </Row>
    </div>}
    </div>
  )
}


export default Login;