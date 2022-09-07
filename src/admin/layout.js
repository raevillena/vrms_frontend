import { Layout, Menu } from 'antd';
import {useHistory} from 'react-router-dom'
import { useDispatch } from 'react-redux';
import { onUserLogout } from '../services/authAPI';
import '../styles/CSS/Layout.css'

const { Header, Content } = Layout;

const LayoutComponent = ({children}) => {
    let history= useHistory();
    const dispatch = useDispatch();

    const click = async (key) => {
        history.push(`${key.key}`)
    }

    const handleLogout = async () => { 
        try {
          const tokens = {
            refreshToken: localStorage.getItem("refreshToken"),
            accessToken: localStorage.getItem("accessToken")
          }
          //there should also be logout loading dispatch here for reference of notifications
          //user must be at least when logout is successful
          onUserLogout(tokens)
          dispatch({
            type: "LOGOUT_SUCCESS",
            value: false
         })
          history.push('/login')
        } catch (error) {
          console.error(error)
          alert(error.response.data.error);
        }
      };

    return (
        <div>
        <Layout>
            <Header className="header">
            <div className="logo" />
            <Menu className='header-menu' mode="horizontal" defaultSelectedKeys={['1']}>
                <Menu.Item key="/" onClick={click}>Create</Menu.Item>
                <Menu.Item key="/admin/users" onClick={click}>Users</Menu.Item>
                <Menu.Item key="/admin/programs" onClick={click}>Programs</Menu.Item>
                <Menu.Item key="/admin/projects" onClick={click}>Projects</Menu.Item>
                <Menu.Item key="/admin/studies" onClick={click}>Studies</Menu.Item>
                <Menu.Item key="/admin/tasks" onClick={click}>Tasks</Menu.Item>
                <Menu.Item key="/admin/datagrids" onClick={click}>Datagrids</Menu.Item>
                <Menu.Item key="/admin/backup" onClick={click}>Backup</Menu.Item>
                <Menu.Item key="/admin/files" onClick={click}>Files</Menu.Item>
                <Menu.Item key="/login" onClick={handleLogout}>Logout</Menu.Item>
            </Menu>
            </Header>
            <Layout>
            <Layout style={{ padding: '0 24px 24px' }}>
                <Content
                className="site-layout-background"
                style={{
                    padding: 24,
                    margin: 0,
                    minHeight: '100vh',
                }}
                >
                {children}
                </Content>
            </Layout>
            </Layout>
        </Layout>
        </div>
    )
}

export default LayoutComponent
