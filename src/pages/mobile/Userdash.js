import logo from '/Users/user/vrms/vrms_frontend/src/components/images/logo.png'
import { Tabs, Card, WingBlank, WhiteSpace,NavBar} from 'antd-mobile';
import 'antd-mobile/dist/antd-mobile.css';
import '/Users/user/vrms/vrms_frontend/src/styles/CSS/Account.css'
import {BookFilled} from '@ant-design/icons';
import { Layout,Button,Typography, Progress, Spin} from 'antd'
import React, {useState, useEffect, useMemo} from 'react';
import { useHistory } from 'react-router-dom';
import Account from './Account';
import { useSelector, useDispatch } from 'react-redux';
import { onGetStudyForUser } from '../../services/studyAPI';
import moment from 'moment';

const { Header, Content} = Layout;

const Userdash = () => {
  const dispatch = useDispatch()
    let history= useHistory();
    const { Title } = Typography;

    const userObj = useSelector(state => state.user)
    const [studyData, setStudyData]= useState([])
    const [loading, setLoading] =useState(true)

  async function getStudies(){
    console.log(userObj.USER)
    setLoading(true)
    let result = await onGetStudyForUser(userObj.USER)
   
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
  setLoading(false) 
  }

  const finaldata = useMemo(() => studyData, [studyData])
    
  useEffect(async () => {
    getStudies()

}, [userObj.USER])

    const tabs = [
        { title: 'Research', sub: '1' },
        { title: 'Account', sub: '2' },
      ];


    return (
        
        <Layout>
          <NavBar mode="light" >
            <img src={logo} style={{height: '40px', width: '40px'}}></img>
            <h1 style={{ fontWeight: "bolder", fontSize:'14px'}}>Virtual Research Management System</h1>
          </NavBar> 
          <Content style={{display:'flex', flexDirection:'row', justifyContent:'center'}}>
            <Tabs tabs={tabs} initialPage={0} tabBarPosition="bottom" renderTab={tab => <span>{tab.title}</span>}>
            {loading ?  <Spin style={{display: 'flex', justifyContent:'center', padding: '25%'}} /> : <div style={{ display: 'grid', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f2f2f2', padding:'20px', borderRadius: '5px' }} >
              {finaldata.map(study => (
                        <WingBlank size="lg">
                        <WhiteSpace size="lg" />
                        <Card>
                          <Card.Header
                            title={study.title}
                            thumb={<BookFilled/>}
                            extra={<Button onClick={() => {
                              dispatch({
                                type: "SET_STUDY",
                                value: study
                             }) 
                             history.push('/datagrid')
                            }} style={{background: "#A0BF85", borderRadius: "5px"}}>MANAGE</Button>}
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
                   </div> }
                <Account/>
            </Tabs>
          </Content>
        </Layout>
      
    )
}

export default Userdash
