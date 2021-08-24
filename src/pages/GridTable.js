import React, {useEffect, useState, useMemo, useRef} from 'react';
import { Table, Button, Popconfirm, Form, Spin, notification } from 'antd';
import { DeleteFilled, EditFilled, DownloadOutlined, PlusSquareFilled } from '@ant-design/icons';
import { onDeleteDatagrid, onEditDatagrid, onGetDatagrid } from '../services/studyAPI';
import { useSelector} from 'react-redux';
import moment from 'moment';
import { CSVLink } from 'react-csv'
import EditDatagrid from './EditDatagrid'



const GridTable = (props) => {
    const studyObj = useSelector(state => state.study)
    const [tableData, setTableData] = useState([])
    const [loading, setLoading] = useState(false)
    const [dataDownlaod, setDataDownload] = useState([])
    const [editData, setEditData] = useState([])
    const csvLink = useRef()
   

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
    getDatagridData()
  }, [])

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
        },
        {
            title: 'Description',
            width: '25%',
            dataIndex: 'description',
            key: 'description',
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
                <Button  onClick={async (e) => {
                    let id ={_id: record.key._id}
                    let result = await onEditDatagrid(id)
                    let x = result.data
                    for(let i = 0; i < x.length; i++){
                      console.log(x[i].data)   
                        setDataDownload(x[i].data)
                    }
                }} icon={<DownloadOutlined/>}></Button>
                <CSVLink data={dataDownlaod} filename='VirtualResearchManagementSystemData.csv' target="_blank" ref={csvLink}/>
              </div>
          <Button onClick = {
           async (e) => {
                let id ={_id: record.key._id}
                await setEditData(id)
                showTableEdit()
            }
          }   ><EditFilled /></Button>
          <Popconfirm title="Sure to delete?" onConfirm = {
           async (key) => {
                let id ={_id: record.key._id}
                let result = await onDeleteDatagrid(id)
                console.log('res',result)
                await handleRemove(record.key)
                notif("error", "Deleted")
            }
          }>
          <Button danger><DeleteFilled /></Button>
        </Popconfirm>
        </Form>,
                    
        },
      ];

      function showTable() {
        var x = document.getElementById("table");
        if (x.style.display === "none") {
          x.style.display = "block";
        } else {
          x.style.display = "none";
        }
      }

    function showTableEdit() {
    var x = document.getElementById("table1");
    if (x.style.display === "none") {
      x.style.display = "block";
    }
  }

    return (
        <div style={{marginTop: '20px'}}>
            {loading ?  <div style={{display: 'flex', justifyContent: 'center'}}><Spin /> </div> : <div><Button onClick={showTable} style={{background:"#A0BF85"}} icon={<PlusSquareFilled />}>Add Table</Button> 
            <Table columns={columns} dataSource={finaldata} /> </div>
           }
            <EditDatagrid data={editData}/>
        </div>
    )
}

export default GridTable
