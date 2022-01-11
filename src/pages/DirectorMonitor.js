import React, {useEffect, useState} from 'react'
import { Row, Col, Card, Table, Button, Tag, Input, Space, Modal } from 'antd'
import '../styles/CSS/Userdash.css'
import { FileTextFilled, ProjectFilled, FileFilled, UserOutlined, SearchOutlined} from '@ant-design/icons';
import { onGetAllPrograms, onGetAllProject } from '../services/projectAPI';
import { onGetAllStudy } from '../services/studyAPI';
import { onGetAllUser } from '../services/userAPI';
import Productivity from './Productivity'
import Highlighter from 'react-highlight-words';
import IndividualPerformance from './IndividualPerformance'
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash'
import ManagerMonitor from './ManagerMonitor'
import Layout1 from '../components/components/Layout1';


const { Meta } = Card

const DirectorMonitor = () => {
  const dispatch = useDispatch()
  let userObj = useSelector(state => state.user)

   const [state, setstate] = useState({'programs': '', 'project': '', 'study': '', 'user': ''})
   const [data, setData] = useState()
   const [search, setSearch] = useState({searchText: '', searchedColumn:''})
   const [loading, setLoading] = useState(true)
   const [isModalVisible, setIsModalVisible] = useState(false);

    useEffect(() => {
        async function getProgram(){
            let program = await onGetAllPrograms()
            let project = await onGetAllProject()
            let study = await onGetAllStudy()
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
            let filteredData =  _.filter(tempUser, function(item) { return item.category[0] !== 'director' })
            let filteredprogram =  _.filter(program.data, function(item) { return item.active !== 'true' })
            let filteredproject =  _.filter(project.data, function(item) { return item.active !== 'true' })
            let filteredstudy =  _.filter(study.data, function(item) { return item.active !== 'true' })
            console.log(filteredData)
            setData(filteredData)
            setstate({...state, programs: filteredprogram.length, project: filteredproject.length, study: filteredstudy.length, user: filteredData.length})
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

    const getColumnSearchProps = dataIndex => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
          <div style={{ padding: 8 }}>
            <Input
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
          {userObj.USER.category === 'manager' ? <ManagerMonitor/>: 
            <Layout1>
                    <Row justify="space-around">
                        <Col  span={23}>
                            <Card style={{borderRadius:'10px'}} hoverable loading={loading} title='Year Productivity'>
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
                                <Meta style={{color: '#FFFFFF'}} title={state.user} description='Total Researcher' avatar={<UserOutlined style={{fontSize: '45px'}}/>}/>
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
          </Layout1>}
        </div>
    )
}

export default DirectorMonitor
