import React, {useEffect, useState, useMemo} from 'react';
import { Table, Button, Popconfirm, Form, Spin, notification, Tooltip, Modal, Empty } from 'antd';
import { DeleteFilled, EditFilled, DownloadOutlined, InfoCircleFilled } from '@ant-design/icons';
import { onDeleteDatagrid, onDownloadHistory, onEditDatagrid, onGetDatagrid, onGetDownloadHistory } from '../services/studyAPI';
import { useSelector} from 'react-redux';
import moment from 'moment';
import EditDatagrid from './EditDatagrid'
import '../styles/CSS/Userdash.css'


const GridTable = (props) => {
    const studyObj = useSelector(state => state.study)
    const userObj = useSelector(state => state.user)
    const [tableData, setTableData] = useState([])
    const [loading, setLoading] = useState(false)
    const [editData, setEditData] = useState()
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [history, setHistory] = useState([])
    const [loadingModal, setLoadingModal] = useState(false)
  

    const notif = (type, message) => {
      notification[type]({
        message: 'Notification',
        description:
          message,
      });
    };

    const handleRemove = (key) => { //deleting datasheet
        let newData = tableData.filter((tempData) => {
          return tempData.key !== key
        })
        setTableData(newData)
        console.log("data", tableData)
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
            key: x[i],
            tableID: x[i]._id,
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
    console.log(id)
    setLoadingModal(true)
    let result = await onGetDownloadHistory({tableID: id._id})
    console.log('download his', result.data.history)
    let history = result.data.history
    let tempHistory = []
        for(let i = 0; i < history.length; i++){ 
          tempHistory.push({
            downloadedBy: history[i].downloadedBy,
            downloadDate: moment(history[i].downloadDate).format('YYYY-MM-DD HH:mm:ss'),
          });
        }
        setHistory(tempHistory)
    setIsModalVisible(true);
    setLoadingModal(false)
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  async function downloadCSV(data){
    console.log('data', data)
    let toDownload = data[0].data
    let csv = ''
    let keys = Object.keys(data[0].data[0])
    console.log('keys', keys)
    keys.forEach((key) => {
      csv += key + ","
    })
    csv += "\n"

    toDownload.forEach((datarow) => {
      keys.forEach((key)=>{
        csv += datarow[key] + ","
      })
      csv += "\n"
    });
      const element = document.createElement('a')
      const file = new Blob([csv], {type: 'data:text/csv;charset=utf-8'})
      element.href = URL.createObjectURL(file)
      element.download = `${data[0].title}.csv`
      document.body.appendChild(element)
      element.click()
  }

  useEffect(() => { //displaying the added table
    if(props.data == null||undefined||''){
        return
    }else{
    setTableData([...tableData, {key: tableData.length + 1,
        tableID:props.data._id,
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
            key: x[i],
            tableID: x[i]._id,
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

   
    const columns = [
        {
          title: 'Table ID',
          width: '10%',
          dataIndex: 'tableID',
          key: 'tableID',
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
          width: '20%',
          render: (text, record, index) => 
            <Form style={{display:'flex', gap:'5px'}}>
              <div>
                <Tooltip title='Download table in CSV' placement='top'>
                <Button  onClick={async (e) => {
                    let id ={_id: record.key._id}
                    let result = await onEditDatagrid(id)
                    let x = result.data
                    downloadCSV(x)
                    let resultDownload = await onDownloadHistory({user: userObj.USER.name, tableID: id})
                    notif("info", resultDownload.data.message)
                }} icon={<DownloadOutlined/>}></Button>
                </Tooltip>
              </div>
              <Tooltip title='Edit table' placement='top'>
          <Button onClick = {
           async (e) => {
                let id ={_id: record.key._id}
                setEditData({id:id, display: 'block'})
            }
          }   icon={<EditFilled />}></Button>
          </Tooltip>
          <Tooltip title='Delete table' placement='top'>
          <Popconfirm title="Sure to delete?" onConfirm = {
           async (key) => {
                let id ={_id: record.key._id}
                let result = await onDeleteDatagrid(id)
                console.log('res',result)
                await handleRemove(record.key)
                notif("error", "Deleted")
            }
          }>
          <Button danger icon={<DeleteFilled />}></Button>
        </Popconfirm>
        </Tooltip>
        <Tooltip title='View Download History' placement='top'>
          <Button onClick={()=>{
            let id ={_id: record.key._id}
            showModal(id)}} icon={<InfoCircleFilled />}/>
        </Tooltip>
        </Form>,
                    
        },
      ];



    return (
        <div style={{marginTop: '20px'}}>
            {loading ?  <div className="spinner"><Spin /> </div> : <div> 
            <Table scroll={{ x: 1300, y: 500 }} columns={columns} dataSource={finaldata} /> 
            </div>
           }
            <EditDatagrid data={editData}/>
            <Modal title="Add Study" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
              {loadingModal? <div className="spinner"><Spin /> </div> : <div>
                {history.length === 0 ? <Empty/> : 
                <div style={{justifyContent: 'center', alignItems: 'center'}}> 
                  {history.map(hist => <div className="div-flex">
                    <p>{hist.downloadedBy}</p>
                    <p>{hist.downloadDate}</p>
                  </div>)}
                </div>
                }
                </div>}
            </Modal>
        </div>
    )
}

export default GridTable
