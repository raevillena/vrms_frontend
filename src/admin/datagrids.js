import LayoutComponent from './layout';
import  { useState, useEffect } from 'react';
import {Table, Input, Button, Space, Modal} from 'antd'
import {SearchOutlined} from '@ant-design/icons'
import moment from 'moment';
import Highlighter from 'react-highlight-words';
import { onGetAllDatagridAdmin } from '../services/studyAPI';
import EditDatagrid from './editdatagrid';


const Datagrids = () => {
    const [state, setstate] = useState()
    const [search, setSearch] = useState({searchText: '', searchedColumn:''})
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [props, setProps] = useState()

    useEffect(() => {
        async function getTable() {
            let res = await onGetAllDatagridAdmin()
            let arr = []
            let data = res.data
            for (let i = 0; i < data.length; i++) {
                arr.push({
                    key: data[i]._id,
                    dateCreated: moment(data[i].dateCreated).format('MM-DD-YYYY'),
                    createdBy: data[i].createdBy,
                    dateUpdated: moment(data[i].dateUpdated).format('MM-DD-YYYY'),
                    updatedBy: data[i].updatedBy,
                    title: data[i].title,
                    description: data[i].description,
                    studyID: data[i].studyID,
                    active: data[i].active.toString(),
                    tableID: data[i].tableID
                })
            }
            setstate(arr)
        }
        getTable()
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
            title: 'Table Title',
            dataIndex: 'title',
            key: 'title',
            ellipsis: true,
            ...getColumnSearchProps('title')
        },
        {
            title: 'Table Description',
            dataIndex: 'description',
            key: 'description',
            ellipsis: true,
            ...getColumnSearchProps('description')
        },
        {
            title: 'Study ID',
            dataIndex: 'studyID',
            key: 'studyID',
            ...getColumnSearchProps('studyID')
        },
        {
            title: 'Table ID',
            dataIndex: 'tableID',
            key: 'tableiD',
            ...getColumnSearchProps('tableID')
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
            title: 'date Updated',
            dataIndex: 'dateUpdated',
            key: 'dateUpdated',
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
            render: (text, record, index) => <Button type='link' 
            onClick={()=>{
                setProps(record)
                setIsModalVisible(true)
            }}>Edit</Button>
          }
      ];

      const handleCancel = () => {
        setIsModalVisible(false);
      };

      const edit_data = (data) => {
        let objIndex = state.findIndex((obj => obj.tableID === data.id));
        state[objIndex].title = data.title
        state[objIndex].description = data.description
        state[objIndex].studyID = data.studyID
        state[objIndex].active = data.active
    }

    return (
        <div>
            <LayoutComponent>
                <Table size="small"  dataSource={state} columns={columns}></Table>
            </LayoutComponent>
            <Modal visible={isModalVisible} footer={null} onCancel={handleCancel} title='Edit Datagrid'>
                <EditDatagrid data={props} func={edit_data}/>
            </Modal>
        </div>
    )
}

export default Datagrids
