import { Row, Layout, Typography,Avatar, Col, Spin } from 'antd'
import React, {useState, useEffect} from 'react';
import { useSelector, useDispatch} from 'react-redux';
import {UserOutlined} from '@ant-design/icons';
import Sidebar from '../components/components/Sidebar'
import Headers from '../components/components/Header'
import Mobile from '../pages/mobile/Userdash'
import { onUploadAvatar } from '../services/uploadAPI';
import '../styles/CSS/Account.css'
import ChangePassword from './ChangePassword';

const { Header, Content, Sider } = Layout;

const Account = () => {
    const userObj = useSelector(state => state.user) //reducer for user data
    const[file, setFile] = useState(); //for uploading avatar
    const [imgData, setImgData] = useState() //for displaying avatar
    const { Title } = Typography;
    let avatar = localStorage.getItem("avatarFilename")
    
   //for mobile UI 
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
 
  useEffect(()=>{
    console.log(userObj)
  },[file])

  //for mobile ui
  const [height, width] = useWindowSize();
  if(height <= 768 || width <= 768){
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
            <Row style={{rowGap:'0px', gap: '10px'}} >
            <div style={{borderRadius: "10px", background:"white", fontFamily: "Montserrat"}}>
              <Row style={{marginTop:'10px', marginLeft: '10px', justifyContent:'center', alignItems:'center', margintTop: '20px'}}>
                <Col span={10} >
              <div style={{marginLeft:'10px', marginTop:'15px'}} >
              <Avatar src={imgData||`http://localhost:8080/avatar/${avatar}`}  size={128} icon={<UserOutlined />} />
              <label for="file_input_id" style={{marginLeft: '20px'}}>Upload Photo</label>
              <input type="file" id="file_input_id" accept="image/*" onChange={async e => {
                const file = e.target.files[0]
                setFile(file)
                const reader = new FileReader();
                reader.addEventListener("load", () => {
                  setImgData(reader.result);
                });
                reader.readAsDataURL(file)
                const data = new FormData()
                data.append("user", userObj.USER._id )
                data.append("file", file)
                let result = await onUploadAvatar(data)
                console.log(result)
                localStorage.setItem("avatarFilename", result.data.user.avatarFilename)
                alert(result.data.message)  
              }
            }
              ></input>
              </div>
              </Col>
              <Col span={14}>
                <div style={{justifyContent:'center', display:'grid', alignItems:'center'}}>
                <Title style={{margin: '0px'}} level={3}>{userObj.USER.name}</Title>
                <p style={{margin: '0px'}}>{userObj.USER.title}</p>
                <p style={{margin: '0px'}}>{userObj.USER.project}</p>
                <p style={{margin: '0px'}}>{userObj.USER.email}</p>
                </div>
                </Col>
              </Row>
            </div>
            <ChangePassword/>
        </Row>
      </div>
        </Content>
        
      </Layout>      
      </Layout>
    </div>
    )
    

}

export default Account
