import React, {useState, useEffect} from 'react'
import { Button, Empty, Modal, Upload, Input, Form, Table, Space, Image, Popconfirm } from 'antd';
import { UploadOutlined, SearchOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import '../styles/CSS/Userdash.css'
//import Cookies from 'universal-cookie';
import Highlighter from 'react-highlight-words';

const OfflineGallery = () => {
  //const cookies = new Cookies();
  const userObj = useSelector(state => state.user)
  const [images, setImages] = useState([])
  const [caption, setCaption] = useState()
  const [visible, setVisible] = useState(false);
  const [lStorage, setlStorage] = useState([])
  const [search, setSearch] = useState({searchText: '', searchedColumn:''})
    

  //const data = new FormData()
  const initialValues = { caption: '', data: ''}
  const [form] = Form.useForm();

  function getBase64 (file, callback) {

    const reader = new FileReader();

    reader.addEventListener('load', () => callback(reader.result));

    reader.readAsDataURL(file);
  }

  const upload = async(value)=>{
    try {
      getBase64(value.image.fileList[0].originFileObj, function(base64Data){
        // console.log("Base64 of file is", base64Data); // Here you can have your code which uses Base64 for its operation, // file to Base64 by oneshubh
        setlStorage([...lStorage, {
          file: base64Data,
          caption: caption,
        }])
      });

      setImages([...images, 
        {
          key: images.length + 1,
          caption: value.caption,
          image: URL.createObjectURL(value.image.fileList[0].originFileObj)
        }
      ])
      form.resetFields()
    } catch (error) {
        alert(error)
    }
  }

  useEffect(() => {
    //localStorage.removeItem("gallery");
    localStorage.setItem("gallery", JSON.stringify(lStorage));
    //console.log('gallery: ', localStorage.getItem('gallery'));
  }, [lStorage])

   /* useEffect(() => {
        console.log('gallery: ', cookies.get('gallery'));
        let y = cookies.get('gallery')
        console.log('y:', y)
    }, [])*/

  const handleRemove = (key) => { //deleting datasheet
      let newData = images.filter((tempData) => {
        return tempData.key !== key
      })
      const newCookie = lStorage.splice(key, 1);
      setImages(newData)
      setlStorage(newCookie)
      //console.log('new cookie: ',lStorage)
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

  const galleryCollumn = [
      {
        title: 'Image',
        dataIndex: 'image',
        key: 'image',
        render: (image) => 
            <div>
                <Image src={image}></Image>
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
        title: 'Action',
        dataIndex: 'action',
        key: 'action',
        render: (text, record, index) => 
            <div>
                <Popconfirm title="Sure to delete?" onConfirm = {
                    async (key) => {
                            handleRemove(record.key)
                        }
                }>
                    <Button danger type='link'>Delete</Button>
                </Popconfirm>
            </div>
        },
    ];

    
    return (
      <div>
        <div>
          <Button icon={<UploadOutlined />} style={{background:'#A0BF85', display: userObj.USER.category === 'director' ? 'none' : 'initial'}}  onClick={() => setVisible(true)}>
              Upload
          </Button>
          <Modal title='Upload Gallery Image' visible={visible} onCancel={() => setVisible(false)} centered footer={null}>
            <Form onFinish={upload} initialValues={initialValues} form={form}>
              <Form.Item label="Caption:" name='caption'>
                  <Input onChange={e => setCaption(e.target.value)} value={caption}/>
              </Form.Item>
              <Form.Item name='image' label='Select File:'>
                  <Upload maxCount={1} id='up'>
                      <Button icon={<UploadOutlined />}>Choose file to upload</Button>
                  </Upload>
              </Form.Item>
              <Form.Item>
                  <Button block htmlType='submit' style={{background: "#A0BF85", borderRadius: "5px"}}>Upload</Button>
              </Form.Item>
            </Form>
          </Modal>
          {images.length === 0 ? <Empty/> : <Table dataSource={images} size='small' columns={galleryCollumn} />}
        </div>
      </div>
    )
}

export default OfflineGallery
