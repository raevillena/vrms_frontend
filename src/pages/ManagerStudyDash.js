import React, {useState, useEffect} from 'react';
import { Button, Table,Progress, Tag, Spin, Popconfirm, notification } from 'antd'
import '../styles/CSS/Userdash.css'
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { onDeleteStudy, onGetAllStudyforProject } from '../services/studyAPI';
import moment from 'moment';


const ManagerStudyDash = (props) => {
  const dispatch = useDispatch()
  let history= useHistory();
  const projectObj = useSelector(state => state.project)
  const [studyData, setStudyData]= useState([])
  const [loading, setLoading] = useState(false)

  const notif = (type, message) => {
    notification[type]({
      message: 'Notification',
      description:
        message,
    });
  };
  
    
  useEffect(() => {
    async function getStudies(){
        let result = await onGetAllStudyforProject(projectObj.PROJECT)
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
      getStudies()
}, [projectObj.PROJECT])

useEffect(() => {
    if(props.data === null||props.data ===undefined||props.data === ''){
        return
    }else{
    setStudyData([...studyData, {key: studyData.length + 1,
        studyID:props.data.studyID,
        title: props.data.studyTitle,
        dateCreated: moment(props.data.dateCreated).format('MM-DD-YYYY'),
        dateUpdated: moment(props.data.dateUpdated).format('MM-DD-YYYY'),
        status: [props.data.status],
        progress: props.data.progress
    }])
    }
}, [props.data])

const handleRemove = (key) => { //deleting datasheet
  let newData = studyData.filter((tempData) => {
    return tempData.key !== key
  })
  setStudyData(newData)
}


  const columns = [
    {
      title: 'Study ID',
      dataIndex: 'studyID',
      key: 'studyID',
      width: '10%',
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
      render: progress =>
      <span>
       <Progress percent={progress} size="small" />
    </span>
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
      width: '20%',
      render: (text, record, index) => <div style={{display: 'flex', flexDirection:'row', gap:'5px'}}>
      <Button onClick = {
        (e) => {
          dispatch({
            type: "SET_STUDY",
            value: record
         })
         history.push('/editstudy')
        }
      } className="manageBtn">MANAGE</Button>

      <Popconfirm title="Sure to delete?" onConfirm = {
        async (key) => {
             let id ={_id: record.key._id}
            let result = await onDeleteStudy(id)
             await handleRemove(record.key)
             notif("error", result.data.message)
         }
       }>
   <Button danger>DELETE</Button>
   </Popconfirm>
   </div>
    },
  ];
  

return (
  <div>
        {loading?  <Spin className="spinner" /> :  <Table size="small" scroll={{ x: 1500, y: 500 }} dataSource={studyData} columns={columns} style={{margin: '15px'}}></Table> }
  </div>
    )
}

export default ManagerStudyDash
