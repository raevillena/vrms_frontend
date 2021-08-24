import React, {useState, useEffect, useMemo} from 'react'
import { Card, WingBlank, WhiteSpace} from 'antd-mobile';
import {SnippetsFilled, EditFilled, DeleteFilled, DownloadOutlined} from '@ant-design/icons';
import { Button, Modal } from 'antd';
import { onDeleteDatagrid, onEditDatagrid, onGetDatagrid } from '../../services/studyAPI';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { Spin, Popconfirm,notification } from 'antd';
import { CSVLink } from 'react-csv'
import EditDatagrid from './EditDatagrid';
import '/Users/user/vrms/vrms_frontend/src/styles/CSS/Mobile.css'

const GridTable = (props) => {
    const studyObj = useSelector(state => state.study)//redux study

    const [tableData, setTableData] = useState([])
    const [loading, setLoading] = useState(false)
    const [dataDownlaod, setDataDownload] = useState([])
    const [editData, setEditData] = useState([])
    const [isModalVisible, setIsModalVisible] = useState(false) //modal 

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

    const handleRemove = (key) => { //deleting datasheet
      let newData = tableData.filter((tempData) => {
        return tempData.key !== key
      })
      setTableData(newData)
    }
    
  useEffect(() => { //getting data
    getDatagridData()
  }, [])


  useEffect(async () => { //displaying the added table
    console.log('props', props)
    if(props.data == null|undefined|''){
        return
    }else{
     setTableData([...tableData, {
      tableID:props.data._id,
      title: props.data.title,
      description: props.data.description,
      dateCreated: moment(props.data.dateCreated).format('MM-DD-YYYY'),
      dateUpdated: moment(props.data.dateUpdated).format('MM-DD-YYYY'),
    }])
    setLoading(true)
    await getDatagridData()
    console.log('added')
    setLoading(false)
    }
   }, [props])


  const notif = (type, message) => {
    notification[type]({
      message: 'Notification',
      description:
        message,
    });
  };

  const showTable = () => { //for edit table
    setIsModalVisible(true);
  };

  const handleOk = () => { //modal
    setIsModalVisible(false);
  };

  const handleCancel = () => {//modal
    setIsModalVisible(false);
  };


    return (
        <div style={{position: 'relative'}}>
           <Modal title="Edit Table" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                    <EditDatagrid data={editData}/>
            </Modal>
          {loading ?  <Spin style={{display: 'flex', justifyContent:'center', padding: '25%'}} />: <div>
            {tableData.map(data=>( 
              <WingBlank size="lg">
              <WhiteSpace size="lg" />
              <Card>
              <Card.Header
                  title={data.title}
                  thumb={<SnippetsFilled/>}
                  extra={<div>
                      <Button  onClick={ async()=>{
                          let result = await onEditDatagrid({_id: data.tableID})
                          let x = result.data
                          console.log(x)
                          for(let i = 0; i < x.length; i++){   
                              setDataDownload(x[i].data)
                          }
                      }}><CSVLink data={dataDownlaod} filename='VirtualResearchManagementSystemData.csv'><DownloadOutlined/></CSVLink></Button>
                      <Button onClick = {
                            async (e) => {
                            let id ={_id: data.tableID}
                           await setEditData(id)
                            showTable()  
                        }}><EditFilled /></Button>
                      <Popconfirm title="Sure to delete?" onConfirm = {
                          async () => {
                          let id ={_id: data.tableID}
                          let result = await onDeleteDatagrid(id)
                          console.log('res',result)
                          await handleRemove(data.key)
                          notif("error", "Deleted")
                        }
                      }>
                        <Button danger><DeleteFilled /></Button>
                      </Popconfirm>
                  </div>}
              />
              <Card.Body>
                  <div><label style={{fontWeight:'bolder'}}>Table ID:</label> <p>{data.tableID}</p></div>
                  <div><label style={{fontWeight:'bolder'}}>Table Desciption:</label>
                  <p>{data.description}</p>
                  </div>
              </Card.Body>
              <Card.Footer content={<label>Date Created: {data.dateCreated}</label>} extra={<label>Date Updated: {data.dateUpdated}</label>} />
              </Card>
              <WhiteSpace size="lg" />
          </WingBlank> 
            ))} 
            </div>}
        </div>
    )
}

export default GridTable
