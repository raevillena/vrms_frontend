import React, {useEffect, useState, useMemo, useRef} from 'react';
import { Table, Button, Popconfirm, Form, Spin, Tooltip, Modal, Empty, Tabs, Space, Input } from 'antd';
import { DeleteFilled, EditFilled, DownloadOutlined, InfoCircleFilled, HistoryOutlined, EyeOutlined, SearchOutlined } from '@ant-design/icons';
import { onDeleteDatagrid, onDownloadHistory, onEditDatagrid, onGetDatagrid, onGetDownloadHistory, onGetEditHistory, onGetViewHistory, onViewLog } from '../services/studyAPI';
import { useSelector} from 'react-redux';
import moment from 'moment';
import EditDatagrid from './EditDatagrid'
import '../styles/CSS/Userdash.css'
import { notif, downloadCSVonGrid } from '../functions/datagrid';
import { join, view } from '../services/socket';
import ViewDatagrid from './ViewDatagrid';
import Highlighter from 'react-highlight-words';

const { TabPane } = Tabs;

const GridTable = (props) => {

  const timerIdRef2= useRef(0);

    const studyObj = useSelector(state => state.study)
    const userObj = useSelector(state => state.user)
    const [tableData, setTableData] = useState([])
    const [loading, setLoading] = useState(false)
    const [editData, setEditData] = useState()
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isViewModalVisible, setIsViewModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [isEditHisModalVisible, setIsEditHisModalVisible] = useState(false);
    const [history, setHistory] = useState([])
    const [editHistory, setEditHistory] = useState([])
    const [viewHistory, setViewHistory] = useState([])
    const [loadingModal, setLoadingModal] = useState(false)
    const [search, setSearch] = useState({searchText: '', searchedColumn:''})

    const handleRemove = (key) => { //deleting datasheet
        let newData = tableData.filter((tempData) => {
          return tempData.key !== key
        })
        setTableData(newData)
      }

    const finaldata = useMemo(() => tableData, [tableData]) //final table data

  useEffect(() => { //getting data
    async function getDatagridData(){ //displaying data in table
        let ID = {studyID: studyObj.STUDY.studyID}
        setLoading(true)
        let result =await onGetDatagrid(ID)
        let x = result.data
        let tempTableData = []
        for(let i = 0; i < x.length; i++){ 
          tempTableData.push({
            key: x[i]._id,
            id: [i],
            tableID: x[i].tableID,
            title: x[i].title,
            description: x[i].description,
            dateCreated: moment(x[i].dateCreated).format('MM-DD-YYYY'),
            dateUpdated: moment(x[i].dateUpdated).format('MM-DD-YYYY'),
          });
        }
        setTableData(tempTableData)
        setLoading(false)
    }
    getDatagridData()
  }, [studyObj.STUDY.studyID])

  const showModal = async(id) => {
    setLoadingModal(true)
    let result = await onGetDownloadHistory({tableID: id.tableID})
    let history = result.data.history
    let tempHistory = []
        for(let i = 0; i < history.length; i++){ 
          tempHistory.push({
            key: history[i]._id,
            downloadedBy: history[i].downloadedBy,
            downloadDate: moment(history[i].downloadDate).format('YYYY-MM-DD HH:mm:ss'),
          });
        }
        setHistory(tempHistory)
    setIsModalVisible(true);
    setLoadingModal(false)
  };

  const showModalEditHis = async(id) => {
    setLoadingModal(true)
    let result = await onGetEditHistory({tableID: id.tableID})
    let resultView = await onGetViewHistory({tableID: id.tableID})
    let history = result.data.history
    let historyView = resultView.data.history
    let tempHistory = []
    let tempView = []
        for(let i = 0; i < history.length; i++){ 
          tempHistory.push({
            key: history[i]._id,
            editedBy: history[i].editedBy,
            editDate: moment(history[i].editDate).format('YYYY-MM-DD HH:mm:ss'),
          });
        }
        for(let i = 0; i < historyView.length; i++){ 
          tempView.push({
            key: historyView[i]._id,
            viewBy: historyView[i].viewBy,
            viewDate: moment(historyView[i].viewDate).format('YYYY-MM-DD HH:mm:ss'),
          });
        }
    setEditHistory(tempHistory)
    setViewHistory(tempView)
    setIsEditHisModalVisible(true)
    setLoadingModal(false)
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleOkEditHistoy = () => {
    setIsEditHisModalVisible(false);
  };

  const handleCancelEditHistory = () => {
    setIsEditHisModalVisible(false);
  };

  const showModalEdit = () => {
      setIsEditModalVisible(true)
      timerIdRef2.current = setInterval( () => document.getElementById('backup').click(), 3600000);
  };

  const handleCancelEdit = () => {
    setIsEditModalVisible(false)
    join(editData.id.tableID, userObj.USER._id, false)
    clearInterval(timerIdRef2.current);
    timerIdRef2.current = 0;
  };

  const showModalView = () => {
    setIsViewModalVisible(true)
  };

const handleCancelView = () => {
  setIsViewModalVisible(false)
  join(editData.id.tableID, userObj.USER._id, false)
};



  useEffect(() => { //displaying the added table
    if(props.data == null||undefined||''){
        return
    }else{
    setTableData([...tableData, {key: tableData.length + 1,
        id: tableData.length + 1,
        tableID:props.data.tableID,
        title: props.data.title,
        description: props.data.description,
        dateCreated: moment(props.data.dateCreated).format('MM-DD-YYYY'),
        dateUpdated: moment(props.data.dateUpdated).format('MM-DD-YYYY'),
    }])
    async function getDatagridData(){ //displaying data in table
        let ID = {studyID: studyObj.STUDY.studyID}
        setLoading(true)
        let result =await onGetDatagrid(ID)
        let x = result.data
        let tempTableData = []
        for(let i = 0; i < x.length; i++){ 
          tempTableData.push({
            key: x[i]._id,
            id: [i],
            tableID: x[i].tableID,
            title: x[i].title,
            description: x[i].description,
            dateCreated: moment(x[i].dateCreated).format('MM-DD-YYYY'),
            dateUpdated: moment(x[i].dateUpdated).format('MM-DD-YYYY'),
          });
        }
        setTableData(tempTableData)
        setLoading(false)
    }
    getDatagridData()
    }
   }, [props.data, studyObj.STUDY.studyID])


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

   const historyColumns=[
    {
      title: 'Downloader',
      width: '50%',
      dataIndex: 'downloadedBy',
      key: 'downloadedBy',
    },
    {
      title: 'Download Date',
      width: '50%',
      dataIndex: 'downloadDate',
      key: 'downloadDate',
    }
  ]

  const editHistoryColumns=[
    {
      title: 'Editor',
      width: '50%',
      dataIndex: 'editedBy',
      key: 'editedBy',
    },
    {
      title: 'Edit Date',
      width: '50%',
      dataIndex: 'editDate',
      key: 'editDate',
    }
  ]

  const viewHistoryColumns=[
    {
      title: 'Viewer',
      width: '50%',
      dataIndex: 'viewBy',
      key: 'viewBy',
    },
    {
      title: 'View Date',
      width: '50%',
      dataIndex: 'viewDate',
      key: 'viewDate',
    }
  ]

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
          width: '25%',
          dataIndex: 'title',
          key: 'title',
          ...getColumnSearchProps('title'),
          ellipsis: true
        },
        {
            title: 'Description',
            width: '25%',
            dataIndex: 'description',
            ...getColumnSearchProps('description'),
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
            title: 'Date Updated',
            width: '10%',
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
            onFilter: (value, record) => record.dateUpdated.indexOf(value) === 0
        },
        {
          title: 'Action',
          key: 'operation',
          fixed: 'right',
          width: '20%',
          render: (text, record, index) => 
          <Space>
            <Form style={{display:'flex', gap:'5px'}}>
              <div>
                <Tooltip title='Download table in CSV' placement='top'>
                <Button  onClick={async (e) => {
                    let id ={tableID: record.tableID}
                    let result = await onEditDatagrid(id)
                    let x = result.data
                    downloadCSVonGrid(x)
                    let resultDownload = await onDownloadHistory({user: userObj.USER.name,  id})
                    notif("info", resultDownload.data.message)
                }} icon={<DownloadOutlined/>}></Button>
                </Tooltip>
              </div>
              <div>
              <Tooltip title='Edit table' placement='top'>
                <Button style={{display: userObj.USER.category === 'director' ? 'none' : 'initial'}}  onClick = {
                  async (e) => {
                      let id ={tableID: record.tableID}
                      setEditData({id:id})
                      onViewLog({user: userObj.USER.name, id: record.tableID })
                      join(record.tableID, userObj.USER._id, true)
                      showModalEdit()
                  }
                }   icon={<EditFilled />}></Button>
              </Tooltip>
            </div>
            <div>
              <Tooltip title='View table' placement='top'>
                <Button onClick = {
                  async (e) => {
                      let id ={tableID: record.tableID}
                      view(record.tableID, userObj.USER.name)
                      onViewLog({user: userObj.USER.name, id: record.tableID })
                      setEditData({id:id})
                      showModalView(true)
                  }
                }   icon={<EyeOutlined />}></Button>
              </Tooltip>
            </div>
            <div>
              <Tooltip title='View Download History' placement='top'>
                <Button onClick={()=>{
                  let id ={tableID: record.tableID}
                  showModal(id)}} icon={<InfoCircleFilled />}/>
              </Tooltip>
            </div>
            <div>
              <Tooltip title='View Access History' placement='top'>
                <Button onClick={()=>{
                  let id ={tableID: record.tableID}
                  showModalEditHis(id)}} icon={<HistoryOutlined />}/>
              </Tooltip>
            </div>
            <div>
              <Tooltip title='Delete table' placement='top'>
                <Popconfirm title="Sure to delete?" onConfirm = {
                  async (key) => {
                        let id ={_id: record.key, user: userObj.USER._id}
                        await onDeleteDatagrid(id)
                        await handleRemove(record.key)
                        notif("error", "Deleted")
                    }
                  }>
                  <Button style={{display: userObj.USER.category === 'director' ? 'none' : 'initial'}} danger icon={<DeleteFilled />}></Button>
                </Popconfirm>
              </Tooltip>
            </div>
        </Form>
        </Space>,
                    
        },
      ];

      const new_data = (data) => {
        let objIndex = finaldata.findIndex((obj => obj.tableID === data.id));
        finaldata[objIndex].title = data.data.title
        finaldata[objIndex].description = data.data.description
        finaldata[objIndex].dateUpdated = moment(Date.now()).format('MM-DD-YYYY')
      }

    return (
        <div>
            {loading ?  <div className="spinner"><Spin /> </div> : 
            <div> 
              <Table scroll={{ x: 1000, y: 500 }} columns={columns} dataSource={finaldata} /> 
            </div>
            }
             <Modal visible={isEditModalVisible} footer={null} onCancel={handleCancelEdit} width={1500} title="Edit Table">
                <EditDatagrid data={editData} func={new_data}/>
            </Modal>

            <Modal visible={isViewModalVisible} footer={null} onCancel={handleCancelView} width={1500} title="View Table">
                <ViewDatagrid data={editData}/>
            </Modal>
            <Modal title="Download History" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
              {loadingModal? <div className="spinner"><Spin /> </div> : <div>
                {history.length === 0 ? <Empty/> : 
                <div style={{justifyContent: 'center', alignItems: 'center'}}> 
                  <Table pagination={false} scroll={{y: 500}} columns={historyColumns} dataSource={history} />
                </div>
                }
                </div>}
            </Modal>

            <Modal title="Access History" visible={isEditHisModalVisible} onOk={handleOkEditHistoy} onCancel={handleCancelEditHistory}>
              <Tabs>
                <TabPane tab="Edit History" key="1">
                  {loadingModal? <div className="spinner"><Spin /> </div> : <div>
                    {editHistory.length === 0 ? <Empty/> : 
                    <div style={{justifyContent: 'center', alignItems: 'center'}}> 
                      <Table pagination={false} scroll={{y: 500}} columns={editHistoryColumns} dataSource={editHistory} />
                    </div>
                    }
                    </div>}
                </TabPane>
                <TabPane tab="View History" key="2">
                  {loadingModal? <div className="spinner"><Spin /> </div> : <div>
                    {viewHistory.length === 0 ? <Empty/> : 
                    <div style={{justifyContent: 'center', alignItems: 'center'}}> 
                      <Table pagination={false} scroll={{y: 500}} columns={viewHistoryColumns} dataSource={viewHistory} />
                    </div>
                    }
                    </div>}
                </TabPane>
              </Tabs>
            </Modal>
        </div>
    )
}

export default GridTable
