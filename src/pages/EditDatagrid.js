import React, {useState, useEffect, useMemo, useCallback} from 'react';
import {Button, Input, Select, Image, Spin, Modal, Tooltip, notification} from 'antd'
import { onDownloadHistory, onUpdateDatagrid} from '../services/studyAPI';
import { useSelector} from 'react-redux';
import { DynamicDataSheetGrid, 
  checkboxColumn,
  textColumn,
  keyColumn} from 'react-datasheet-grid';
import {CheckSquareFilled, CameraFilled, DeleteFilled, DownloadOutlined, FontSizeOutlined, EyeFilled, LoadingOutlined } from '@ant-design/icons';
import { onEditDatagrid } from '../services/studyAPI';
import { onUploadDataGrid } from '../services/uploadAPI';
import '../styles/CSS/Userdash.css'




const EditDataGrid = (props) => {

  const { Option } = Select

  const studyObj = useSelector(state => state.study)
  const userObj = useSelector(state => state.user)

  const [datas, setDatas] = useState({title : '', description: '', data: [], tempCol: [], isLoading: true})
  const [columnsData, setColumnsData] = useState([]) // delete columns
  const [addColumnTitle, setAddColumnTitle] = useState() //state for column title
  const [disabledColumn, setDisabledColumn] = useState(true) //disable button for adding column
  const [toRemoveColumn, setToRemoveColumn] = useState() //state to remove column
  const [isModalVisible, setIsModalVisible] = useState(false) //modal for image viewing
  const [imageFilename, setImageFilename] = useState() //to view image
  const [disabled, setDisabled] = useState(false); //disable div
  const [ID, setID] = useState() //datagrid id
  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
  const columns = useMemo(() => datas.tempCol, [datas.tempCol]) //setting columns


  const notif = (type, message) => {
    notification[type]({
      message: 'Notification Title',
      description:
        message,
    });
  };

   

  const checkColumnType= (key,title) => {
      switch(key) {
          case 'Checkbox':
            return { ...keyColumn(title, checkboxColumn), title: title, type: 'Checkbox'}
          case 'text':
            return { ...keyColumn(title, textColumn), title: title, type: 'text'}
          case 'camera':
            return { ...keyColumn(title, cameraColumn), title: title, type: 'camera'}
          default:
              return { ...keyColumn(title, textColumn), title: title, type: 'text'}
        }
  }

  const CameraComponent = React.memo(
    ({ rowData, setRowData }) => {
      return (
        <div style={{display:'flex', gap:'5px'}}>
        <div>
          <Button value={rowData}><label className="file_input_id"><CameraFilled/>
          <input type="file"  accept="image/*" onChange={async e => {
                const file = e.target.files[0]
                const data = new FormData()
                data.append("file", file)
                let result = await onUploadDataGrid(data) //uploading
                setRowData(result.data.filename)
                notif('info', result.data.message)
              }
            }
            />
          </label></Button>
          
      </div>
      <div>  <Button onClick={
          async (e) => {
                setImageFilename(rowData) //set the image to view
                showImage()
            }
          }><EyeFilled /></Button></div>
      </div>     
      )
    }
  )

  const cameraColumn = {
    component: CameraComponent,
    deleteValue: () => '',
    copyValue: ({ rowData }) => rowData,
    pasteValue: ({ value }) => value,
  }

  const createRow = useCallback(() => ({}), []) //create row


  useEffect(()=> { //getting data
    console.log("triggered at useeffecy parsing data")
    try {
      if(props.data === undefined||props.data === null|| props.data === ''){
        return
      }
      async function getEditData(){ //edit data
        
        //setLoading(true)
        let resultDB = await onEditDatagrid(props.data.id)
        let result = resultDB.data
        console.log('result', result)
        setID(resultDB.data[0].tableID)
        let tempCols=[]

        
        for(let j = 0; j < result[0].columns.length ; j++) {
            tempCols.push(checkColumnType(result[0].columns[j].type, result[0].columns[j].title))
        }
        setDatas({
          ...datas, 
          title: result[0].title,
          description: result[0].description,
          data: result[0].data,
          tempCol: tempCols,
          isLoading: false
        })
        
      //setLoading(false)
      }
      getEditData()
    } catch (error) {
      notif('error', 'There is something wrong! Unable to display data!')
    }
  }, [props.data])


  useEffect(()=> { //getting columns data
     //delete columns data
  const getColumns= () =>{
    let tempColumns = []
        for(let i = 0; i < columns.length; i++){ 
            tempColumns.push({
                key: columns[i].title,
                name:  columns[i].title,
                value:  columns[i].title,
            });
        }
        setColumnsData(tempColumns)
  }
  getColumns()
  }, [columns])

  useEffect(() => { //disable buttons for adding column
    if (addColumnTitle === undefined ||addColumnTitle ==='') {
      setDisabledColumn(true);
    } else {
      setDisabledColumn(false);
    }
  }, [addColumnTitle]);

  const showImage = () => { //for viewing image
    setIsModalVisible(true);
  };

  const handleCancel = () => {//modal
    setIsModalVisible(false);
  };

  const addTextColumn = () => {
    setDatas({...datas, tempCol : [...columns, {
      ...keyColumn(addColumnTitle, textColumn),
      title: addColumnTitle,
      type: 'text'
    }]})
    setAddColumnTitle('')
  }

  const addCheckboxColumn = () => {
    setDatas({...datas, tempCol: [...columns, {
      ...keyColumn(addColumnTitle, checkboxColumn),
      title: addColumnTitle,
      type: 'Checkbox'
    }]})
    setAddColumnTitle('')
  }

  const addCameraColumn = () => {
    setDatas({...datas, tempCol: [...columns, {
      ...keyColumn(addColumnTitle, cameraColumn),
      title: addColumnTitle,
      type: 'camera'
    }]})
    setAddColumnTitle('')
  }

  const removeColumn = (key) => { //removing column
   try {
    let editCol = datas.tempCol
    let data = datas.data
    let newColumn = editCol.filter(value => !key.includes(value.title));
    setDatas({...datas, tempCol: newColumn})
    data.forEach((element) => delete element[key])
   } catch (error) {
     notif('error', error)
   }
  }

  async function updateDB(){
    const dataToSend ={
      user: userObj.USER.name,
      title: datas.title,
      description: datas.description,
      studyID: studyObj.STUDY.studyID,
      data: datas.data,
      columns: datas.tempCol
    }
    setDisabled(true)
    let result = await onUpdateDatagrid(dataToSend)
    notif('success', result.data.message)
    setDisabled(false)
  }

  let timer
  const startTimer = () =>{
    clearTimeout(timer);
    timer = setTimeout(()=>{
      updateDB()
    }, 5000)
    return () => clearTimeout(timer);
  }

  
  useEffect(() => {
    if(!datas.isLoading){
      startTimer()
      console.log('timer', timer)
    }
  }, [datas.data, datas.title, datas.description, columns])


  
  function handleColumnToDelete(value) { //setting column to delete
    setToRemoveColumn(value)
  }

  async function updateDB(){
    const dataToSend ={
      user: userObj.USER.name,
      title: datas.title,
      description: datas.description,
      studyID: studyObj.STUDY.studyID,
      data: datas.data,
      columns: columns
    }
    setDisabled(true)
    let result = await onUpdateDatagrid(dataToSend)
    notif('success', result.data.message)
    setDisabled(false)
  }


  async function downloadCSV(){
    let csv = ''
    let data = datas.data
    let keys = Object.keys(data[0])
    keys.forEach((key) => {
      csv += key + ","
    })
    csv += "\n"

    data.forEach((datarow) => {
      keys.forEach((key)=>{
        csv += datarow[key] + ","
      })
      csv += "\n"
    });
      const element = document.createElement('a')
      const file = new Blob([csv], {type: 'data:text/csv;charset=utf-8'})
      element.href = URL.createObjectURL(file)
      element.download = `${datas.title}.csv`
      document.body.appendChild(element)
      element.click()
      let id ={tableID: ID}
      console.log('studyiD', ID)
      let resultDownload = await onDownloadHistory({user: userObj.USER.name, id})
      notif('success', resultDownload.data.message)
  }
  
  return (
    <div>
      {console.log("data at return", datas)}
      <div>
        <div className="add-grid">
          <div style={{display:'grid'}}>
            <label style={{fontSize: '20px', fontFamily:'Montserrat'}}>Table Title</label>
            <Input  placeholder="Input table title" onChange={(e)=> {setDatas({...datas, title: e.target.value})}} value={datas.title}/> 
          </div>
          <div style={{display:'grid'}}>
            <label style={{fontSize: '20px', fontFamily:'Montserrat'}}>Table Description</label>
            <Input  placeholder="Enter table description" onChange={(e)=> {setDatas({...datas, description: e.target.value})}} value={datas.description}></Input>
          </div>
          <div style={{display:'grid'}}>
              <label style={{fontSize: '20px', fontFamily:'Montserrat'}}>Column Title</label>
              <div style={{display:'flex', flexDirection:'row', gap:'3px'}}>
                <Input  placeholder="Enter Column title" onChange={(e)=> {setAddColumnTitle(e.target.value)}} value={addColumnTitle}></Input>
                <Tooltip placement='top' title='Text Column'>
                  <Button disabled={disabledColumn}  onClick={addTextColumn}><FontSizeOutlined /></Button>
                </Tooltip>
                <Tooltip placement='top' title='Checkbox Column'>
                  <Button disabled={disabledColumn}  onClick={addCheckboxColumn} ><CheckSquareFilled /></Button>
                </Tooltip>
                <Tooltip placement='top' title='Camera Column'>
                  <Button disabled={disabledColumn} onClick={addCameraColumn} ><CameraFilled /></Button>
                </Tooltip>
              </div>
          </div>
          <div style={{display:'grid'}}>
          <label style={{fontSize: '20px', fontFamily:'Montserrat'}}>Delete Column </label>
          <div style={{display:'flex', flexDirection:'row', gap:'5px', width:'300px'}}>
            <Select placeholder="Select column title to delete" onChange={handleColumnToDelete} mode="tags" tokenSeparators={[',']} style={{ width: '100%' }}>
              {columnsData.map(column => (
                <Option key={column.key} value={column.value}>{column.name}</Option>
              ))}
            </Select>
              <Tooltip placement='top' title='Delete Selected Column'> 
                    <Button danger onClick={() => removeColumn(toRemoveColumn)}><DeleteFilled/></Button> 
                </Tooltip>
                <Tooltip placement='top' title='Download table in CSV'> 
                    <Button  onClick={downloadCSV}><DownloadOutlined/></Button>
                </Tooltip>
          </div>
          </div>
        </div>  
        <div style={{marginTop:'20px'}}>
            {datas.isLoading ?  <div className="spinner"><Spin indicator={antIcon}/> </div>: 
            <div style={{
              opacity: disabled ? 0.25 : 1,
              pointerEvents: disabled ? "none" : "initial"
            }}><DynamicDataSheetGrid
                data={datas.data}
                onChange={setDatas}
                //onChange={(e)=> {setDatas({...datas, data: e.target.value})}}
                columns={columns}
                createRow={createRow}
            />
            <div style={{marginTop: '20px', display:'flex', justifyContent:'flex-end'}}>
              <Button type="primary" onClick={updateDB} >Save</Button>
            </div>
              <Modal title="View Image" visible={isModalVisible} footer={null} onCancel={handleCancel}>
              <div style={{display: 'grid' }}>
                <Image src={`/datagrid/${imageFilename}`}/>
              </div>
              </Modal>
              </div> }
        </div>   
      </div>
    </div>
  )
}

export default EditDataGrid
