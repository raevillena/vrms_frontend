import React from 'react'
import Label from './Label'
import DataGrid from './DataGrid'
import { Layout, Row,Col} from 'antd'
import Sidebar from '../components/components/Sidebar'
import Headers from '../components/components/Header'
import Tasks from './DisplayTasks'
import Documentation from './Documentation'



const StudyDash = () => {
    const { Header, Content, Sider } = Layout;


    return (
        <div>
            <Layout>
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
                    <Content style={{ margin: '24px 16px 0', overflow: 'initial' , minHeight: "100vh"}}>
                        <Label/>
                        <Row gutter={16}>
                            <Col span={12}><Documentation/></Col>
                            <Col span={12} style={{overflowY: 'scroll', height: '740px'}}> <Tasks/></Col>
                        </Row>
                        <DataGrid/>
                    </Content>
               </Layout>
            </Layout>
        </div>
    )
}

export default StudyDash
