import LayoutComponent from './layout';
import  { useState, useEffect } from 'react';
import { onGetAllStudy } from '../services/studyAPI';
import {Table, Input, Button, Tag, Space, Progress, Modal} from 'antd'
import {SearchOutlined} from '@ant-design/icons'
import moment from 'moment';
import Highlighter from 'react-highlight-words';
import EditStudy from './editstudy';


const Studies = () => {
    const [state, setstate] = useState()
    const [search, setSearch] = useState({searchText: '', searchedColumn:''})
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [props, setprops] = useState()

    useEffect(() => {
        async function getUser() {
            let res = await onGetAllStudy()
            let arr = []
            let data = res.data
            for (let i = 0; i < data.length; i++) {
                arr.push({
                    key: data[i]._id,
                    title: data[i].studyTitle,
                    studyID: data[i].studyID,
                    dateCreated: moment(data[i].dateCreated).format('MM-DD-YYYY'),
                    dateUpdated: moment(data[i].dateUpdated).format('MM-DD-YYYY'),
                    progress: data[i].progress,
                    status: [data[i].status],
                    updatedBy: data[i].updatedBy,
                    deadline: moment(data[i].deadline).format('MM-DD-YYYY'),
                    objectives: data[i].objectives,
                    active: data[i].active.toString(),
                    budget: data[i].budget,
                    assignee: data[i].assignee,
                    assigneeName: data[i].assigneeName, 
                    projectName: data[i].projectName
                })
            }
            setstate(arr)
        }
        getUser()
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
            title: 'Study ID',
            dataIndex: 'studyID',
            key: 'studyID',
            ellipsis: true,
            ...getColumnSearchProps('studyID')
        },
        {
            title: 'Study Title',
            dataIndex: 'title',
            key: 'title',
            ellipsis: true,
            ...getColumnSearchProps('title')
        },
        {
            title: 'Date Created',
            dataIndex: 'dateCreated',
            key: 'dateCreated',
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
            title: 'Progress',
            dataIndex: 'progress',
            key: 'progress',
            render: progress=>
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
              width: '15%',
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
            title: 'Active',
            dataIndex: 'active',
            key: 'active',
            filters: [
                { text: 'True', value: 'true' },
                { text: 'False', value: 'false' },
            ],
            onFilter: (value, record) => record.active.indexOf(value) === 0,
        },
        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
            fixed: 'right',
            width: '15%',
            render: (text, record, index) => <Button type='link' onClick={()=>{
                setprops(record)
                setIsModalVisible(true)
            }}>Edit</Button>
          }
      ];

      const handleCancel = () => {
        setIsModalVisible(false);
      };

      const edit_data = (data) => {
        let objIndex = state.findIndex((obj => obj.studyID === data.study.studyID));
         state[objIndex].assignee = data.study.assignee
          state[objIndex].assigneeName = data.study.assigneeName
          state[objIndex].lastUpdated = moment(Date.now).format('MM-DD-YYYY')
          state[objIndex].title = data.value.title
          state[objIndex].status = data.value.status
          state[objIndex].active = data.value.active
          state[objIndex].objectives = data.value.objectives
          state[objIndex].deadline = moment(data.value.deadline).format('MM-DD-YYYY')
          state[objIndex].progress = data.value.progress
      }

    return (
        <div>
            <LayoutComponent>
                <Table size="small"  dataSource={state} columns={columns}></Table>
            </LayoutComponent>
            <Modal title='Edit Study' visible={isModalVisible} footer={null} onCancel={handleCancel} >
                <EditStudy data={props} func={edit_data}/>
            </Modal>
        </div>
    )
}

export default Studies
