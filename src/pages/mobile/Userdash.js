import logo from '/Users/user/vrms/vrms_frontend/src/components/images/logo.png'
import { Tabs, Card, WingBlank, WhiteSpace} from 'antd-mobile';
import 'antd-mobile/dist/antd-mobile.css';
import '/Users/user/vrms/vrms_frontend/src/styles/CSS/Account.css'
import {BookFilled} from '@ant-design/icons';
import { Layout,Button,Typography, Progress, Spin} from 'antd'
import React, {useState, useEffect} from 'react';
import { useHistory } from 'react-router-dom';
import Account from './Account';
import {useSelector } from 'react-redux';
import { onGetStudyForUser } from '../../services/studyAPI';
import moment from 'moment';

const { Header, Content} = Layout;

const Userdash = () => {
    let history= useHistory();
    const { Title } = Typography;

    const userObj = useSelector(state => state.user)
    const [studyData, setStudyData]= useState([])
    const [loading, setLoading] =useState(false)

  async function getStudies(){
    console.log(userObj.USER)
    let result = await onGetStudyForUser(userObj.USER)
    setLoading(true)
    let x = result.data
    let tempStudyData = []
    for(let i = 0; i < x.length; i++){ 
      tempStudyData.push({
          key: x[i],
          title: x[i].studyTitle,
          studyID: x[i].studyID,
          dateCreated: moment(x[i].dateCreated).format('MM-DD-YYYY'),
          dateUpdated: moment(x[i].dateUpdated).format('MM-DD-YYYY'),
          progress: x[i].progress,
          status: [x[i].status]
      });
  }
  setStudyData(tempStudyData)
  }
    
  useEffect(async () => {
    async function getData() {
        getStudies()
    }
    setLoading(false)
    await getData()
    
}, [])

  
 
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
            <h1 style={{ fontWeight: "bolder", fontSize:'100%'}}>Virtual Research Management System</h1>
          </Header>
          <Content style={{display:'flex', flexDirection:'row', justifyContent:'center'}}>
            <Tabs tabs={tabs} initialPage={0} tabBarPosition="bottom" renderTab={tab => <span>{tab.title}</span>}>
            {loading ? <div style={{ display: 'grid', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f2f2f2', padding:'20px', borderRadius: '5px' }} >
              {studyData.map(study => (
                        <WingBlank size="lg">
                        <WhiteSpace size="lg" />
                        <Card>
                          <Card.Header
                            title={study.title}
                            thumb={<BookFilled/>}
                            extra={<Button onClick={manage} style={{background: "#A0BF85", borderRadius: "5px"}}>MANAGE</Button>}
                          />
                          <Card.Body>
                            <div>
                              <div> Study ID: {study.studyID}</div>
                              <div style={{maxWidth: '50%'}}>
                              <Progress percent={study.progress}/>
                              </div>
                            </div>
                          </Card.Body>
                          <Card.Footer content={<div>Date Created: {study.dateCreated}</div>} extra={<div>Date Updated: {study.dateUpdated}</div>} />
                        </Card>
                        <WhiteSpace size="lg" />
                      </WingBlank>
                        ))}
                   </div> : <Spin style={{display: 'flex', justifyContent:'center', padding: '25%'}} />}
                <Account/>
            </Tabs>
          </Content>
        </Layout>
      
    )
}

export default Userdash
