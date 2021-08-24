import React, {useState, useEffect} from 'react';
import Label from './Label'
import DataGrid from './DataGrid'
import { Layout, Row,Col, Typography} from 'antd'
import Sidebar from '../components/components/Sidebar'
import Headers from '../components/components/Header'
import Tasks from './DisplayTasks'
import Documentation from './Documentation'
import Mobile from '../pages/mobile/StudyDash'


const { Title } = Typography;

const StudyDash = () => {
    const { Header, Content, Sider } = Layout;

//for mobile Ui
  function useWindowSize(){
    const [size, setSize] = useState([window.innerHeight, window.innerWidth]);
    useEffect(() => {
      const handleResize = () => {
        setSize([window.innerHeight, window.innerWidth])
      }
      window.addEventListener("resize", handleResize)
      return() => {
        window.removeEventListener("resize", handleResize)
      }
    }, [])
    return size;
  }

  const [height, width] = useWindowSize();
  if(height <= 768 ||  width <= 768){
    return <Mobile/>
  }


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
    )
}

export default StudyDash
