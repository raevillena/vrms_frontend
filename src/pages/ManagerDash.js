import React, {useState, useEffect} from 'react';
import { Button, Table,Progress, Spin, Popconfirm, notification, List, Tag } from 'antd'
import '../styles/CSS/Userdash.css'
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import { onDeleteProject, onGetProjectforManager } from '../services/projectAPI';



const ManagerDash = (props) => {
  const dispatch = useDispatch()
  let history= useHistory();
  const userObj = useSelector(state => state.user)
  const [projectData, setProjectData]= useState(["spinme"])
 


  const notif = (type, message) => {
    notification[type]({
      message: 'Notification',
      description:
        message,
    });
  };

  useEffect(() => {
    async function getProjects(){
        let result = await onGetProjectforManager({user: userObj.USER.name})
        let projectResult = result.data
        let tempProjectData = []
        for(let i = 0; i < projectResult.length; i++){ 
            tempProjectData.push({
                key:  projectResult[i]._id,
                projectID:  projectResult[i].projectID,
                projectLeader:  [projectResult[i].assignee],
                projectName:  projectResult[i].projectName,
                dateCreated: moment( projectResult[i].dateCreated).format('MM-DD-YYYY'),
                dateUpdated: moment( projectResult[i].dateUpdated).format('MM-DD-YYYY'),
                progress:  projectResult[i].progress,
                status: [projectResult[i].status]
            });
            
          }
        setProjectData(tempProjectData)
    }
      getProjects()
}, [userObj.USER.name])

useEffect(() => {
  let cancel = false;
    if(props.data === null||props.data === undefined||props.data === ''){
        return
    }else{
      if(cancel) return
    setProjectData([...projectData, {key: projectData.length + 1,
        projectID:props.data.projectID,
        projectLeader: [props.data.assignee],
        projectName: props.data.projectName,
        dateCreated: moment(props.data.dateCreated).format('MM-DD-YYYY'),
        dateUpdated: moment(props.data.dateUpdated).format('MM-DD-YYYY'),
        progress: props.data.progress,
        status:  [props.data.status]
    }])
    }
    return () => { 
      cancel = true;
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
      fixed: 'left',
      sorter: (a, b) => a.studyno - b.studyno,
    },
    {
      title: 'Project Leader',
      dataIndex: 'projectLeader',
      key: 'projectLeader',
      width: '15%',
      render: (leader) => <List size="small"
      dataSource={leader[0]}
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
                let id ={_id: record.key}
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
    <div style={{  width: '100%', background:'#f2f2f2' }}>      
        {projectData[0]==="spinme"?  <Spin className="spinner" /> :<Table size="small" scroll={{ x: 1200, y: 1000 }} dataSource={projectData} columns={columns} style={{margin: '15px'}}></Table> }
    </div>
    )
}

export default ManagerDash
