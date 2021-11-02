import React from 'react';
import Label from './Label'
import DataGrid from './DataGrid'
import { Col, Layout, Row, Typography, Tabs} from 'antd'
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
import StudyGallery from './StudyGallery';
import DirectorSidebar from '../components/components/DirectorSidebar';


const { Title } = Typography;
const { TabPane } = Tabs;

const StudyDash = () => {
    const { Header, Content, Sider } = Layout;
    const userObj = useSelector(state => state.user)

    return (
      <div>
        <div className="study-dash">
            <Layout style={{height: '100%', minHeight: '100vh'}} >
            <Sider className='sidebar' >
                    {userObj.USER.category === "user"? <Sidebar/> : userObj.USER.category === "manager"? <SidebarManager/> : <DirectorSidebar/>}
                </Sider>
               <Layout style={{width: '100%', marginLeft: '10px'}}>
                <Header className="header"  >
                        <Headers/>
                </Header>
                <div className="mobile-header">
                    {userObj.USER.category === "user" ? <MobileHeader/> : <ManagerHeaderMobile/> }
                </div>
                    <Content style={{height: '100%', width:'100%'}}>
                        <Label/>
                        <div className="card-container">
                        <Tabs type='card'>
                            <TabPane style={{height:'90vh'}} tab="Documentation" key="1">
                                <Documentation/>
                            </TabPane>
                            <TabPane style={{height:'90vh'}} tab="Tasks" key="2">
                                <Tasks/>
                            </TabPane>
                            <TabPane style={{height:'90vh'}} tab="Gallery" key="3">
                                <StudyGallery/>
                            </TabPane>
                            <TabPane style={{height:'90vh'}} tab="Data" key="4">
                                <DataGrid/>
                            </TabPane>
                        </Tabs>
                        </div>
                    </Content>
               </Layout>
            </Layout>
        </div>
        <Mobiledash/>
        </div>
    )
}

export default StudyDash
