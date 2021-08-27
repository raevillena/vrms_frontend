import React, {useState, useEffect} from 'react';
import { Layout,Button, Table,Progress, Tag, Spin } from 'antd'
import '../styles/CSS/Userdash.css'
import { useHistory } from 'react-router-dom';
import Sidebar from '../components/components/Sidebar'
import Headers from '../components/components/Header'
import { useSelector, useDispatch } from 'react-redux';
import { onGetStudyForUser } from '../services/studyAPI';
import moment from 'moment';
import MobileHeader from '../components/components/MobileHeader';

const { Header, Content, Sider } = Layout;


const Userdash = () => {
  const dispatch = useDispatch()
  let history= useHistory();
  const userObj = useSelector(state => state.user)
  const [studyData, setStudyData]= useState([])
  const [loading, setLoading] = useState(false)

  async function getStudies(){
    let result = await onGetStudyForUser(userObj.USER)
    setLoading(true)
    let x = result.data
    let tempStudyData = []
    for(let i = 0; i < x.length; i++){ 
      tempStudyData.push({
          key: x[i],
          title: x[i].studyTitle,
          studyID: x[i].studyID,
          dateCreated: moment(x[i].dateCreated).format('MM-DD-YYYY'),
          dateUpdated: moment(x[i].dateUpdated).format('MM-DD-YYYY'),
          progress: x[i].progress,
          status: [x[i].status]
      });
    }
  setStudyData(tempStudyData)
  setLoading(false)
  }
    
  useEffect(() => {
    async function getStud(){
      await getStudies()
    }
    getStud()
}, [userObj])


  const columns = [
    {
      title: 'Study ID',
      dataIndex: 'studyID',
      key: 'studyID',
      width: '10%',
      sorter: true,
      defaultSortOrder: 'descend',
      sorter: (a, b) => a.studyno - b.studyno,
    },
    {
      title: 'Date Created',
      dataIndex: 'dateCreated',
      key: 'dateCreated',
      width: '15%',
      
    },
    {
      title: 'Updated',
      dataIndex: 'dateUpdated',
      key: 'dateUpdated',
      width: '15%',
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      width: '25%',
      ellipsis: true
    },
    {
      title: 'Progress',
      dataIndex: 'progress',
      key: 'progress',
      width: '10%',
      render: () =>
       <Progress percent={studyData.progress} size="small" />,
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
          {status.map(status => {
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
      render: (text, record, index) => <Button onClick = {
        (e) => {
          dispatch({
            type: "SET_STUDY",
            value: record
         })
         history.push('/datagrid')
        }
      } className="manageBtn">MANAGE</Button>
    },
  ];
  

    return (
    <Layout  > 
      <Sider  className="sidebar" >
          <Sidebar/>
      </Sider>
    <Layout >
      <Header className="header" style={{ padding: 0, background:'#f2f2f2' }} >
        <Headers/>
      </Header>
      <div className="mobile-header">
        <MobileHeader/>
      </div>
     <Content style={{  minHeight: "100vh" }} >          
        {loading?  <Spin className="spinner" /> :<Table size="small" scroll={{ x: 800, y: 500 }} dataSource={studyData} columns={columns} style={{margin: '15px'}}></Table> }
      </Content> 
    </Layout>      
</Layout>

    )
}

export default Userdash
