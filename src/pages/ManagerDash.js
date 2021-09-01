import React, {useState, useEffect} from 'react';
import { Button, Table,Progress, Spin } from 'antd'
import '../styles/CSS/Userdash.css'
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import { onGetProjectforManager } from '../services/projectAPI';




const ManagerDash = (props) => {
  const dispatch = useDispatch()
  let history= useHistory();
  const userObj = useSelector(state => state.user)
  const [projectData, setProjectData]= useState([])
  const [loading, setLoading] = useState(false)


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
                projectLeader:  projectResult[i].assignee,
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
        projectLeader: props.data.assignee,
        projectName: props.data.projectName,
        dateCreated: moment(props.data.dateCreated).format('MM-DD-YYYY'),
        dateUpdated: moment(props.data.dateUpdated).format('MM-DD-YYYY'),
        progress: props.data.progress
    }])
    }
}, [props.data])


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
    },
    {
      title: 'Project Name',
      dataIndex: 'projectName',
      key: 'projectName',
      width: '25%',
      ellipsis: true
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
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      width: '15%',
      render: (text, record, index) => <Button onClick = {
        (e) => {
          dispatch({
            type: "SET_PROJECT",
            value: record
         })
         history.push('/studies')
        }
      } className="manageBtn">MANAGE</Button>
    },
  ];

    return (
    <div>      
        {loading?  <Spin className="spinner" /> :<Table size="small" scroll={{ x: 800, y: 500 }} dataSource={projectData} columns={columns} style={{margin: '15px'}}></Table> }
    </div>
    )
}

export default ManagerDash
