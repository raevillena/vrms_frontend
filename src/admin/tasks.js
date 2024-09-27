import LayoutComponent from './layout';
import  { useState, useEffect } from 'react';
import {Table, Input, Button, Tag, Space, Modal} from 'antd'
// import {SearchOutlined, SyncOutlined} from '@ant-design/icons'

import { SearchOutlined, CheckCircleOutlined, SyncOutlined, ExclamationOutlined } from '@ant-design/icons'
import moment from 'moment';
import Highlighter from 'react-highlight-words';
import { onGetAllTaskAdmin } from '../services/taskAPI';
import Edittask from './edittask';


const Tasks = () => {
    const [state, setstate] = useState()
    const [search, setSearch] = useState({searchText: '', searchedColumn:''})
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [props, setProps] = useState()

    useEffect(() => {
        async function getTask() {
            let res = await onGetAllTaskAdmin()
            let arr = []
            let data = res.data.tasks
            for (let i = 0; i < data.length; i++) {
                arr.push({
                    key: data[i]._id,
                    assignee: data[i].assignee,
                    assigneeName: data[i].assigneeName,
                    dateCreated: moment(data[i].dateCreated).format('MM-DD-YYYY'),
                    createdBy: data[i].createdBy,
                    cretaedByName: data[i].cretaedByName,
                    lastUpdated: moment(data[i].lastUpdated).format('MM-DD-YYYY'),
                    updatedBy: data[i].updatedBy,
                    title: data[i].tasksTitle,
                    description: data[i].tasksDescription,
                    status: [data[i].status],
                    study: data[i].studyName,
                    project: data[i].projectName,
                    deadline: moment(data[i].deadline).format('MM-DD-YYYY'),
                    objectives: data[i].objective,
                    verification: data[i].verification,
                    active: [data[i].active.toString()],
                    progress: data[i].progress,
                })
            }
            setstate(arr)
        }
        getTask()
    }, [])

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
            title: 'Task Title',
            dataIndex: 'title',
            key: 'title',
            ellipsis: false,
            // width:'10%',
            ...getColumnSearchProps('title')
        },
        {
            title: 'Task Description',
            dataIndex: 'description',
            key: 'description',
            ellipsis: false,
            // width:'20%',
            ...getColumnSearchProps('description')
        },
        {
            title: 'Objectives',
            dataIndex: 'objectives',
            key: 'objectives',
            // width:'20%',
            ellipsis: false,
            ...getColumnSearchProps('objectives')
        },
        {
            title: 'Verification',
            dataIndex: 'verification',
            key: 'verification',
            ellipsis: false,
            ...getColumnSearchProps('verification')
        },
        {
            title: 'Date Created',
            dataIndex: 'dateCreated',
            key: 'dateCreated',
            // width:'90px',
            filters: [{text: 'January', value: '01'},
              {text: 'February', value: '02'},
              {text: 'March', value: '03'},
              {text: 'April', value: '04'},
              {text: 'May', value: '05'},
              {text: 'June', value: '06'},
              {text: 'July', value: '07'},
              {text: 'August', value: '08'},
              {text: 'September', value: '09'},
              {text: 'October', value: '10'},
              {text: 'November', value: '11'},
              {text: 'December', value: '12'}
          ],
            onFilter: (value, record) => record.dateCreated.indexOf(value) === 0
        },
        {
            title: 'Deadline',
            dataIndex: 'deadline',
            key: 'deadline',
            // width:'110px',
            filters: [{text: 'January', value: '01'},
              {text: 'February', value: '02'},
              {text: 'March', value: '03'},
              {text: 'April', value: '04'},
              {text: 'May', value: '05'},
              {text: 'June', value: '06'},
              {text: 'July', value: '07'},
              {text: 'August', value: '08'},
              {text: 'September', value: '09'},
              {text: 'October', value: '10'},
              {text: 'November', value: '11'},
              {text: 'December', value: '12'}
          ],
            onFilter: (value, record) => record.deadline.indexOf(value) === 0
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            // width:'110px',
            filters: [
                { text: 'Completed', value: 'COMPLETED' },
                { text: 'Ongoing', value: 'ONGOING' },
              ],
              onFilter: (value, record) => record.status.indexOf(value) === 0,
              render: status => (
                <span>
                  {status.map(stat => {
                    let color = stat === 'ONGOING' ? 'geekblue' : 'green';                    
                    let iconState = color === 'green' ? true : false;
                    return (
                      <Tag icon={iconState ? <CheckCircleOutlined/> :<SyncOutlined spin/>} color={color} key={stat}>
                        {stat}
                      </Tag>
                    );
                  })}
                </span>
              ),
        },
        {
          title: 'Active',
          dataIndex: 'active',
          key: 'active',
          // width:'90px',
          filters: [
              { text: 'True', value: 'true' },
              { text: 'False', value: 'false' },
          ],
          onFilter: (value, record) => record.active.indexOf(value) === 0,
          render: active => (
            <span>
              {active.map(activeStat => {
                let isActive = activeStat === 'true' ? true : false;
                let color = isActive === true ? 'green' : 'error';
                return (
                  <Tag icon={isActive ? <CheckCircleOutlined/> : <ExclamationOutlined/>} color={color} key={isActive}>
                    {activeStat.toUpperCase()}
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
          // width: '70px',
          render: (text, record, index) => <Button className='editButton' type='link'
              onClick={()=>{
                  setProps(record)
                  setIsModalVisible(true)
              }}
          >Edit</Button>
          },
      ];

      const handleCancel = () => {
        setIsModalVisible(false);
      };

      const edit_data = (data) => {
        let objIndex = state.findIndex((obj => obj.key === data.taskId));
          state[objIndex].assignee = data.assignee
          state[objIndex].assigneeName = data.assigneeName
          state[objIndex].lastUpdated = moment(Date.now).format('MM-DD-YYYY')
          state[objIndex].title = data.title
          state[objIndex].description = data.description
          state[objIndex].status = data.status
          state[objIndex].active = data.active
          state[objIndex].objectives = data.objective
          state[objIndex].deadline = moment(data.deadline).format('MM-DD-YYYY')
          state[objIndex].verification = data.verification
          state[objIndex].progress = data.progress
      }
    return (
        <div>
            <LayoutComponent>
                <Table className='hatdog' size="small"  dataSource={state} columns={columns}></Table>
            </LayoutComponent>
            <Modal title="Edit Task" visible={isModalVisible} footer={null} onCancel={handleCancel}>
                <Edittask data={props} func={edit_data}/>
            </Modal>
        </div>
    )
}

export default Tasks
