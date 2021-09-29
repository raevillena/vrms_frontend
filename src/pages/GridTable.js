import React, {useEffect, useState, useMemo} from 'react';
import { Table, Button, Popconfirm, Form, Spin, Tooltip, Modal, Empty } from 'antd';
import { DeleteFilled, EditFilled, DownloadOutlined, InfoCircleFilled, HistoryOutlined, EyeOutlined } from '@ant-design/icons';
import { onDeleteDatagrid, onDownloadHistory, onEditDatagrid, onGetDatagrid, onGetDownloadHistory, onGetEditHistory } from '../services/studyAPI';
import { useSelector} from 'react-redux';
import moment from 'moment';
import EditDatagrid from './EditDatagrid'
import '../styles/CSS/Userdash.css'
import { notif, downloadCSVonGrid } from '../functions/datagrid';
import { join } from '../services/socket';
import ViewDatagrid from './ViewDatagrid';


const GridTable = (props) => {
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
    const [loadingModal, setLoadingModal] = useState(false)


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
    let history = result.data.history
    let tempHistory = []
        for(let i = 0; i < history.length; i++){ 
          tempHistory.push({
            key: history[i]._id,
            editedBy: history[i].editedBy,
            editDate: moment(history[i].editedDate).format('YYYY-MM-DD HH:mm:ss'),
          });
        }
        setEditHistory(tempHistory)
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
  };

  const handleCancelEdit = () => {
    setIsEditModalVisible(false)
    join(editData.id.tableID, userObj.USER.name, false)
  };

  const showModalView = () => {
    setIsViewModalVisible(true)
  };

const handleCancelView = () => {
  setIsViewModalVisible(false)
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

    const columns = [
        {
          title: 'Table ID',
          width: '5%',
          dataIndex: 'id',
          key: 'id',
        },
        {
          title: 'Title',
          width: '25%',
          dataIndex: 'title',
          key: 'title',
          ellipsis: true
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
        },
        {
            title: 'Date Updated',
            width: '10%',
            dataIndex: 'dateUpdated',
            key: 'dateUpdated',
        },
        {
          title: 'Action',
          key: 'operation',
          fixed: 'right',
          width: '20%',
          render: (text, record, index) => 
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
                <Button onClick = {
                  async (e) => {
                      let id ={tableID: record.tableID}
                      setEditData({id:id})
                      join(record.tableID, userObj.USER.name, true)
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
                      join(record.tableID, userObj.USER.name, true)
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
              <Tooltip title='View Edit History' placement='top'>
                <Button onClick={()=>{
                  let id ={tableID: record.tableID}
                  showModalEditHis(id)}} icon={<HistoryOutlined />}/>
              </Tooltip>
            </div>
            <div>
              <Tooltip title='Delete table' placement='top'>
                <Popconfirm title="Sure to delete?" onConfirm = {
                  async (key) => {
                        let id ={_id: record.key}
                        await onDeleteDatagrid(id)
                        await handleRemove(record.key)
                        notif("error", "Deleted")
                    }
                  }>
                  <Button danger icon={<DeleteFilled />}></Button>
                </Popconfirm>
              </Tooltip>
            </div>
        </Form>,
                    
        },
      ];

    return (
        <div>
            {loading ?  <div className="spinner"><Spin /> </div> : <div> 
            <Table scroll={{ x: 1000, y: 500 }} columns={columns} dataSource={finaldata} /> 
            </div>
           }
            <Modal visible={isEditModalVisible} footer={null} onCancel={handleCancelEdit} width={1000} title="Edit Table">
                <EditDatagrid data={editData}/>
            </Modal>

            <Modal visible={isViewModalVisible} footer={null} onCancel={handleCancelView} width={1000} title="View Table">
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

            <Modal title="Edit History" visible={isEditHisModalVisible} onOk={handleOkEditHistoy} onCancel={handleCancelEditHistory}>
              {loadingModal? <div className="spinner"><Spin /> </div> : <div>
                {editHistory.length === 0 ? <Empty/> : 
                <div style={{justifyContent: 'center', alignItems: 'center'}}> 
                  <Table pagination={false} scroll={{y: 500}} columns={editHistoryColumns} dataSource={editHistory} />
                </div>
                }
                </div>}
            </Modal>
        </div>
    )
}

export default GridTable
