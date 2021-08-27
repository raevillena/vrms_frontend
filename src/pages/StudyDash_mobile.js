import React, {useState, useEffect} from 'react';
import Label from './Label'
import DataGrid from './DataGrid'
import { Layout, Row,Col, Typography} from 'antd'
import Sidebar from '../components/components/Sidebar'
import Headers from '../components/components/Header'
import Tasks from './DisplayTasks'
import Documentation from './Documentation'
import MobileHeader from '../components/components/MobileHeader';
import '../styles/CSS/Userdash.css'



const { Title } = Typography;

const StudyDash_Mobile = () => {
    const { Header, Content, Sider } = Layout;

    return (
        <div className="mobile-study-dash">
            <Layout>
            <Sider className='sidebar' >
                    <Sidebar/>
                </Sider>
               <Layout >
                <Header className="header" style={{ padding: 0, background:'#f2f2f2' }} >
                        <Headers/>
                </Header>
                <div className="mobile-header">
                    <MobileHeader/>
                </div>
                    <Content className="content-mobile" style={{ margin: '24px 16px 0', overflow: 'initial' , minHeight: "100vh"}}>
                        <Label/>
                        <div className="content-mobile">
                            <Documentation/>
                            <Title level={2}>Tasks</Title>
                            <Tasks/>
                            </div>
                        <DataGrid/>
                    </Content>
               </Layout>
            </Layout>
            
        </div>
    )
}

export default StudyDash_Mobile
