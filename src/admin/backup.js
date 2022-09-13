import React, {useState, useEffect} from 'react'
import LayoutComponent from './layout'
import {Table, Space, Button, Input, Popconfirm, Tag} from 'antd'
import Highlighter from 'react-highlight-words';
import {SearchOutlined, CloudDownloadOutlined, CloudServerOutlined} from '@ant-design/icons';
import moment from 'moment';
import { onGetAllBackup, onRecoverDatagridData } from '../services/studyAPI';
import { notif } from '../functions/datagrid';

const Backup = () => {
    const [state, setstate] = useState()
    const [search, setSearch] = useState({searchText: '', searchedColumn:''})
    useEffect(() => {
       async function getAllBackupData(){
           let result = await onGetAllBackup()
           let backupResult = result.data
            let tempBackupData = []
              for(let j = 0; j < backupResult.length; j++){ 
                tempBackupData.push({
                    key:  backupResult[j]._id,
                    title: backupResult[j].title,
                    data: backupResult[j].data,
                    columns:  backupResult[j].columns,
                    backupBy:  backupResult[j].backupBy,
                    backupDate: moment( backupResult[j].backupDate).format('MM-DD-YYYY HH:MM:SS'),
                    status: [backupResult[j].status],
                    description: backupResult[j].description,
                    studyID: backupResult[j].studyID,
                    tableID: backupResult[j].tableID
                });
              }
              setstate(tempBackupData)
       }
       getAllBackupData()
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
            title: 'Table ID',
            dataIndex: 'tableID',
            ...getColumnSearchProps('tableID'),
            key: 'tableID',
            ellipsis: true,
          },
          {
            title: 'Title',
            dataIndex: 'title',
            ...getColumnSearchProps('title'),
            key: 'title',
            ellipsis: true,
          },
          {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            ...getColumnSearchProps('description'),
            ellipsis: true,
            
          },
          {
            title: 'Study ID',
            dataIndex: 'studyID',
            key: 'studyID',
            ...getColumnSearchProps('studyID'),
          },
          {
            title: 'Backup Date',
            dataIndex: 'backupDate',
            key: 'backupDate',
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
          onFilter: (value, record) => record.backupDate.indexOf(value) === 0
          },
          {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            filters: [
                { text: 'Backup', value: 'BACKUP' },
                { text: 'Recovered', value: 'RECOVERED' },
              ],
              onFilter: (value, record) => record.status.indexOf(value) === 0,
              render: status => (
                <span>
                  {status.map(stat => {
                    let color = stat === 'BACKUP' ? 'geekblue' : 'green';                    
                    let iconState = color === 'green' ? true : false;
                    return (
                      <Tag icon={iconState ? <CloudDownloadOutlined /> : <CloudServerOutlined />} color={color} key={stat}>
                        {stat}
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
            render: (text, record, index) => <div style={{display: 'flex', flexDirection:'row'}}>
              <Popconfirm placement="topLeft" title='Are you sure to retrieve the data?' onConfirm={async() => {
                  let res = await onRecoverDatagridData(record)
                  notif('success', res.data.message)
              }} okText="Yes" cancelText="No">
              <Button type='primary'>Recover</Button>
              </Popconfirm>
            </div>
          },
      ];

    return (
        <div>
            <LayoutComponent>
                <Table size="small"  dataSource={state} columns={columns}></Table>
            </LayoutComponent>
        </div>
    )
}

export default Backup
