import React, {useEffect, useState} from 'react'
import { Layout, Row, Col, Card, Table, Button, Tag, Input, Space, Modal } from 'antd'
import Sidebar from '../components/components/DirectorSidebar'
import Headers from '../components/components/HeaderManager'
import MobileHeader from '../components/components/MobileHeader';
import '../styles/CSS/Userdash.css'
import { FileTextFilled, ProjectFilled, FileFilled, UserOutlined, SearchOutlined} from '@ant-design/icons';
import { onGetProgramforManager, onGetAllProjectMonitor } from '../services/projectAPI';
import {onGetAllStudyMonitor} from '../services/studyAPI'
import { onGetAllUser } from '../services/userAPI';
import Productivity from './Productivity'
import Highlighter from 'react-highlight-words';
import IndividualPerformance from './IndividualPerformance'
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash'


const { Header, Content, Sider } = Layout;
const { Meta } = Card

const ManagerMonitor = () => {
  const dispatch = useDispatch()
  let userObj = useSelector(state => state.user)

   const [state, setstate] = useState({'programs': '', 'project': '', 'study': '', 'user': ''})
   const [data, setData] = useState()
   const [search, setSearch] = useState({searchText: '', searchedColumn:''})
   const [loading, setLoading] = useState(true)
   const [isModalVisible, setIsModalVisible] = useState(false);

    useEffect(() => {
        async function getProgram(){
            let program = await onGetProgramforManager({user: userObj.USER._id})
            let project = await onGetAllProjectMonitor(userObj.USER._id)
            let study = await onGetAllStudyMonitor(userObj.USER._id)
            let user = await onGetAllUser()
            let userData = user.data
            let tempUser = []
            for (let i = 0; i < userData.length; i++) {
                tempUser.push({
                    key: userData[i]._id,
                    name: userData[i].name,
                    title: userData[i].title,
                    category: [userData[i].category]
                })
            }
            let filteredData =  _.filter(tempUser, function(item) { return item.category[0] !== 'director'})
            let filteredData1 =  _.filter(filteredData, function(item) { return item.category[0] !== 'manager'})
            setData(filteredData1)
            setstate({...state, programs: program.data.length, project: project.data.length, study: study.data.length, user: filteredData1.length})
            setLoading(false)
        }
        getProgram()
    }, [])
        const showModal = () => {
          setIsModalVisible(true)
        }
      const handleCancel = () => {
        setIsModalVisible(false);
      };

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearch({
          searchText: selectedKeys[0],
          searchedColumn: dataIndex,
        });
      };
    
    const handleReset = clearFilters => {
        clearFilters();
        setSearch({...search, searchText: '' });
      };
      let searchInput = ''

    const getColumnSearchProps = dataIndex => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
          <div style={{ padding: 8 }}>
            <Input
              ref={node => {
                searchInput = node;
              }}
              placeholder={`Search ${dataIndex}`}
              value={selectedKeys[0]}
              onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
              onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
              style={{ marginBottom: 8, display: 'block' }}
              id='searchInput'
            />
            <Space>
              <Button
                type="primary"
                onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                icon={<SearchOutlined />}
                size="small"
                style={{ width: 90 }}
              >
                Search
              </Button>
              <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
                Reset
              </Button>
              <Button
                type="link"
                size="small"
                onClick={() => {
                  confirm({ closeDropdown: false });
                  setSearch({
                    searchText: selectedKeys[0],
                    searchedColumn: dataIndex,
                  });
                }}
              >
                Filter
              </Button>
            </Space>
          </div>
        ),
        filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
        onFilter: (value, record) =>
          record[dataIndex]
            ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
            : '',
       
        render: text =>
          search.searchedColumn === dataIndex ? (
            <Highlighter
              highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
              searchWords={[search.searchText]}
              autoEscape
              textToHighlight={text ? text.toString() : ''}
            />
          ) : (
            text
          ),
      });
    


    const columns = [
        {
          title: 'Name',
          dataIndex: 'name',
          key: 'name',
          ...getColumnSearchProps('name')
        },
        {
          title: 'Job Title',
          dataIndex: 'title',
          key: 'title',
        },
        {
          title: 'Category',
          dataIndex: 'category',
          key: 'category',
          filters: [
            { text: 'User', value: 'user' },
            { text: 'Manager', value: 'manager' },
            { text: 'Director', value: 'director' }
          ],
          onFilter: (value, record) => record.category.indexOf(value) === 0,
          render: category => (
            <span>
              {category.map(cat => {
                let color = cat === 'user' ? 'geekblue' : 'green';
                return (
                  <Tag color={color} key={cat}>
                    {cat.toUpperCase()}
                  </Tag>
                );
              })}
            </span>
          )
        },
        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
            fixed: 'right',
            width: '15%',
            render: (text, record, index) => 
            <Button type='link' onClick={ () => {
                  dispatch({
                    type: "SET_MONITOR",
                    value: record
                })
                showModal()
            }}>
                View
            </Button>
          },
      ];

    return (
        <div>
            <Layout style={{height: '100%', minHeight: '150vh'}} > 
                <Sider  className="sidebar" >
                    <Sidebar/>
                </Sider>
                <Layout >
                <Header className="header">
                    <Headers/>
                </Header>
                <div className="mobile-header">
                    <MobileHeader/>
                </div>
                <Content style={{height: '100%', width: '100%', background:'#f2f2f2' }} > 
                  <Row justify="space-around">
                        <Col  span={23}>
                            <Card style={{borderRadius:'10px'}} hoverable loading={loading} title='Created Task Productivity'>
                                <Productivity/>
                            </Card>
                        </Col>   
                  </Row>
                  <Row justify="space-around">
                        <Col span={5}>
                            <Card style={{borderRadius: '10px', background: '#7CAD4F', fontStyle: 'Montserrat', marginTop: 16}} size='small' hoverable loading={loading}>
                                <Meta style={{color: '#FFFFFF'}} title={state.programs} description='Total Programs' avatar={<FileTextFilled style={{fontSize: '45px'}}/>}/>
                            </Card>
                        </Col>
                        <Col span={5}>
                            <Card style={{borderRadius: '10px', background: '#A0BF85', fontStyle: 'Montserrat', marginTop: 16}} size='small' hoverable loading={loading}>
                                <Meta style={{color: '#FFFFFF'}} title={state.project} description='Total Projects' avatar={<ProjectFilled style={{fontSize: '45px'}}/>}/>
                            </Card>
                        </Col>
                        <Col span={5}>
                            <Card style={{borderRadius: '10px', background: '#8EAA75', fontStyle: 'Montserrat', marginTop: 16}} size='small' hoverable loading={loading}>
                                <Meta style={{color: '#FFFFFF'}} title={state.study} description='Total Studies' avatar={<FileFilled style={{fontSize: '45px'}}/>}/>
                            </Card>
                        </Col>
                        <Col span={5}>
                            <Card style={{borderRadius: '10px', background: '#8BBE5E', fontStyle: 'Montserrat', marginTop: 16}} size='small' hoverable loading={loading}>
                                <Meta style={{color: '#FFFFFF'}} title={state.user} description='Total Researchers' avatar={<UserOutlined style={{fontSize: '45px'}}/>}/>
                            </Card>
                        </Col>
                  </Row>
                  <Row justify='space-around'>
                        <Col span={23}>
                            <Card style={{borderRadius:'10px', marginTop: 16}} hoverable loading={loading}>
                                <Table dataSource={data} size='small' columns={columns} />
                            </Card>
                        </Col>
                  </Row>
                  {isModalVisible === true ? <Modal title="Individual Performance" visible={true} footer={null} onCancel={handleCancel} width={1500}>
                      <Row justify="space-around">
                          <Col  span={23}>
                            <IndividualPerformance/>
                          </Col>   
                      </Row>
                    </Modal>: null}
                </Content> 
                </Layout>      
            </Layout>
        </div>
    )
}

export default ManagerMonitor
