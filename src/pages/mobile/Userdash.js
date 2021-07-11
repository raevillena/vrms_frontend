import logo from '/Users/user/vrms/vrms_frontend/src/components/images/logo.png'
import { Tabs} from 'antd-mobile';
import 'antd-mobile/dist/antd-mobile.css';
import '/Users/user/vrms/vrms_frontend/src/styles/CSS/Account.css'
import {BookFilled} from '@ant-design/icons';
import { Layout,Button, Row, Col, Typography, Progress, Spin} from 'antd'
import React from 'react';
import { useHistory } from 'react-router-dom';
import Account from './Account';

const { Header, Content} = Layout;

const Userdash = () => {
    let history= useHistory();
    const { Title } = Typography;
  
 
    const tabs = [
        { title: 'Research', sub: '1' },
        { title: 'Account', sub: '2' },
      ];

    const manage = async ()=>{
        try {
          history.push('/datagrid')
        } catch (error) {
          console.log(error)
        }
      }

    

    return (
        
        <Layout>
          <Header style={{background: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <img src={logo} className="logo" style={{left:'0px', top:'2.5px', height:'60px', width:'60px', marginLeft:'2.5px'}}></img>
            <h1 style={{fontFamily: "Bangla MN", fontWeight: "bolder", fontSize:'100%'}}>Virtual Research Management System</h1>
          </Header>
          <Content style={{display:'flex', flexDirection:'row', justifyContent:'center'}}>
            <Tabs tabs={tabs} initialPage={1} tabBarPosition="bottom" renderTab={tab => <span>{tab.title}</span>}>
            <div style={{ display: 'grid', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f2f2f2', padding:'20px', fontFamily: "Montserrat", borderRadius: '5px' }} >
            
              <div style={{background: '#FFFFFF', borderRadius:'5px', padding: '10px'}}>
              <Row>
                  <Col xs={{span: 12}}>
                  <BookFilled style={{fontSize:'100px', display: 'flex', alignItems: 'center', justifyContent:'center', marginTop: '50px'}} />
                  </Col>
                  <Col xs={{span: 12}}>
                  <Title level={3}>Lorem Ipsum dolot</Title>
                  <p>00000001</p>
                  <p><label>Date Created:</label> July 01, 2021</p>
                  <p><label>Date Updated:</label> July 01, 2021</p>
                  <Progress percent={80} size="small" />
                  <Button style={{float: 'right',  background: '#A0BF85', borderRadius:'5px'}} onClick={manage}>Manage</Button>
                  </Col>
                  </Row>
                </div>
                <div style={{background: '#FFFFFF', borderRadius:'5px', padding: '10px'}}>
              <Row>
                  <Col xs={{span: 12}}>
                    <BookFilled style={{fontSize:'100px', display: 'flex', alignItems: 'center', justifyContent:'center', marginTop: '50px'}} />
                  </Col>
                  <Col xs={{span: 12}}>
                  <Title level={3}>Lorem Ipsum dolot</Title>
                  <p>00000001</p>
                  <p><label>Date Created:</label> July 01, 2021</p>
                  <p><label>Date Updated:</label> July 01, 2021</p>
                  <Progress percent={30} size="small" />
                  <Button style={{float: 'right',  background: '#A0BF85', borderRadius:'5px', bottom: '0px'}} onClick={manage}>Manage</Button>
                  </Col>
                  </Row>
                </div>
            </div>

              
               
                <Account/>
                
              
            </Tabs>
          </Content>
        </Layout>
      
    )
}

export default Userdash
