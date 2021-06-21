import React, {useState, useEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Layout, Menu, Button, Table, Row, Col,Progress, Tag } from 'antd'
import logo from '../components/images/logo.png'
import '../styles/CSS/Userdash.css'
import { BookOutlined, UserOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router-dom';

import Sidebar from '../components/components/Sidebar'

const { Header, Content, Sider } = Layout;


const Userdash = () => {


  let history= useHistory();
  const dispatch = useDispatch();


  const handleLogout = async () => {
    try {

      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      dispatch({
        type: "VERIFIED_AUTHENTICATION",
        value: false
     })
      history.push('/')
    } catch (error) {
      console.error(error)
      alert(error.response.data.error);
    }
  };

  const dataSource = [
    {
      key: '1',
      title: 'Try lang title 1',
      studyno: 32,
      date: 'May 31,2021 10:00 AM',
      updated: 'May 31,2021 10:00 AM',
      progress: 30,
      status: ['Completed'],
      action: 'Manage'
    },
    {
      key: '2',
      title: 'ATry lang title 1',
      studyno: 31,
      date: 'May 31,2021 10:00 AM',
      updated: 'May 31,2021 10:00 AM',
      progress: 80,
      status: ['Ongoing'],
      action: 'Manage'
    },
  ];
  
  const columns = [
    {
      title: 'Study No.',
      dataIndex: 'studyno',
      key: 'study no',
      width: '10%',
    },
    {
      title: 'Date Created',
      dataIndex: 'date',
      key: 'date',
      sorter: true,
      width: '15%',
    },
    {
      title: 'Updated',
      dataIndex: 'updated',
      key: 'updated',
      sorter: true,
      width: '15%',
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      sorter: true,
      width: '25%',
    },
    {
      title: 'Progress',
      dataIndex: 'progress',
      key: 'progress',
      width: '10%',
      render: () =>
       <Progress percent={80} size="small" />,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      filters: [
        { text: 'Completed', value: 'Completed' },
        { text: 'Ongoing', value: 'Ongoing' },
      ],
      width: '10%',
      render: stat => (
        <span>
          {stat.map(status => {
            let color = status === 'Ongoing' ? 'geekblue' : 'green';
            return (
              <Tag color={color} key={status}>
                {status.toUpperCase()}
              </Tag>
            );
          })}
        </span>
      ),
  

    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      width: '15%',
      render: () => <Button className="manageBtn">MANAGE</Button>
    },
  ];
  
    return (
      
    <Layout  > 
      <Sider  style={{
        overflow: 'auto',
        height: '100vh',
        position: 'fixed',
        left: 0,
        backgroud: 'white'
      }} >
         <Sidebar></Sidebar>
      </Sider>
    <Layout style={{ marginLeft: 200 }}>
      <Header style={{ padding: 0, background:'#f2f2f2' }} >
      <a href="/dash" style={{padding: '25px', fontSize: '24px', color: 'black', fontFamily: 'Montserrat'}}>Studies</a>
        <a  onClick={handleLogout}  tyle={{float: 'right', color:'black', fontFamily: 'Montserrat'}}>Logout</a>
      </Header>
      <Content style={{ margin: '24px 16px 0', overflow: 'initial' }} >          
        <Table size="small" dataSource={dataSource} columns={columns}></Table>
      </Content>
      
    </Layout>      
</Layout>

    )
}

export default Userdash
