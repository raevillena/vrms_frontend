import { Layout, Menu, Button, Table, Row, Col,Progress, Tag } from 'antd'
import logo from '../components/images/logo.png'
import '../styles/CSS/Userdash.css'
import { BookOutlined, UserOutlined } from '@ant-design/icons';
import React, {useState, useEffect} from 'react';
import { useHistory } from 'react-router-dom';
import { verifyToken } from '../services/authAPI';
import axios from 'axios'
import {verifyAuth } from '@services/authAPI';

const { Header, Content, Sider } = Layout;


const Userdash = () => {


  let history= useHistory();

 


  // axios
  // .post('/v1/auth/dash', 'secretKey', {
  //   headers:{
  //     Authorization : `Bearer ${accessToken}`,
  //     'Content-Type': 'application/json',
  // }})
  // .then(res => {
  //   console.log()
  // })
  const handleLogout = async () => {
    try {
      let refreshToken = localStorage.getItem("refreshToken");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      window.location.reload();
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
    <Layout >
      <Row>
        
    <Col span={6}>
    <Sider className="sidebar">
        <img src={logo} className="logo"></img>
        <Menu defaultSelectedKeys={['1']}>
        <Menu.Item key="1" icon={<BookOutlined />} className="menu1">
          Research
        </Menu.Item>
        <Menu.Item key="2" icon={<UserOutlined />} className="menu1">
          Account
        </Menu.Item>
        </Menu>
    </Sider>
    </Col>
    </Row>
    <Col span={18}>
        <Header className="header">
          <span></span>
          <a>Studies</a>
          <a href="/" onClick={handleLogout} className="loginBtn">Logout</a>
        </Header>
        <Content className="content">

          
      <Table size="small" dataSource={dataSource} columns={columns}></Table>
    </Content>
        </Col>
    
    
</Layout>
    )
}

export default Userdash
