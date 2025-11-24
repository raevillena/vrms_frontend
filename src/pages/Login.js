
import { Input, Button, Form, Row, Col, Typography, Spin, notification} from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone, MailOutlined, KeyOutlined} from '@ant-design/icons';
import React, {useState, useEffect} from 'react';
import { useHistory } from 'react-router-dom';
import { onUserLogin } from '@services/authAPI';
import { useDispatch } from 'react-redux';
import '../styles/CSS/Userdash.css'


function Login() {
  const  history = useHistory();
  const dispatch = useDispatch();
  const { Title } = Typography;
  const [isOnline, set_isOnline] = useState(true);
  let interval = null;
  const InternetErrMessagenger = () => set_isOnline(navigator.onLine);

  const [user, setUser] = useState({email:"", password:""}); //for login state
  const [loading, setLoading] = useState(false)

  const notif = (type, message) => {
    notification[type]({
      message: 'Notification',
      description:
        message,
    });
  };

  useEffect(()=>{
    interval = setInterval(InternetErrMessagenger, 6000); // call the function name only not with function with call `()`
    return ()=>{
       clearInterval(interval) // for component unmount stop the interval
    }
 },[])

 useEffect(() => {
   if(isOnline!==true){
    history.push('/offline')
   }
 }, [isOnline])
 
  async function onSubmit(){
    const getUser = {
      email: user.email,
      password: user.password
    }
    try {
      setLoading(true)
      dispatch({
        type: "LOGIN_LOADING",
        LOADING: true
      })
      let result = await onUserLogin(getUser)
      dispatch({
        type: "SET_USER",
        value: result.data.data,
      })

      //better if tokens where set in the reducers to ensure that the localstorage and redux is in sync
      localStorage.setItem("accessToken", result.data.accessToken);
      localStorage.setItem("refreshToken", result.data.token.refreshToken);
      localStorage.setItem("avatarFilename", result.data.data.avatarFilename);

      dispatch({
        type: "LOGIN_SUCCESS",
        value: true,
        accessToken: result.data.accessToken,
        refreshToken:result.data.token.refreshToken,
        avatarFilename: result.data.data.avatarFilename,
        LOADING: false
      })
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
 


  return (
    <div>
      {loading? <Spin className="spinner" />  :
        <div style={{background: '#f2f2f2', minHeight: "100vh"}}>
          <Row justify="center">
            <Col  >
              <Form style={{marginTop: "40%"}} name="basic" initialValues={{remember: true,}} onFinish={onSubmit}>
              <Title style={{fontFamily: "Roboto", fontWeight: "bolder", fontSize: '15px'}}>VIRTUAL REASEARCH MANAGEMENT SYSTEM</Title>
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
                    <Input.Password prefix={<KeyOutlined />} placeholder="Enter password" iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)} onChange={e => setUser({...user, password: e.target.value})} value={user.password}/>
                </Form.Item>
                <Form.Item><Button type= "link" style={{fontFamily: "Montserrat",color: "#000000", float: 'right'}} onClick={forgotPassword}> Forgot your password?</Button></Form.Item>
                <Form.Item><Button block style={{background: "#A0BF85", borderRadius: "5px"}} htmlType="submit" >LOGIN</Button></Form.Item>
                
            </Form>
            </Col>
          </Row>
        </div>
      }
    </div>
  )
}


export default Login;