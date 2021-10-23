import React, {useState, useEffect} from 'react';
import { Button, Table,Progress, Spin, List, Tag, Input, Layout } from 'antd'
import '../styles/CSS/Userdash.css'
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import { onGetProjectforDirector, onGetAllPrograms } from '../services/projectAPI';
import Sidebar from '../components/components/DirectorSidebar'
import Headers from '../components/components/HeaderManager'
import MobileHeader from '../components/components/MobileHeader';


const { Header, Content, Sider } = Layout;

const DirectorDash = () => {
  const dispatch = useDispatch()
  let history= useHistory();
  const userObj = useSelector(state => state.user)
  const [projectData, setProjectData]= useState(["spinme"])
  const [programData, setProgramData]= useState(["spinme"])
  const [value, setValue] = useState('');
  const [searchData, setSearchData] = useState([])
  const [expandedRow, setExpandedRow] = useState(false);
  const [id, setId] =useState()
 

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
                status: [projectResult[i].status]
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
        setSearchData(tempProjectData)
    }
      getProjects()
}, [userObj.USER.name, id])



const onSearch = value =>{
  if(value === ''){
    setProjectData(searchData)
  }else{
    const filteredData = projectData.filter(entry =>
      entry.projectName.includes(value)
  );
    setProjectData(filteredData)
  } 
}

const programColumns = [
  {
    title: 'Program Leader',
    dataIndex: 'programLeader',
    width: '25%',
    key: 'programLeader',
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
    width: '40%',
    ellipsis: true,
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
      width: '15%',
      render: (leader) => <List size="small"
      dataSource={leader}
      renderItem={item => <List.Item>{item}</List.Item>}
      >
      </List>
    },
    {
      title: 'Project Name',
      dataIndex: 'projectName',
      key: 'projectName',
      width: '25%',
      ellipsis: true,
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
      width: '10%',
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
      width: '10%',
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
    return <Table columns={columns} dataSource={projectData} pagination={false} scroll={{ x: 1200, y: 1000 }} />
  }
};

    return (
      <div >
          <Layout style={{height: '100vh'}} > 
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
        {projectData[0]==="spinme"?  <Spin className="spinner" /> :
            <div>  
            <div style={{width: '200px', float: 'right', margin: '0 5px 5px 0'}}>
            <Input.Search placeholder="Search Title" value={value}
                onChange={e => {
                    const currValue = e.target.value;
                    setValue(currValue);
                    onSearch(currValue)
                }}
                onSearch={onSearch}
                allowClear
                />
            </div> 
                <Table size="small" className="components-table-demo-nested" onExpand={(isExpanded, record) =>{
                setExpandedRow([record.key])
                setId(isExpanded ? record.programID : undefined)}}  expandable={{ expandedRowRender }} scroll={{ x: 1200, y: 1000 }} dataSource={programData} expandedRowKeys={expandedRow} columns={programColumns} style={{margin: '15px'}}/>
            </div>
            }
        </Content> 
      </Layout>      
    </Layout>
      </div>
    )
}

export default DirectorDash
