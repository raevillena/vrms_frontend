import React, {useState, useEffect} from 'react';
import { Layout,Button, Table,Progress, Tag, Spin } from 'antd'
import '../styles/CSS/Userdash.css'
import { useHistory } from 'react-router-dom';
import Sidebar from '../components/components/Sidebar'
import Headers from '../components/components/Header'
import Mobile from '../pages/mobile/Userdash'
import { useDispatch, useSelector } from 'react-redux';

const { Header, Content, Sider } = Layout;



const Userdash = () => {
  const dispatch = useDispatch()
  let history= useHistory();
  const loading = useSelector(state => state.loader)

  // manage study
  const manage = async ()=>{
    try {
      history.push('/datagrid')
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(()=>{
    dispatch({
      type: "SET_LOADING",
      value: false
   })
  }, [])

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
      date: 'June 24,2021 10:00 AM',
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
      sorter: true,
      defaultSortOrder: 'descend',
      sorter: (a, b) => a.studyno - b.studyno,
    },
    {
      title: 'Date Created',
      dataIndex: 'date',
      key: 'date',
      width: '15%',
      
    },
    {
      title: 'Updated',
      dataIndex: 'updated',
      key: 'updated',
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
      onFilter: (value, record) => record.status.indexOf(value) === 0,
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
  if(height <= 768 && width <= 768){
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
        <Table size="small" dataSource={dataSource} columns={columns} style={{minWidth:'100%'}}></Table>
      </Content> 
    </Layout>      
</Layout>

    )
}

export default Userdash
