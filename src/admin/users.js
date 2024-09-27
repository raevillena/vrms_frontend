
import  { useState, useEffect } from 'react';
import { onGetAllUser } from '../services/userAPI';
import LayoutComponent from './layout';
import {Table, Tag, Button, Input, Space, Modal} from 'antd'
import {SearchOutlined} from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import EditUser from './edituser';


const Users = () => {
    const [state, setstate] = useState()
    const [search, setSearch] = useState({searchText: '', searchedColumn:''})
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [props, setprops] = useState()
    useEffect(() => {
        async function getUser() {
            let res = await onGetAllUser()
            let arr = []
            let data = res.data
            for (let i = 0; i < data.length; i++) {
                arr.push({
                    key: data[i]._id,
                    name: data[i].name,
                    title: data[i].title,
                    category: [data[i].category],
                    email: data[i].email,
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
          title: 'Name',
          dataIndex: 'name',
          key: 'name',
          width:'200px',
          ...getColumnSearchProps('name')
        },
        {
          title: 'Job Title',
          dataIndex: 'title',
          key: 'title',
        },
        {
          title: 'Category',
          dataIndex: 'category',
          key: 'category',
          width:'8%',
          filters: [
            { text: 'User', value: 'user' },
            { text: 'Manager', value: 'manager' },
            { text: 'Director', value: 'director' }
          ],
          onFilter: (value, record) => record.category.indexOf(value) === 0,
          render: category => (
            <span>
              {category.map(cat => {
                let color = cat === 'user' ? 'geekblue' : 'green';
                return (
                  <Tag className='userCategory' color={color} key={cat}>
                    {cat}
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
            width: '5%',
            render: (text, record, index) => 
            <Button className='editButton' type='link' onClick={()=>{
                setprops(record)
                setIsModalVisible(true)
            }}>
                Edit
            </Button>
          },
      ];

      const handleCancel = () => {
        setIsModalVisible(false);
      };

      const edit_data = (data) => {
        let objIndex = state.findIndex((obj => obj.key === data.id));
          state[objIndex].name = data.name
          state[objIndex].title = data.title
          state[objIndex].category = [data.category]
      }

    return (
        <div>
            <LayoutComponent>
                <Table dataSource={state} size='small' columns={columns} />
            </LayoutComponent>
            <Modal title="Edit User" visible={isModalVisible} footer={null} onCancel={handleCancel}>
                <EditUser data={props} func={edit_data}/> 
            </Modal>
        </div>
    )
}

export default Users
