import React, {useState, useEffect} from 'react';
import { Button, Table,Progress, Spin, Popconfirm, notification, List, Tag, Input, Modal } from 'antd'
import '../styles/CSS/Userdash.css'
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import { onDeleteProject, onGetProgramforManager, onGetProjectforManager } from '../services/projectAPI';
import EditProgram from './EditProgram';
import EditProject from './EditProject'



const ManagerDash = (props) => {
  const dispatch = useDispatch()
  let history= useHistory();
  const userObj = useSelector(state => state.user)
  const [projectData, setProjectData]= useState(["spinme"])
  const [programData, setProgramData]= useState(["spinme"])
  const [value, setValue] = useState('');
  const [searchData, setSearchData] = useState([])
  const [id, setId] = useState()
  const [programProps, setProgramProps] = useState()
  const [projectProps, setProjectProps] = useState()
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isProjectVisible, setIsProjectVisible] = useState(false);
  const [expandedRow, setExpandedRow] = useState(false);

  const notif = (type, message) => {
    notification[type]({
      message: 'Notification',
      description:
        message,
    });
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const showModalProject = () => {
    setIsProjectVisible(true)
  };

  const handleProjectCancel = () => {
    setIsProjectVisible(false);
  };

  useEffect(() => {
    async function getProjects(){
        let result1 = await onGetProgramforManager({user: userObj.USER._id})
        let programResult = result1.data
        let tempProgramData = []
          for(let j = 0; j < programResult.length; j++){ 
            tempProgramData.push({
                key:  j,
                programID: programResult[j].programID,
                programName: programResult[j].programName,
                programLeader:  programResult[j].assigneeName,
                programLeaderID:  programResult[j].assignee,
                dateCreated: moment( programResult[j].dateCreated).format('MM-DD-YYYY'),
            });
          }
          tempProgramData= [...tempProgramData, {
                key:  tempProgramData.length,
                programID: 'others',
                programName: 'Others',
                programLeader:  ['Others'],
                dateCreated: moment( Date.now()).format('MM-DD-YYYY'),
          }]
        setProgramData(tempProgramData)
    }
      getProjects()
}, [userObj.USER.name])

useEffect(() => {
  let cancel = false;
    if(props.data === null||props.data === undefined||props.data === ''){
        return
    }else{
      if(cancel) return
    if(props.data.type === 'program'){
    setProgramData([...programData, {key:  props.data.newProgram._id,
      programID: props.data.newProgram.program,
      programName: props.data.newProgram.programName,
      programLeader:  props.data.newProgram.assigneeName,
      dateCreated: moment( props.data.newProgram.dateCreated).format('MM-DD-YYYY')}])
    }else{
      if(props.data.data.program === id){
        setProjectData([...projectData, {key: projectData.length + 1,
          projectID:props.data.data.projectID,
          projectLeader: props.data.data.assigneeName,
          projectLeaderID: props.data.data.assignee,
          projectName: props.data.data.projectName,
          programID: props.data.data.program,
          dateCreated: moment(props.data.data.dateCreated).format('MM-DD-YYYY'),
          dateUpdated: moment(props.data.data.dateUpdated).format('MM-DD-YYYY'),
          progress: props.data.data.progress,
          status:  [props.data.data.status]
        }])
      }else{
        return
      }
    }
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


const programColumns = [
  {
    title: 'Program Leader',
    dataIndex: 'programLeader',
    width: '25%',
    key: 'programLeader',
    render: (leader) => <List size="small"
    dataSource={leader}
    renderItem={item => <List.Item>{item}</List.Item>}
    >
    </List>
  },
  {
    title: 'Program Name',
    dataIndex: 'programName',
    key: 'programName',
    width: '40%',
    ellipsis: true,
  },
  {
    title: 'Date Created',
    dataIndex: 'dateCreated',
    key: 'dateCreated', 
    width: '15%'
  },
  {
    title: 'Action',
    dataIndex: 'action',
    width: '15%',
    key: 'action',
    fixed: 'right',
    render: (text, record, index) => <div style={{display: 'flex', flexDirection:'row', gap:'5px'}}>
      <Button type='link' onClick={() =>{
         let prop = {record, index}
        setProgramProps(prop)
        showModal()
      }}>
        Edit
      </Button>
    </div>
  },
];

const expandedRowRender = programs => {
  const columns = [
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
      render: (text, record, index) => <div style={{display: 'flex', flexDirection:'row'}}>
        <Button type='link' onClick = {
        (e) => {
          dispatch({
            type: "SET_PROJECT",
            value: record
         })
         history.push('/studies')
        }
      } >MANAGE</Button>

        <Button type='link' onClick={() =>{
          let prop = {record, index, programs}
          setProjectProps(prop)
          showModalProject()}} >EDIT</Button>

      <Popconfirm title="Sure to delete?" onConfirm = {
           async (key) => {
                let id ={_id: record.key, user: userObj.USER._id}
                let result = await onDeleteProject(id)
                await handleRemove(record.key)
                notif("error", result.data.message)
            }
          }>
      <Button type='link' danger>DELETE</Button>
      </Popconfirm>
      </div>
    },
  ];
  
  if(programData === ''){
    return <Spin className="spinner" />
  }else{
    return <Table columns={columns} dataSource={projectData} pagination={false} scroll={{ x: 1200, y: 1000 }} />
  }
};

useEffect(() => {
  async function getProject (){
    let result = await onGetProjectforManager({user: userObj.USER._id, program: id})//CHANGE TO ID
    let projectResult = result.data
    let tempProjectData = []
    for(let i = 0; i < projectResult.length; i++){ 
        tempProjectData.push({
            key:  projectResult[i]._id,
            projectID:  projectResult[i].projectID,
            projectLeader:  projectResult[i].assigneeName,
            projectLeaderID:  projectResult[i].assignee,
            programID: projectResult[i].program,
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
  getProject()
  return () => {
    console.log('unmounting')
  }
}, [id])

const pull_data = (data) => {
  let objIndex = programData.findIndex((obj => obj.programID === data.program));
  programData[objIndex].programLeaderID = data.assignee
  programData[objIndex].programLeader = data.assigneeName
  programData[objIndex].programName = data.programName
}

const edit_data = (data) => {
  let objIndex = projectData.findIndex((obj => obj.projectID === data.project.id));
  if(projectData[objIndex].programID !== data.program){
    let arr = projectData
    arr.splice(objIndex,1);
    setProjectData([...arr])
  }else{
    projectData[objIndex].projectLeaderID = data.assignee
    projectData[objIndex].projectLeader = data.assigneeName
    projectData[objIndex].projectName = data.programName
    projectData[objIndex].programID = data.program
  }
}

    return (
      <div > 
        {programData[0]==="spinme"?  <Spin className="spinner" /> :
         <div>  
            <div style={{width: '200px', float: 'right', margin: '0 5px 5px 0'}}>
            <Input.Search placeholder="Search Project Title" value={value}
                onChange={e => {
                  const currValue = e.target.value;
                  setValue(currValue);
                  onSearch(currValue)
                }}
                onSearch={onSearch}
                allowClear
              />
            </div> 
              <Table size="small" className="components-table-demo-nested"  expandable={{ expandedRowRender }} onExpand={(isExpanded, record) =>{
                setExpandedRow([record.key])
                setId(isExpanded ? record.programID : undefined)}}scroll={{ x: 1200, y: 1000 }}  dataSource={programData} expandedRowKeys={expandedRow} columns={programColumns} style={{margin: '15px'}} 
                />
            </div>
           }
            <Modal title="Edit Program" visible={isModalVisible} footer={null} onCancel={handleCancel}>
              <EditProgram data={programProps} func={pull_data}/>
            </Modal>
            <Modal title="Edit Project" visible={isProjectVisible} footer={null} onCancel={handleProjectCancel}>
              <EditProject data={projectProps} func={edit_data}/>
            </Modal>
      </div>
    )
}

export default ManagerDash
