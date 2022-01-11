import React, {useState, useEffect, useMemo} from 'react';
import Layout1 from '../components/components/Layout1';
import {Table, Button, Input, Space, Modal, Popconfirm} from 'antd'
import { onDeleteOfflineData, onGetOffline } from '../services/offline';
import { useSelector } from 'react-redux';
import moment from 'moment';
import Highlighter from 'react-highlight-words';
import {SearchOutlined} from '@ant-design/icons'
import ManagerOfflineData from '../components/components/ManagerOfflineData';
import UserOfflineData from '../components/components/UserOfflineData';
import { notif } from '../functions/datagrid';
import Offline from './Offline';


const OfflineData = () => {
    const [data, setData] = useState([])
    const [search, setSearch] = useState({searchText: '', searchedColumn:''})
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [manageData, setManageData] = useState({})
    const [isOnline, set_isOnline] = useState(true);
    let interval = null;
    const InternetErrMessagenger = () => set_isOnline(navigator.onLine);

    let userObj = useSelector(state => state.user)

    useEffect(() => {
      interval = setInterval(InternetErrMessagenger, 6000);
      return () => {
        clearInterval(interval)
      }
    }, [isOnline])

    const new_data = (key) => {
      let x = key.index
      let newData = data.filter((tempData) => {
        console.log('tempData',tempData)
        return tempData.id !== x
      })
      
      setData(newData)
    }

    const finaldata = useMemo(() => data, [data]) //final table data

    useEffect(() => {
        async function getData(){
            let res = await onGetOffline(userObj.USER)
            console.log(res)
            let x = res.data
            let tempData = []
            for (let i = 0; i < x.length; i++) {
                tempData.push({
                    id: [i],
                    title: x[i].title,
                    description: x[i].description,
                    dateCreated: moment(x[i].dateCreated).format('MM-DD-YYYY'),
                    dateUploaded: moment(x[i].dateUploaded).format('MM-DD-YYYY'),
                    data: x[i].data,
                    columns: x[i].columns,
                    tableID: x[i].tableID
                });
            }
            setData(tempData)
        }
        getData()
    }, [])

    const showModal = (record) => {
        setManageData(record)
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setManageData({})
    };

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
          title: 'Table ID',
          width: '10%',
          dataIndex: 'id',
          key: 'id',
          sorter: (a, b) => a.id - b.id,
        },
        {
          title: 'Title',
          width: '30%',
          dataIndex: 'title',
          key: 'title',
          ellipsis: true,
          ...getColumnSearchProps('title')
        },
        {
            title: 'Description',
            width: '25%',
            dataIndex: 'description',
            key: 'description',
            ellipsis: true
        },
        {
            title: 'Date Created',
            width: '10%',
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
            title: 'Date Uploaded',
            width: '10%',
            dataIndex: 'dateUploaded',
            key: 'dateUploaded',
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
            title: 'Action',
            key: 'operation',
            fixed: 'right',
            width: '15%',
            render: (text, record, index) => 
            <div>
              <Button onClick = {()=>{
                  showModal(record)
              }} type='link'>Manage</Button> 
              <Popconfirm title="Sure to delete?" onConfirm = {
                  async (key) => {
                        let res = await onDeleteOfflineData({tableID: record.tableID})
                        let newData = data.filter((tempData) => {
                          return tempData.id !== record.id
                        })
                        setData(newData)
                        notif("error", res.data.message)
                    }
                  }>
                  <Button danger type='link'>Delete</Button>
                </Popconfirm>   
            </div>  
          },
        ]

        

    return (
        <div>
          {isOnline !== true ? <Offline/> : 
            <Layout1>
                <Table columns={columns} dataSource={finaldata} style={{margin: '15px'}} scroll={{ x: 1500, y: 500 }}/>
            </Layout1>}
            <Modal title={manageData.title} footer={null} visible={isModalVisible} onCancel={handleCancel} width={1500}>
                {userObj.USER.category === 'manager' ? <ManagerOfflineData data={manageData} func={new_data}/> : <UserOfflineData data={manageData} func={new_data}/>}
            </Modal>
        </div>
    )
}

export default OfflineData
