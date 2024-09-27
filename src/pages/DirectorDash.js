import React, {useState, useEffect} from 'react';
import { Button, Table,Progress, Spin, List, Tag, Input, Space } from 'antd'
import '../styles/CSS/Userdash.css'
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import { onGetProjectforDirector, onGetAllPrograms } from '../services/projectAPI';
import Highlighter from 'react-highlight-words';
import {SearchOutlined} from '@ant-design/icons';
import Layout1 from '../components/components/Layout1';


const DirectorDash = () => {
  const dispatch = useDispatch()
  let history= useHistory();
  const userObj = useSelector(state => state.user)
  const [projectData, setProjectData]= useState(["spinme"])
  const [programData, setProgramData]= useState(["spinme"])
  const [expandedRow, setExpandedRow] = useState(false);
  const [id, setId] =useState()
  const [search, setSearch] = useState({searchText: '', searchedColumn:''})
 

  useEffect(() => {
    async function getProjects(){
        let result = await onGetProjectforDirector(id)
        let programRes = await onGetAllPrograms()
        let projectResult = result.data
        let programResult = programRes.data
        let tempProjectData = []
        let tempProgramData = []
          for(let j = 0; j < programResult.length; j++){ 
            tempProgramData.push({
                key:  j,
                programID: programResult[j].programID,
                programName: programResult[j].programName,
                programLeader:  programResult[j].assigneeName,
                programLeaderID:  programResult[j].assignee,
                dateCreated: moment( programResult[j].dateCreated).format('MM-DD-YYYY'),
            });
          }
        for(let i = 0; i < projectResult.length; i++){ 
            tempProjectData.push({
                key:  projectResult[i]._id,
                projectID:  projectResult[i].projectID,
                id: [i],
                projectLeader:  projectResult[i].assigneeName,
                projectName:  projectResult[i].projectName,
                dateCreated: moment( projectResult[i].dateCreated).format('MM-DD-YYYY'),
                dateUpdated: moment( projectResult[i].dateUpdated).format('MM-DD-YYYY'),
                progress:  projectResult[i].progress,
                status: [projectResult[i].status],
            });
          }
          tempProgramData= [...tempProgramData, {
            key:  tempProgramData.length,
            programID: 'others',
            programName: 'Others',
            programLeader:  ['Others'],
            dateCreated: moment( Date.now()).format('MM-DD-YYYY'),
          }]
        setProjectData(tempProjectData)
        setProgramData(tempProgramData)
    }
      getProjects()
}, [userObj.USER.name, id])



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

const programColumns = [
  {
    title: 'Program Leader',
    dataIndex: 'programLeader',
    // width: '25%',
    key: 'programLeader',
    ...getColumnSearchProps('programLeader'),
    render: (leader) => <List size="small"
    dataSource={leader}
    renderItem={item => <List.Item>{item}</List.Item>}
    >
    </List>
  },
  {
    title: 'Program Name',
    dataIndex: 'programName',
    key: 'programName',
    // width: '40%',
    ...getColumnSearchProps('programName'),
    ellipsis: false,
  },
  {
    title: 'Date Created',
    dataIndex: 'dateCreated',
    key: 'dateCreated', 
    width: '15%'
  },
];

const expandedRowRender = programs => {
  const columns = [
    {
      title: 'Project Leader',
      dataIndex: 'projectLeader',
      key: 'projectLeader',
      // width: '15%',
      render: (leader) => <List size="small"
      dataSource={leader}
      renderItem={item => <List.Item>{item}</List.Item>}
      >
      </List>
    },
    {
      title: 'Project Name',
      dataIndex: 'projectName',
      ...getColumnSearchProps('projectName'),
      key: 'projectName',
      // width: '25%',
      ellipsis: false,
    },
    {
      title: 'Date Created',
      dataIndex: 'dateCreated',
      key: 'dateCreated',
      width: '10%',
      
    },
    {
      title: 'Progress',
      dataIndex: 'progress',
      key: 'progress',
      // width: '10%',
      render: progress =>
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
      // width: '10%',
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
      // fixed: 'right',
      // width: '15%',
      render: (text, record, index) => <div style={{display: 'flex', flexDirection:'row'}}>
        <Button type='link' onClick = {
        (e) => {
          dispatch({
            type: "SET_PROJECT",
            value: record
         })
         history.push('/studies')
        }
      } >MANAGE</Button>
      </div>
    },
  ];
  
  if(programData === ''){
    return <Spin className="spinner" />
  }else{
    return <Table columns={columns} dataSource={projectData} pagination={false} />
  }
};

    return (
      <div>
        <Layout1>         
        {projectData[0]==="spinme"?  <Spin className="spinner" /> :
            <div>  
                <Table size="small" className="components-table-demo-nested" onExpand={(isExpanded, record) =>{
                setExpandedRow([record.key])
                setId(isExpanded ? record.programID : undefined)}}  expandable={{ expandedRowRender }} dataSource={programData} expandedRowKeys={expandedRow} columns={programColumns} style={{margin: '15px'}}/>
            </div>
            }
        </Layout1> 
      </div>
    )
}

export default DirectorDash
