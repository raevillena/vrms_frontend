import React, {useEffect, useState} from 'react'
import LayoutComponent from './layout'
import {Table, Card, Button, Image, Space, Input, Modal} from 'antd'
import { onGetAllFileTaskAdmin } from '../services/taskAPI'
import moment from 'moment'
import { onGetGalleryAdmin } from '../services/studyAPI'
import Highlighter from 'react-highlight-words';
import {SearchOutlined} from '@ant-design/icons';
import EditGallery from './editgallery'
import EditFileTask from './editfiletask'


const Files = () => {
    const [fileTaskData, setfileTaskData] = useState()
    const [galleryData, setGalleryData] = useState()
    const [search, setSearch] = useState({searchText: '', searchedColumn:''})
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [isModalVisible2, setIsModalVisible2] = useState(false)
    const [galleryProps, setgalleryProps] = useState()
    const [fileTaskProps, setFileTaskProps] = useState()

    useEffect(() => {
       async function getData(){
        let resTaskFile = await onGetAllFileTaskAdmin()
        let resGallery = await onGetGalleryAdmin()
        let taskfile = resTaskFile.data
        let galleryFile = resGallery.data
        let temptaskFile = []
        let tempGalleryFile = []
        for (let i = 0; i < taskfile.length; i++) {
            temptaskFile.push({
                key : taskfile[i]._id,
                description: taskfile[i].description,
                taskID: taskfile[i].taskID,
                uploadedBy: taskfile[i].uploadedByName,
                uploadedByID: taskfile[i].uploadedByID,
                uploadDate : moment(taskfile[i].uploadDate).format('MM-DD-YYYY'),
                active: taskfile[i].active.toString()
            })
        }
        setfileTaskData(temptaskFile)
        for (let i = 0; i < galleryFile.length; i++) {
            tempGalleryFile.push({
                key: galleryFile[i]._id,
                studyID: galleryFile[i].studyID,
                caption: galleryFile[i].caption,
                active: galleryFile[i].active.toString(),
                image: galleryFile[i].images
            })
        }
        setGalleryData(tempGalleryFile)
       }
       getData()
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

    const fileColumn = [
        {
          title: 'File Description',
          dataIndex: 'description',
          key: 'description',
          ...getColumnSearchProps('description'),
          ellipsis: true,
        },
        {
          title: 'Uploaded By',
          dataIndex: 'uploadedBy',
          key: 'uploadedBy',
          ...getColumnSearchProps('uploadedBy'),
          ellipsis: true,
          
        },
        {
            title: 'Task ID',
            dataIndex: 'taskID',
            ...getColumnSearchProps('taskID'),
            key: 'taskID',
          },
        {
          title: 'Date Uploaded',
          dataIndex: 'uploadDate',
          key: 'uploadDate',
          ellipsis: true,
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
            render: (text, record, index) => 
                <div>
                    <Button type='link' onClick={()=>{
                        setFileTaskProps(record)
                        setIsModalVisible2(true)
                    }}>Edit</Button>
                </div>
            },
      ];

      const galleryCollumn = [
        {
            title: 'Image',
            dataIndex: 'image',
            key: 'image',
            render: (image) => 
                <div>
                    <Image src={`http://nberic.org/gallery/${image}`}></Image>
                </div>
            },
        {
          title: 'Caption',
          dataIndex: 'caption',
          key: 'caption',
          ...getColumnSearchProps('caption'),
          ellipsis: true,
        },
        {
          title: 'Study ID',
          dataIndex: 'studyID',
          key: 'studyID',
          ...getColumnSearchProps('studyID'),
          ellipsis: true,
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
            render: (text, record, index) => 
                <div>
                    <Button type='link' onClick={()=>{
                        console.log(record)
                        setgalleryProps(record)
                        setIsModalVisible(true)
                    }}>Edit</Button>
                </div>
            },
      ];

      const handleCancel = () => {
        setIsModalVisible(false);
        setgalleryProps('')
      };
      const handleCancel2 = () => {
        setIsModalVisible2(false);
        setFileTaskProps('')
      };

      const edit_data = (data) => {
        console.log('data',data)
      let objIndex = galleryData.findIndex((obj => obj.key === data.id));
      console.log(objIndex)
      galleryData[objIndex].caption = data.caption
      galleryData[objIndex].studyID = data.studyID
      galleryData[objIndex].active = data.active
    }

    const edit_data2 = (data) => {
        console.log('data',data)
      let objIndex = fileTaskData.findIndex((obj => obj.key === data.id));
      console.log(objIndex)
      fileTaskData[objIndex].description = data.description
      fileTaskData[objIndex].taskID = data.taskID
      fileTaskData[objIndex].active = data.active
    }

    return (
        <div>
           <LayoutComponent>
                <Card title='Gallery'>
                    <Table dataSource={galleryData} size='small' columns={galleryCollumn} />
                </Card>
                <Card title='Tasks Files'>
                    <Table dataSource={fileTaskData} size='small' columns={fileColumn} />
                </Card>
            </LayoutComponent> 
            <Modal title='Edit Gallery' visible={isModalVisible} footer={null} onCancel={handleCancel} >
                <EditGallery data={galleryProps} func={edit_data}/>
            </Modal>
            <Modal title='Edit File Task' visible={isModalVisible2} footer={null} onCancel={handleCancel2} >
                <EditFileTask data={fileTaskProps} func2={edit_data2}/>
            </Modal>
        </div>
    )
}

export default Files
