import React, {useState, useEffect} from 'react';
import { Layout,Button, Table,Progress, Tag, Spin, Input } from 'antd'
import '../styles/CSS/Userdash.css'
import { useHistory } from 'react-router-dom';
import Sidebar from '../components/components/Sidebar'
import Headers from '../components/components/Header'
import { useSelector, useDispatch } from 'react-redux';
import { onGetStudyForUser } from '../services/studyAPI';
import moment from 'moment';
import MobileHeader from '../components/components/MobileHeader';
import Project from './Project';
import DirectorDash from './DirectorDash';


const { Header, Content, Sider } = Layout;


const Userdash = () => {
  const dispatch = useDispatch()
  let history= useHistory();
  let userObj = useSelector(state => state.user)
  const [studyData, setStudyData]= useState()
  const [loading, setLoading] = useState(true)
  const [value, setValue] = useState('');
  const [searchData, setSearchData] = useState([])
  
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
            deadline: x[i].deadline
        });
      }
      setStudyData(tempStudyData)
      setSearchData(tempStudyData)
      setLoading(false) 
    }
    if(accessToken === null || refreshToken === null || userObj.USER === ""){
      return
    }else{
      getStudies(userObj.USER)
    }
}, [])

const onSearch = value =>{
  if(value === ''){
    setStudyData(searchData)
  }else{
    const filteredData = studyData.filter(entry =>
      entry.title.includes(value)
  );
    setStudyData(filteredData)
  } 
}

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
          {loading ?  <Spin className="spinner" /> : 
           <div > 
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
          <Table size="small" scroll={{ x: 1500, y: 500 }} dataSource={studyData} columns={columns} style={{margin: '15px'}}></Table> 
          </div>
          }
        </Content> 
      </Layout>      
    </Layout>: userObj.USER.category === "manager" ?
    <Project/> : <DirectorDash/>}
  </div>
    )
}

export default Userdash
