import React, {useState, useEffect} from 'react';
import { Button, Table,Progress, Spin, Popconfirm, notification, Input, Space } from 'antd'
import '../styles/CSS/Userdash.css'
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import { onDeleteProject, onGetProjectforManager } from '../services/projectAPI';



const ManagerDash = (props) => {
  const dispatch = useDispatch()
  let history= useHistory();
  const userObj = useSelector(state => state.user)
  const [projectData, setProjectData]= useState([])
  const [loading, setLoading] = useState(false)


  const notif = (type, message) => {
    notification[type]({
      message: 'Notification',
      description:
        message,
    });
  };

  useEffect(() => {
    async function getProjects(){
        setLoading(true)
        let result = await onGetProjectforManager({user: userObj.USER.name})
        let projectResult = result.data
        let tempProjectData = []
        for(let i = 0; i < projectResult.length; i++){ 
            tempProjectData.push({
                key:  projectResult[i],
                projectID:  projectResult[i].projectID,
                projectLeader:  [projectResult[i].assignee],
                projectName:  projectResult[i].projectName,
                dateCreated: moment( projectResult[i].dateCreated).format('MM-DD-YYYY'),
                dateUpdated: moment( projectResult[i].dateUpdated).format('MM-DD-YYYY'),
                progress:  projectResult[i].progress,
            });
            
          }
        setProjectData(tempProjectData)
        setLoading(false)
      }

      getProjects()
}, [userObj.USER.name])

useEffect(() => {
    if(props.data === null||props.data === undefined||props.data === ''){
        return
    }else{
    setProjectData([...projectData, {key: projectData.length + 1,
        projectID:props.data.projectID,
        projectLeader: [props.data.assignee],
        projectName: props.data.projectName,
        dateCreated: moment(props.data.dateCreated).format('MM-DD-YYYY'),
        dateUpdated: moment(props.data.dateUpdated).format('MM-DD-YYYY'),
        progress: props.data.progress
    }])
    }
}, [props.data])


const handleRemove = (key) => { //deleting datasheet
  let newData = projectData.filter((tempData) => {
    return tempData.key !== key
  })
  setProjectData(newData)
}





  const columns = [
    {
      title: 'Project ID',
      dataIndex: 'projectID',
      key: 'projectID',
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
      title: 'Project Leader',
      dataIndex: 'projectLeader',
      key: 'projectLeader',
      width: '15%',
      render: ([leader]) => leader.map( lead =>
        <div style={{display: 'grid'}}>
        <p>{lead}</p>
      </div>
        )
      
      
    },
    {
      title: 'Project Name',
      dataIndex: 'projectName',
      key: 'projectName',
      width: '25%',
      ellipsis: true,
    },
    {
      title: 'Progress',
      dataIndex: 'progress',
      key: 'progress',
      width: '15%',
      render: progress =>
       <Progress percent={progress} size="small" />,
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
            type: "SET_PROJECT",
            value: record
         })
         history.push('/studies')
        }
      } className="manageBtn">MANAGE</Button>

      <Popconfirm title="Sure to delete?" onConfirm = {
           async (key) => {
                let id ={_id: record.key._id}
                let result = await onDeleteProject(id)
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
        {loading?  <Spin className="spinner" /> :<Table size="small" scroll={{ x: 1500, y: 500 }} dataSource={projectData} columns={columns} style={{margin: '15px'}}></Table> }
    </div>
    )
}

export default ManagerDash
