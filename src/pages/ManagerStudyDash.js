import React, {useState, useEffect} from 'react';
import { Button, Table,Progress, Tag, Spin, Popconfirm, notification, Input, Modal, Space } from 'antd'
import '../styles/CSS/Userdash.css'
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { onDeleteStudy, onGetAllStudyforProject } from '../services/studyAPI';
import moment from 'moment';
import DirectorStudyDash from './DirectorStudyDash';
import EditStudy from './EditStudy'
import Highlighter from 'react-highlight-words';
import { SearchOutlined} from '@ant-design/icons';


const ManagerStudyDash = (props) => {
  const dispatch = useDispatch()
  let history= useHistory();
  const projectObj = useSelector(state => state.project)
  const userObj = useSelector(state => state.user)
  const [studyData, setStudyData]= useState(["spinme"])
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [studyProps, setStudyProps] = useState()
  const [search, setSearch] = useState({searchText: '', searchedColumn:''})

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const notif = (type, message) => {
    notification[type]({
      message: 'Notification',
      description:
        message,
    });
  };
  
    
  useEffect(() => {
    if(props.data === null||props.data === undefined||props.data === ''){
      return
  }else{
    setStudyData([...studyData,{
      key: props.data._id,
      id: studyData.length+1,
      title: props.data.studyTitle,
      studyID: props.data.studyID,
      dateCreated: moment(props.data.dateCreated).format('MM-DD-YYYY'),
      assignee: props.data.assignee,
      assigneeName: props.data.assigneeName,
      budget: props.data.budget,
      dateUpdated: moment(props.data.dateUpdated).format('MM-DD-YYYY'),
      progress: props.data.progress,
      status: [props.data.status],
      updatedBy: props.data.updatedBy,
      deadline: props.data.deadline,
      objectives: props.data.objectives
    }])
  }
}, [props.data])

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
            assignee: x[i].assignee,
            assigneeName: x[i].assigneeName,
            budget: x[i].budget,
            dateUpdated: moment(x[i].dateUpdated).format('MM-DD-YYYY'),
            progress: x[i].progress,
            status: [x[i].status],
            updatedBy: x[i].updatedBy,
            deadline: x[i].deadline,
            objectives: x[i].objectives,
        });
      }
    setStudyData(tempStudyData)
    }
    getStudies()
}, [projectObj.PROJECT])


const handleRemove = (key) => { //deleting datasheet
  let newData = studyData.filter((tempData) => {
    return tempData.key !== key
  })
  setStudyData(newData)
}

const handleSearch = (selectedKeys, confirm, dataIndex) => {
  confirm();
  setSearch({
    searchText: selectedKeys[0],
    searchedColumn: dataIndex,
  });
};

const handleReset = clearFilters => {
  clearFilters();
  setSearch({...search, searchText: '' });
};

const getColumnSearchProps = dataIndex => ({
  filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
    <div style={{ padding: 8 }}>
      <Input
        placeholder={`Search ${dataIndex}`}
        value={selectedKeys[0]}
        onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
        onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
        style={{ marginBottom: 8, display: 'block' }}
        id='searchInput'
      />
      <Space>
        <Button
          type="primary"
          onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
          icon={<SearchOutlined />}
          size="small"
          style={{ width: 90 }}
        >
          Search
        </Button>
        <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
          Reset
        </Button>
        <Button
          type="link"
          size="small"
          onClick={() => {
            confirm({ closeDropdown: false });
            setSearch({
              searchText: selectedKeys[0],
              searchedColumn: dataIndex,
            });
          }}
        >
          Filter
        </Button>
      </Space>
    </div>
  ),
  filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
  onFilter: (value, record) =>
    record[dataIndex]
      ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
      : '',
 
  render: text =>
    search.searchedColumn === dataIndex ? (
      <Highlighter
        highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
        searchWords={[search.searchText]}
        autoEscape
        textToHighlight={text ? text.toString() : ''}
      />
    ) : (
      text
    ),
});

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
      ...getColumnSearchProps('title'),
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
      } type='link'>MANAGE</Button>

        <Button type='link' onClick={() =>{
          let prop = {record, index, studyData}
          setStudyProps(prop)
          showModal()
          }} >EDIT</Button>

      <Popconfirm title="Sure to delete?" onConfirm = {
        async (key) => {
             let id ={_id: record.key, user: userObj.USER._id}
            let result = await onDeleteStudy(id)
             await handleRemove(record.key)
             notif("error", result.data.message)
         }
       }>
   <Button type='link' danger>DELETE</Button>
   </Popconfirm>
   </div>
    },
  ];
  
  const edit_data = (data) => {
    let objIndex = studyData.findIndex((obj => obj.studyID === data.study.studyID));
    studyData[objIndex].title = data.study.title
  }

return (
  <div>
      {userObj.USER.category === 'manager' ? 
  <div>
        {studyData[0]==="spinme" ?  <Spin className="spinner" /> : 
        <div > 
            <Table size="small" scroll={{ x: 1500, y: 1000 }} style={{margin: '15px'}} dataSource={studyData} columns={columns} ></Table>
        </div>
         }
  </div> : <DirectorStudyDash/>}

    <Modal title="Edit Study" visible={isModalVisible} footer={null} onCancel={handleCancel}>
      <EditStudy data={studyProps} func={edit_data}/>
    </Modal>
  </div>
    )
}

export default ManagerStudyDash
