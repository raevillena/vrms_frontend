
import  { useState, useEffect } from 'react';
import { onGetAllUser } from '../services/userAPI';
import LayoutComponent from './layout';
import {Table, Tag, Button, Input, Space} from 'antd'
import {SearchOutlined} from '@ant-design/icons';
import Highlighter from 'react-highlight-words';


const Users = () => {
    const [state, setstate] = useState()
    const [search, setSearch] = useState({searchText: '', searchedColumn:''})
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
                    category: [data[i].category]
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
      let searchInput = ''

    const getColumnSearchProps = dataIndex => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
          <div style={{ padding: 8 }}>
            <Input
              ref={node => {
                searchInput = node;
              }}
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
                  <Tag color={color} key={cat}>
                    {cat.toUpperCase()}
                  </Tag>
                );
              })}
            </span>
          )
        },
        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
            fixed: 'right',
            width: '15%',
            render: (text, record, index) => 
            <Button type='link'>
                Edit
            </Button>
          },
      ];

     

    return (
        <div>
            <LayoutComponent>
                <Table dataSource={state} size='small' columns={columns} />
            </LayoutComponent>
        </div>
    )
}

export default Users
