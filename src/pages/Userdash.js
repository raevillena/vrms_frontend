import React, {useState, useEffect} from 'react';
import { Layout,Button, Table,Progress, Tag, Spin } from 'antd'
import '../styles/CSS/Userdash.css'
import { useHistory } from 'react-router-dom';
import Sidebar from '../components/components/Sidebar'
import Headers from '../components/components/Header'
import Mobile from '../pages/mobile/Userdash'
import { useDispatch, useSelector } from 'react-redux';
import { onGetStudyForUser } from '../services/studyAPI';

const { Header, Content, Sider } = Layout;


const Userdash = () => {
  let history= useHistory();
  const userObj = useSelector(state => state.user)
  const [studyData, setStudyData]= useState([])
  const [loading, setLoading] = useState(false)

  async function getStudies(){
    console.log(userObj.USER)
    let result = await onGetStudyForUser(userObj.USER)
    setLoading(true)
    let x = result.data
    let tempStudyData = []
    for(let i = 0; i < x.length; i++){ 
      tempStudyData.push({
          key: x[i],
          title: x[i].studyTitle,
          studyID: x[i].studyID,
          dateCreated: x[i].dateCreated,
          dateUpdated: x[i].dateUpdated,
          progress: x[i].progress,
          status: [x[i].status]
      });
  }
  setStudyData(tempStudyData)
  }
    
  useEffect(async () => {
    async function getData() {
        getStudies()
    }

    await getData()
    setLoading(false)
}, [])

  // manage study
  const manage = async ()=>{
    try {
      history.push('/datagrid')
    } catch (error) {
      console.log(error)
    }
  }

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
      render: () => <Button onClick={manage} className="manageBtn">MANAGE</Button>
    },
  ];
  

  //for mobile Ui
  function useWindowSize(){
    const [size, setSize] = useState([window.innerHeight, window.innerWidth]);
    useEffect(() => {
      const handleResize = () => {
        setSize([window.innerHeight, window.innerWidth])
      }
      window.addEventListener("resize", handleResize)
      return() => {
        window.removeEventListener("resize", handleResize)
      }
    }, [])
    return size;
  }

 

  const [height, width] = useWindowSize();
  if(height <= 768 || width <= 768){
    return <Mobile/>
  }

    return (
    <Layout  > 
      <Sider  style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          background:'white'
        }} >
          <Sidebar/>
      </Sider>
    <Layout style={{ marginLeft: 200 }}>
      <Header style={{ padding: 0, background:'#f2f2f2' }} >
        <Headers/>
      </Header>
     <Content style={{ margin: '24px 16px 0', overflow: 'initial', minHeight:'100vh' }} >          
        {loading? <Table size="small" dataSource={studyData} columns={columns} style={{minWidth:'100%'}}></Table> : <Spin style={{display: 'flex', justifyContent:'center', padding: '25%'}} />}
        
      </Content> 
    </Layout>      
</Layout>

    )
}

export default Userdash
