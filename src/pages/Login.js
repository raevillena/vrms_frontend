
import { Input, Button, Form, Row, Col, Typography} from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone, MailOutlined} from '@ant-design/icons';
import React, {useState, useEffect} from 'react';
import { useHistory } from 'react-router-dom';
import {onUserLogin } from '@services/authAPI';
import { useDispatch, useSelector } from 'react-redux';



function Login() {
  const  history = useHistory();
  const dispatch = useDispatch();
  const { Title } = Typography;
  const [user, setUser] = useState({email:"", password:""}); //for login state
  async function onSubmit(){
    const getUser = {
      email: user.email,
      password: user.password
    }
    try {
      let result = await onUserLogin(getUser)
      localStorage.setItem("accessToken", result.data.accessToken);
      localStorage.setItem("refreshToken", result.data.token.refreshToken);
      localStorage.setItem("avatarFilename", result.data.data.avatarFilename);

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
     history.push('/dash')

    } catch (error) {
      alert(error.response.data.message)
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
      <div style={{background: '#f2f2f2', minHeight: "100vh"}}>
        <Row justify="center">
      <Col  >
        <Form style={{marginTop: "40%", width: '400px'}} name="basic"initialValues={{remember: true}} onFinish={onSubmit}>
        <Title level={5} style={{fontFamily: "Bangla MN", fontWeight: "bolder"}}>VIRTUAL REASEARCH MANAGEMENT SYSTEM</Title>
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
      </div>
    )}
  return (
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
    </div>
  )
}


export default Login;