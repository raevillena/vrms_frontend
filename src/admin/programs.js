
import LayoutComponent from './layout';
import React, {useEffect, useState} from 'react';
import { onGetAllPrograms } from '../services/projectAPI';
import {Table, Button, List, Space, Input, Modal} from 'antd'
import moment from 'moment';
import Highlighter from 'react-highlight-words';
import {SearchOutlined} from '@ant-design/icons';
import EditProgram from './editprogram';

const Programs = () => {
    const [search, setSearch] = useState({searchText: '', searchedColumn:''})
    const [programData, setProgramData]= useState(["spinme"])
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [props, setprops] = useState()

    useEffect(() => {
        async function getPrograms(){
            let programRes = await onGetAllPrograms()
            let programResult = programRes.data
            let tempProgramData = []
              for(let j = 0; j < programResult.length; j++){ 
                tempProgramData.push({
                    key:  j,
                    programID: programResult[j].programID,
                    programName: programResult[j].programName,
                    programLeader:  programResult[j].assigneeName,
                    programLeaderID:  programResult[j].assignee,
                    dateCreated: moment( programResult[j].dateCreated).format('MM-DD-YYYY'),
                    active: programResult[j].active.toString(),
                    createdBy: programResult[j].createdBy,
                    editedBy: programResult[j].editedBy,
                    status: programResult[j].status
                });
              }
            setProgramData(tempProgramData)
        }
          getPrograms()
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
            title: 'Program Leader',
            dataIndex: 'programLeader',
            key: 'programLeader',
            ...getColumnSearchProps('programLeader'),
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
            ...getColumnSearchProps('programName'),
            ellipsis: true,
          },
          {
            title: 'Program ID',
            dataIndex: 'programID',
            key: 'programID',
            ...getColumnSearchProps('programID'),
            ellipsis: true,
          },
          {
            title: 'Date Created',
            dataIndex: 'dateCreated',
            key: 'dateCreated', 
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
            render: (text, record, index) => <div style={{display: 'flex', flexDirection:'row', gap:'5px'}}>
              <Button type='link' onClick={()=>{
                 // let prop = {record, index, programs}
                  setprops(record)
                  setIsModalVisible(true)
              }}>
                Edit
              </Button>
            </div>
          },
      ];

      const handleCancel = () => {
        setIsModalVisible(false);
      };

      const edit_data = (data) => {
      let objIndex = programData.findIndex((obj => obj.programID === data.id));
      programData[objIndex].assignee = data.assignee
      programData[objIndex].assigneeName = data.assigneeName
      programData[objIndex].lastUpdated = moment(Date.now).format('MM-DD-YYYY')
      programData[objIndex].programName = data.programName
      programData[objIndex].active = data.active
      programData[objIndex].deadline = moment(data.deadline).format('MM-DD-YYYY')
    }

    return (
        <div>
            <LayoutComponent>
                <Table size="small"  dataSource={programData} columns={columns}></Table>
            </LayoutComponent>
            <Modal visible={isModalVisible} footer={null} onCancel={handleCancel} title='Edit Program'>
                <EditProgram data={props} func={edit_data}/>
            </Modal>
        </div>
    )
}

export default Programs
