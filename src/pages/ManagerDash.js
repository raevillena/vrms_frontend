import React, {useState, useEffect} from 'react';
import { Button, Table,Progress, Spin, Popconfirm, notification, List, Tag, Input } from 'antd'
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
    async function getProjects(){
        let result = await onGetProjectforManager({user: userObj.USER._id})//CHANGE TO ID
        let projectResult = result.data
        let tempProjectData = []
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
        setProjectData(tempProjectData)
        setSearchData(tempProjectData)
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
        id: projectData.length + 1,
        projectID:props.data.projectID,
        projectLeader: props.data.assigneeName,
        projectName: props.data.projectName,
        dateCreated: moment(props.data.dateCreated).format('MM-DD-YYYY'),
        dateUpdated: moment(props.data.dateUpdated).format('MM-DD-YYYY'),
        progress: props.data.progress,
        status:  [props.data.status]
    }])
    setSearchData([...projectData, {key: projectData.length + 1,
      id: projectData.length + 1,
      projectID:props.data.projectID,
      projectLeader: props.data.assigneeName,
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


  const columns = [
    {
      title: 'Project ID',
      dataIndex: 'id',
      key: 'id',
      width: '5%',
      defaultSortOrder: 'descend',

      sorter: (a, b) => a.id - b.id,
    },
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
      <div > 
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
              <Table size="small" scroll={{ x: 1200, y: 1000 }} dataSource={projectData} columns={columns} style={{margin: '15px'}}/>
            </div>
           }
      </div>
    )
}

export default ManagerDash
