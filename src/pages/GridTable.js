import React, {useEffect, useState, useMemo} from 'react';
import { Table, Button, Popconfirm, Form, Spin, notification, Tooltip } from 'antd';
import { DeleteFilled, EditFilled, DownloadOutlined, PlusSquareFilled } from '@ant-design/icons';
import { onDeleteDatagrid, onEditDatagrid, onGetDatagrid } from '../services/studyAPI';
import { useSelector} from 'react-redux';
import moment from 'moment';
import EditDatagrid from './EditDatagrid'
import '../styles/CSS/Userdash.css'



const GridTable = (props) => {
    const studyObj = useSelector(state => state.study)
    const [tableData, setTableData] = useState([])
    const [loading, setLoading] = useState(false)
    const [editData, setEditData] = useState([])
   
   


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
    async function getdata(){
      getDatagridData()
    }
    getdata()
  }, [])

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
    if(props.data == null|undefined|''){
        return
    }else{
    setTableData([...tableData, {key: tableData.length + 1,
        tableID:props.data._id,
        title: props.data.title,
        description: props.data.description,
        dateCreated: moment(props.data.dateCreated).format('MM-DD-YYYY'),
        dateUpdated: moment(props.data.dateUpdated).format('MM-DD-YYYY'),
    }])
    getDatagridData()
    }
   }, [props.data])

   
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
                }} icon={<DownloadOutlined/>}></Button>
                </Tooltip>
              </div>
              <Tooltip title='Edit table' placement='top'>
          <Button onClick = {
           async (e) => {
                let id ={_id: record.key._id}
                await setEditData(id)
                showTableEdit()
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
        </Form>,
                    
        },
      ];

      function showTable() {
        var x = document.getElementById("addtable");
        console.log('x', x)
        x.style.display = x.style.display == "none" ? "block" : "none";
      }

    function showTableEdit() {
    var x = document.getElementById("edittable");
    x.style.display = x.style.display == "none" ? "block" : "none";
  }



    return (
        <div style={{marginTop: '20px'}}>
            {loading ?  <div className="spinner"><Spin /> </div> : <div><Button onClick={showTable} style={{background:"#A0BF85"}} icon={<PlusSquareFilled />}>Add Table</Button> 
            <Table scroll={{ x: 1300, y: 500 }} columns={columns} dataSource={finaldata} /> </div>
           }
            <EditDatagrid data={editData}/>
        </div>
    )
}

export default GridTable
