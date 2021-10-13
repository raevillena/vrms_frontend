import React, {useState, useEffect} from 'react';
import { Button, Table,Progress, Tag, Spin, Popconfirm, notification, Input } from 'antd'
import '../styles/CSS/Userdash.css'
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { onDeleteStudy, onGetAllStudyforProject } from '../services/studyAPI';
import moment from 'moment';
import DirectorStudyDash from './DirectorStudyDash';


const ManagerStudyDash = () => {
  const dispatch = useDispatch()
  let history= useHistory();
  const projectObj = useSelector(state => state.project)
  const userObj = useSelector(state => state.user)
  const [studyData, setStudyData]= useState(["spinme"])
  const [value, setValue] = useState('');
  const [searchData, setSearchData] = useState([])

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
      }
      getStudies()
}, [projectObj.PROJECT])


const handleRemove = (key) => { //deleting datasheet
  let newData = studyData.filter((tempData) => {
    return tempData.key !== key
  })
  setStudyData(newData)
}

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
      width: '10%',
      defaultSortOrder: 'descend',
      sorter: (a, b) => a.id - b.id,
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
      title:  'Title',
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
      fixed: 'right',
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
             let id ={_id: record.key}
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
      {userObj.USER.category === 'manager' ? 
  <div>
        {studyData[0]==="spinme" ?  <Spin className="spinner" /> : 
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
            <Table size="small" scroll={{ x: 1500, y: 1000 }} style={{margin: '15px'}} dataSource={studyData} columns={columns} ></Table>
        </div>
         }
  </div> : <DirectorStudyDash/>}
  </div>
    )
}

export default ManagerStudyDash
