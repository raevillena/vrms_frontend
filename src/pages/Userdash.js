import React, {useState, useEffect} from 'react';
import { Button, Table,Progress, Tag, Spin, Input, Space } from 'antd'
import '../styles/CSS/Userdash.css'
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { onGetStudyForUser } from '../services/studyAPI';
import moment from 'moment';
import Project from './Project';
import DirectorDash from './DirectorDash';
import Highlighter from 'react-highlight-words';
import {SearchOutlined} from '@ant-design/icons'
import Dashboard from '../admin/dashboard'
import Layout1 from '../components/components/Layout1';


const Userdash = () => {
  const dispatch = useDispatch()
  let history= useHistory();
  let userObj = useSelector(state => state.user)
  const [studyData, setStudyData]= useState()
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState({searchText: '', searchedColumn:''})
 
  
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken")
    const refreshToken = localStorage.getItem("refreshToken")
    async function getStudies(user){
      setLoading(true)
      let result = await onGetStudyForUser(user)
        let x = result.data
      let tempStudyData = []
      for(let i = 0; i < x.length; i++){ 
        tempStudyData.push({
            key: x[i]._id,
            id: [i],
            title: x[i].studyTitle,
            studyID: x[i].studyID,
            dateCreated: moment(x[i].dateCreated).format('MM-DD-YYYY'),
            dateUpdated: moment(x[i].dateUpdated).format('MM-DD-YYYY'),
            progress: x[i].progress,
            status: [x[i].status],
            updatedBy: x[i].updatedBy,
            deadline: x[i].deadline,
            objectives: x[i].objectives,
        });
      }
      setStudyData(tempStudyData)
      setLoading(false) 
    }
    if(accessToken === null || refreshToken === null || userObj.USER === ""){
      return
    }else{
      getStudies(userObj.USER)
    }
}, [])

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
      title: 'Study ID',
      dataIndex: 'id',
      key: 'id',
      width: '5%',
      defaultSortOrder: 'descend',
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: 'Date Created',
      dataIndex: 'dateCreated',
      key: 'dateCreated',
      width: '10%',
      
    },
    {
      title: 'Updated',
      dataIndex: 'dateUpdated',
      key: 'dateUpdated',
      width: '10%',
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      width: '25%',
      ellipsis: true,
      ...getColumnSearchProps('title')
    },
    {
      title: 'Progress',
      dataIndex: 'progress',
      key: 'progress',
      width: '15%',
      render: progress=>
       <Progress percent={progress} size="small" />,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      filters: [
        { text: 'Completed', value: 'COMPLETED' },
        { text: 'Ongoing', value: 'ONGOING' },
      ],
      onFilter: (value, record) => record.status.indexOf(value) === 0,
      width: '15%',
      render: status => (
        <span>
          {status.map(stat => {
            let color = stat === 'Ongoing' ? 'geekblue' : 'green';
            return (
              <Tag color={color} key={stat}>
                {stat.toUpperCase()}
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
      fixed: 'right',
      width: '15%',
      render: (text, record, index) => <Button onClick = {
        (e) => {
          dispatch({
            type: "SET_STUDY",
            value: record
         })
         history.push('/editstudy')
        }
      } type='link'>MANAGE</Button>
    },
  ];
  
return (
  <div>
    {userObj.USER.category === "user"? 
        <Layout1>  
          {loading ?  <Spin className="spinner" /> : 
           <div > 
            <Table size="small" scroll={{ x: 1500, y: 500 }} dataSource={studyData} columns={columns} style={{margin: '15px'}}></Table> 
          </div>
          }
        </Layout1> : userObj.USER.category === "manager" ?
    <Project/> :  userObj.USER.category === "director" ? <DirectorDash/> : <Dashboard/>}
  </div>
    )
}

export default Userdash
