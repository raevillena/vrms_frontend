import React from 'react';
import Label from './Label'
import DataGrid from './DataGrid'
import { Layout, Row,Col, Typography} from 'antd'
import Sidebar from '../components/components/Sidebar'
import SidebarManager from '../components/components/ManagerSidebar'
import Headers from '../components/components/Header'
import Tasks from './DisplayTasks'
import Documentation from './Documentation'
import MobileHeader from '../components/components/MobileHeader';
import ManagerHeaderMobile from '../components/components/ManagerHeaderMobile';
import '../styles/CSS/Userdash.css'
import Mobiledash from './StudyDash_mobile';
import { useSelector } from 'react-redux';


const { Title } = Typography;

const StudyDash = () => {
    const { Header, Content, Sider } = Layout;
    const userObj = useSelector(state => state.user)

    return (
      <div>
        <div className="study-dash">
            <Layout>
            <Sider className='sidebar' >
                    {userObj.USER.category === "user"? <Sidebar/> : <SidebarManager/>}
                </Sider>
               <Layout >
                <Header className="header" style={{ padding: 0, background:'#f2f2f2' }} >
                        <Headers/>
                </Header>
                <div className="mobile-header">
                    {userObj.USER.category === "user" ? <MobileHeader/> : <ManagerHeaderMobile/>}
                </div>
                    <Content style={{ margin: '24px 16px 0' , minHeight: "100vh"}}>
                        <Label/>
                        <Row gutter={16}>
                            <Col span={12} style={{overflowY: 'scroll'}}><Documentation/></Col>
                            <Col span={12} style={{overflowY: 'scroll', height: '740px'}}>
                                <Title level={2}>Tasks</Title>
                                 <Tasks/>
                            </Col>
                        </Row>
                        <DataGrid/>
                    </Content>
               </Layout>
            </Layout>
        </div>
        <Mobiledash/>
        </div>
    )
}

export default StudyDash
