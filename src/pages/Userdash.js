import { Layout, Menu, Button, Table, Row, Col,Progress, Tag } from 'antd'
import logo from '../components/images/logo.png'
import '../styles/CSS/Userdash.css'
import { BookOutlined, UserOutlined } from '@ant-design/icons';
import React, {useState, useEffect} from 'react';
import { useHistory } from 'react-router-dom';


const { Header, Content, Footer, Sider } = Layout;


const Userdash = () => {
  let history= useHistory();
  const Logout = () =>{
    history.push('/')
  }

  const dataSource = [
    {
      key: '1',
      title: 'Try lang title 1',
      studyno: 32,
      date: 'May 31,2021 10:00 AM',
      updated: 'May 31,2021 10:00 AM',
      progress: 30,
      status: 'Completed',
      action: 'Manage'
    },
    {
      key: '2',
      title: 'ATry lang title 1',
      studyno: 31,
      date: 'May 31,2021 10:00 AM',
      updated: 'May 31,2021 10:00 AM',
      progress: 30,
      status: 'Ongoing',
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
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      width: '15%',
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
        <Header className="header">Studies<Button type="link" onClick={Logout}>Logout</Button></Header>
        <Content className="content">
      <Table size="small" dataSource={dataSource} columns={columns}></Table>
    </Content>
        </Col>
    
    
</Layout>
    )
}

export default Userdash
