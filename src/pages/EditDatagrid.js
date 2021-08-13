import React, {useState, useEffect, useMemo, useCallback, useRef} from 'react';
import {Button, Input, Select, Image, Spin, Modal} from 'antd'
import { onUpdateDatagrid} from '../services/studyAPI';
import { useSelector} from 'react-redux';
import { DynamicDataSheetGrid, 
  checkboxColumn,
  textColumn,
  keyColumn, dateColumn} from 'react-datasheet-grid';
import {CheckSquareFilled, CameraFilled, DeleteFilled, DownloadOutlined, FontSizeOutlined, EyeFilled } from '@ant-design/icons';
import { CSVLink } from 'react-csv'
import IdleTimer from 'react-idle-timer';
import { onEditDatagrid } from '../services/studyAPI';
import { onUploadDataGrid } from '../services/uploadAPI';




const EditDataGrid = (props) => {

  const { Option } = Select

  const studyObj = useSelector(state => state.study)
  const userObj = useSelector(state => state.user)
  const idleTimerRef = useRef(null)

  const [loading, setLoading] = useState(false)
  const [title, setTitle] = useState() 
  const [description, setDescription] = useState()
  const [ data, setData ] = useState([])
  const [columnsData, setColumnsData] = useState([]) // delete columns
  const [addColumnTitle, setAddColumnTitle] = useState() //state for column title
  const [disabledColumn, setDisabledColumn] = useState(true) //disable button for adding column
  const [toRemoveColumn, setToRemoveColumn] = useState() //state to remove column
  const [tempCol, setTempCol] = useState([]) //column state
  const [isModalVisible, setIsModalVisible] = useState(false) //modal for image viewing
  const [imageFilename, setImageFilename] = useState() //to view image


const checkColumnType= (key,title) => {
    switch(key) {
        case 'checkbox':
          return { ...keyColumn(title, checkboxColumn), title: title, type: 'checkbox'}
          break;
        case 'text':
          return { ...keyColumn(title, textColumn), title: title, type: 'text'}
          break;
        case 'camera':
          return { ...keyColumn(title, cameraColumn), title: title, type: 'camera'}
          break;
        case 'date':
          return { ...keyColumn(title, dateColumn), title: title, type: 'date'}
        break;
        default:
            return { ...keyColumn(title, textColumn), title: title, type: 'text'}
            break;
      }
}

  async function getEditData(){ //edit data
    let resultDB = await onEditDatagrid(props.data)
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
  }


  useEffect(()=> { //getting data
      setLoading(true)
      getEditData()
   }, [props])

   useEffect(()=> { //loader
    setLoading(false)
  }, [])


  useEffect(()=> { //getting columns data
    getColumns()
  }, [tempCol])

  useEffect(() => { //disable buttons for adding column
    if (addColumnTitle === undefined ||addColumnTitle ==='') {
      setDisabledColumn(true);
    } else {
      setDisabledColumn(false);
    }
  }, [addColumnTitle]);


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

  const showImage = () => { //for viewing image
    setIsModalVisible(true);
  };

  const handleOk = () => { //modal
    setIsModalVisible(false);
  };

  const handleCancel = () => {//modal
    setIsModalVisible(false);
  };

  
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


  const columns = useMemo(() => tempCol, [tempCol]) //setting columns
  const createRow = useCallback(() => ({}), []) //create row
  
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
      type: 'checkbox'
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
   let newColumn = columns.filter(value => !key.includes(value.title));
    setTempCol(newColumn)
  }

  function handleColumnToDelete(value) { //setting column to delete
    setToRemoveColumn(value)
  }

  async function updateDB(){
    const dataToSend ={
      user: userObj.USER._id,
      title: title,
      description: description,
      studyID: studyObj.STUDY.studyID,
      data: data,
      columns: columns
    }
    console.log('saving')
    await onUpdateDatagrid(dataToSend)
  }


  function showTableEdit() { //show/hide table edit component
    var x = document.getElementById("table1");
    if (x.style.display === "none") {
      x.style.display = "block";
    } else {
      x.style.display = "none";
      setTitle('')
      setDescription('')
    }
  }
  
  return (
    <div>
      <div id='table1' style={{display: 'none'}}>
        <IdleTimer ref={idleTimerRef} timeout={60 * 1000} onIdle={updateDB}/>
        <h1 style={{fontFamily: 'Montserrat'}}>Edit Table</h1> 
        <div style={{display: 'flex', flexDirection: 'row', rowGap:'0px', gap:'5px', maxWidth:'100%'}}>
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
              <Button disabled={disabledColumn}  onClick={addTextColumn}><FontSizeOutlined /></Button>
              <Button disabled={disabledColumn}  onClick={addCheckboxColumn} ><CheckSquareFilled /></Button>
              <Button disabled={disabledColumn} onClick={addCameraColumn} ><CameraFilled /></Button>
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
            <Button danger onClick={() => removeColumn(toRemoveColumn)}><DeleteFilled/></Button> 
            <Button><CSVLink data={data}><DownloadOutlined/></CSVLink></Button>
          </div>
          </div>
        </div>  
        <div style={{marginTop:'20px'}}>
            {loading ? <div><DynamicDataSheetGrid
            data={data}
            onChange={setData}
            columns={columns}
            createRow={createRow}
        />
         <Modal title="View Image" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
           <div style={{display: 'grid' }}>
         <Image
              src={`http://localhost:8080/datagrid/${imageFilename}`}
            />
            <a href={`http://localhost:8080/datagrid/${imageFilename}`} download target="_blank"><Button type="primary" block icon={<DownloadOutlined/>}>Download</Button></a>
          
          </div>
          </Modal>
        </div> : <Spin style={{display: 'flex', justifyContent:'center'}} />}
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
