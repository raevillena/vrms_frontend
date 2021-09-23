import React from 'react';
import Label from './Label'
import DataGrid from './DataGrid'
import { Col, Layout, Row, Typography} from 'antd'
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
            <Layout >
            <Sider className='sidebar' >
                    {userObj.USER.category === "user"? <Sidebar/> : <SidebarManager/>}
                </Sider>
               <Layout style={{width: '100%', marginLeft: '10px'}}>
                <Header className="header"  >
                        <Headers/>
                </Header>
                <div className="mobile-header">
                    {userObj.USER.category === "user" ? <MobileHeader/> : <ManagerHeaderMobile/>}
                </div>
                    <Content style={{height: '100%', width:'100%'}}>
                        <Label/>
                        <Row gutter={16} style={{ width: '100%'}}>
                            <Col span={12}>
                                <Documentation/>
                            </Col>
                            <Col span={12}>
                                <Title level={2}>Tasks</Title>
                                <Tasks/>
                            </Col>
                           
                        </Row>
                        <Row gutter={16} style={{ width: '100%'}}>
                            <Col>
                                <DataGrid/>
                            </Col>
                        </Row>
                    </Content>
               </Layout>
            </Layout>
        </div>
        <Mobiledash/>
        </div>
    )
}

export default StudyDash
