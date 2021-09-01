import React, {useState, useEffect, useMemo, useCallback} from 'react';
import {Button, Input, Select, Image, Spin, Modal, Tooltip, notification} from 'antd'
import { onUpdateDatagrid} from '../services/studyAPI';
import { useSelector} from 'react-redux';
import { DynamicDataSheetGrid, 
  checkboxColumn,
  textColumn,
  keyColumn} from 'react-datasheet-grid';
import {CheckSquareFilled, CameraFilled, DeleteFilled, DownloadOutlined, FontSizeOutlined, EyeFilled } from '@ant-design/icons';
import { onEditDatagrid } from '../services/studyAPI';
import { onUploadDataGrid } from '../services/uploadAPI';
import '../styles/CSS/Userdash.css'




const EditDataGrid = (props) => {

  const { Option } = Select

  const studyObj = useSelector(state => state.study)
  const userObj = useSelector(state => state.user)

  const [loading, setLoading] = useState(false)
  const [title, setTitle] = useState() 
  const [description, setDescription] = useState()
  const [ data, setData ] = useState([])
  const [display, setDisplay] = useState("none")
  const [columnsData, setColumnsData] = useState([]) // delete columns
  const [addColumnTitle, setAddColumnTitle] = useState() //state for column title
  const [disabledColumn, setDisabledColumn] = useState(true) //disable button for adding column
  const [toRemoveColumn, setToRemoveColumn] = useState() //state to remove column
  const [tempCol, setTempCol] = useState([]) //column state
  const [isModalVisible, setIsModalVisible] = useState(false) //modal for image viewing
  const [imageFilename, setImageFilename] = useState() //to view image
  const AUTOSAVE_INTERVAL = 30000;
  const columns = useMemo(() => tempCol, [tempCol]) //setting columns


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

useEffect(() => {
  const timer = setTimeout(()=>{
    async function updateDB(){
      const dataToSend ={
        user: userObj.USER.name,
        title: title,
        description: description,
        studyID: studyObj.STUDY.studyID,
        data: data,
        columns: columns
      }
      await onUpdateDatagrid(dataToSend)
      console.log('db updated datagrid')
    }
    updateDB()
  }, AUTOSAVE_INTERVAL)
  return () => clearTimeout(timer);
}, [data, userObj.USER.name, title, description, studyObj.STUDY.studyID, columns  ])



  useEffect(()=> { //getting data
  try {
    if(props.data === undefined||props.data === null|| props.data === ''){
      return
    }
    async function getEditData(){ //edit data
      console.log(props)
      setLoading(true)
      let resultDB = await onEditDatagrid(props.data.id)
      let result = resultDB.data
      let tempCols=[]
    for(let i = 0; i < result.length; i++){   
        setTitle(result[i].title)
        setDescription(result[i].description)
        setData(result[i].data) 
        for(let j = 0; j < result[i].columns.length ; j++) {
            tempCols.push(checkColumnType(result[i].columns[j].type, result[i].columns[j].title))
        }
        setTempCol(tempCols)   
    }
    setDisplay(props.data.display)
    setLoading(false)
    }
    getEditData()
  } catch (error) {
    notif('error', 'There is something wrong! Please try again!')
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
  }, [tempCol, columns])

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

  const handleOk = () => { //modal
    setIsModalVisible(false);
  };

  const handleCancel = () => {//modal
    setIsModalVisible(false);
  };

  
 
  
  const addTextColumn = () => {
    setTempCol([...columns, {
      ...keyColumn(addColumnTitle, textColumn),
      title: addColumnTitle,
      type: 'text'
    }])
    setAddColumnTitle('')
  }

  const addCheckboxColumn = () => {
    setTempCol([...columns, {
      ...keyColumn(addColumnTitle, checkboxColumn),
      title: addColumnTitle,
      type: 'Checkbox'
    }])
    setAddColumnTitle('')
  }

  const addCameraColumn = () => {
    setTempCol([...columns, {
      ...keyColumn(addColumnTitle, cameraColumn),
      title: addColumnTitle,
      type: 'camera'
    }])
    setAddColumnTitle('')
  }

  const removeColumn = (key) => { //removing column
   try {
    let newColumn = columns.filter(value => !key.includes(value.title));
    setTempCol(newColumn)
   } catch (error) {
     notif('error', error)
   }
  }

  function handleColumnToDelete(value) { //setting column to delete
    setToRemoveColumn(value)
  }

  async function updateDB(){
    const dataToSend ={
      user: userObj.USER.name,
      title: title,
      description: description,
      studyID: studyObj.STUDY.studyID,
      data: data,
      columns: columns
    }
    await onUpdateDatagrid(dataToSend)
  }


  function showTableEdit() { //show/hide table edit component
   // var x = document.getElementById("edittable");
    if (display === "none") {
      setDisplay("block")
    } else {
     setDisplay("none")
      setTitle('')
      setDescription('')
    }
  }

  async function downloadCSV(){
    let csv = ''
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
      element.download = `${title}.csv`
      document.body.appendChild(element)
      element.click()
      notif('info', 'Downloaded!')
  }
  
  return (
    <div>
      <div  style={{display: display, marginTop: '20px'}}>
        <h1 style={{fontFamily: 'Montserrat', fontSize: '20px'}}>Edit Table</h1> 
        <div className="add-grid">
          <div style={{display:'grid'}}>
            <label style={{fontSize: '20px', fontFamily:'Montserrat'}}>Table Title</label>
            <Input  placeholder="Input table title" onChange={(e)=> {setTitle(e.target.value)}} value={title}/> 
          </div>
          <div style={{display:'grid'}}>
            <label style={{fontSize: '20px', fontFamily:'Montserrat'}}>Table Description</label>
            <Input  placeholder="Enter table description" onChange={(e)=> {setDescription(e.target.value)}} value={description}></Input>
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
            {loading ?  <div className="spinner"><Spin /> </div>: 
            <div><DynamicDataSheetGrid
                data={data}
                onChange={setData}
                columns={columns}
                createRow={createRow}
            />
              <Modal title="View Image" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
              <div style={{display: 'grid' }}>
                <Image src={`http://localhost:8080/datagrid/${imageFilename}`}/>
              </div>
              </Modal>
              </div> }
        <div style={{float:'right', rowGap:'0px', gap:'5px', display:'flex', marginTop:'20px'}}>
          <Button type="primary" onClick={updateDB}>Save</Button>
          <Button danger onClick={showTableEdit}>Exit</Button>
        </div>
        </div>   
      </div>
    </div>
  )
}

export default EditDataGrid
