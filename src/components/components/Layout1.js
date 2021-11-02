import React from 'react';
import { Layout } from 'antd'
import '../../styles/CSS/Userdash.css'
import Sidebar from './Sidebar'
import ManagerSidebar from './ManagerSidebar'
import DirectorSidebar from './DirectorSidebar'
import HeaderManager from './HeaderManager'
import Headers from './Header'
import MobileHeader from './MobileHeader';
import { useSelector } from 'react-redux';
import ManagerHeaderMobile from './ManagerHeaderMobile';
import DirectorHeaderMobile from './DirectorHeaderMobile';



const { Header, Content, Sider } = Layout;


const Layout1 = ({children}) => {
  let userObj = useSelector(state => state.user)
return (
  <div>
    <Layout style={{height: '100%', minHeight: '100vh'}} > 
        <Sider  className="sidebar" >
       { userObj.USER.category === "user" ? <Sidebar/> : userObj.USER.category === "manager" ? <ManagerSidebar/>  : <DirectorSidebar/>}
        </Sider>
      <Layout >
        <Header className="header">
        { userObj.USER.category === "user" ? <Headers/> : <HeaderManager/> }
        </Header>
        <div className="mobile-header">
        {userObj.USER.category === "user" ? <MobileHeader/> : userObj.USER.category === "manager"? <ManagerHeaderMobile/> : <DirectorHeaderMobile/>}
        </div>
      <Content style={{height: '100%', width: '100%', background:'#f2f2f2' }} > 
      {children}         
      </Content> 
      </Layout>      
    </Layout>
  </div>
    )
}

export default Layout1
