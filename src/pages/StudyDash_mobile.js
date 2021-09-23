import React from 'react';
import Label from './Label'
import DataGrid from './DataGrid'
import { Layout, Typography} from 'antd'
import Sidebar from '../components/components/Sidebar'
import Headers from '../components/components/Header'
import Tasks from './DisplayTasks'
import Documentation from './Documentation'
import MobileHeader from '../components/components/MobileHeader';
import '../styles/CSS/Userdash.css'
import ManagerHeaderMobile from '../components/components/ManagerHeaderMobile';
import { useSelector } from 'react-redux';



const { Title } = Typography;

const StudyDash_Mobile = () => {
    const { Header, Content, Sider } = Layout;

    const userObj = useSelector(state => state.user)

    return (
        <div className="mobile-study-dash">
            <Layout>
            <Sider className='sidebar' >
                    <Sidebar/>
                </Sider>
               <Layout >
                <Header className="header"  >
                        <Headers/>
                </Header>
                <div className="mobile-header">
                {userObj.USER.category === "user" ? <MobileHeader/> : <ManagerHeaderMobile/>}
                </div>
                    <Content style={{width: '100%', background: '#f2f2f2', height: '100%'}}>
                        <Label/>
                        <div style={{marginTop: '5px',marginLeft:'10px', marginRight: '10px'}}>
                            <Documentation/>
                            <Title level={2}>Tasks</Title>
                            <Tasks/>
                            <DataGrid/>
                        </div>
                    </Content>
               </Layout>
            </Layout>
            
        </div>
    )
}

export default StudyDash_Mobile
