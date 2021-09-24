import React, {useState, useEffect, useMemo, useCallback} from 'react';
import {Button, Input, Select, Spin, Tooltip, Image } from 'antd'
import { useSelector} from 'react-redux';
import { DynamicDataSheetGrid, checkboxColumn,keyColumn} from 'react-datasheet-grid';
import {CheckSquareFilled, CameraFilled, DeleteFilled, DownloadOutlined, FontSizeOutlined,  LoadingOutlined } from '@ant-design/icons';
import { onEditDatagrid } from '../services/studyAPI';
import '../styles/CSS/Userdash.css'
import { notif, downloadCSV, updateDB} from '../functions/datagrid'
import { onUploadDataGrid } from '../services/uploadAPI';
import { socket , changeColumns, columnDelete, emitDatagridChange } from '../services/socket';


const EditDataGrid = (props) => {

  const { Option } = Select
  //redux states
  const studyObj = useSelector(state => state.study)
  const userObj = useSelector(state => state.user)


  //declaring initial states
  const [state, setState] = useState({
    title : '', 
    description: '', 
    isLoading: true, 
    deleteColumn: [], 
    disabledColumn: true,
    toRemoveColumn: '',
    imageFilename: '',
    ID: '',
    mode: '' //state of mode in terms od editing
  })
  const [datagridData, setDatagridData]= useState([])
  const [tempCol, setTempCol] = useState([])
  const [divDisabled, setDivDisabled] = useState(true)
  const [addColumn, setAddColumn] = useState('')//add column data

  //declaring icon
  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

  //declaring memoise and callbacks
  const columns = useMemo(() => tempCol, [tempCol]) //setting columns 
  const createRow = useCallback(() => ({}), []) //create row

  //decalaring data to send backend
  const dataToSend ={
    user: userObj.USER.name,
    title: state.title,
    description: state.description,
    studyID: studyObj.STUDY.studyID,
    data: datagridData,
    columns: columns
  }

  
 // let timer = null

  const checkColumnType= (key,title) => {
      switch(key) {
          case 'Checkbox':
            return { ...keyColumn(title, checkboxColumn), title: title, type: 'Checkbox'}
          case 'text':
            return { ...keyColumn(title, textColumn), title: title,  type: 'text'}
          case 'camera':
            return { ...keyColumn(title, cameraColumn), title: title,  type: 'camera'}
          default:
              return { ...keyColumn(title, textColumn), title: title,  type: 'text'}
      }
  }

  

  function update(){
    clearTimeout(timer)
    updateDB(dataToSend)
  }

  let timer;

const runTimer = () => {
  timer = window.setTimeout(
    () => {
      document.getElementById('save').click()
    }, 5000);
}



 const TextComponent = React.memo(
    ({ rowData, setRowData, active}) => {
      const handleOnChange = (e) =>{
        clearTimeout(timer)
        setRowData(e.target.value)
        runTimer()  
      }
      
      return (
        <input
          className="dsg-input"
          style={{border: 'none'}}
          value={rowData}
          onChange={(e) => handleOnChange(e)}
        />
      )
    }
  )

  const CameraComponent = React.memo(
    ({ rowData, setRowData }) => {
      return (
        <div style={{display:'flex', gap:'5px'}}>
        <div>
            <Button value={rowData}>
              <label className="file_input_id"><CameraFilled/>
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
              </label>
            </Button>
        </div>
        <div>  
          <Image width={20} src={`/datagrid/${rowData}`}/>
        </div>
      </div>     
      )
    }
  )

  const textColumn = {
    component: TextComponent,
    deleteValue: () => '',
    copyValue: ({ rowData }) => rowData,
    pasteValue: ({ value }) => value,
  }

  const cameraColumn = {
    component: CameraComponent,
    deleteValue: () => '',
    copyValue: ({ rowData }) => rowData,
    pasteValue: ({ value }) => value,
  }
  useEffect(()=> { //getting data
    try {
      socket.on(props.data.id.tableID, msg =>{
        if (msg === "allow-edit"){
          setDivDisabled(false)
        }else if (msg === "view-only"){
          setDivDisabled(true)
        }
    }) 
      async function getEditData(){ //edit data
        let resultDB =  await onEditDatagrid(props.data.id)
        let result = resultDB.data
        let tempCols=[]
        try{
          for(let j = 0; j < result[0].columns.length ; j++) {
            tempCols.push(checkColumnType(result[0].columns[j].type, result[0].columns[j].title))
          }
          setState({...state,
            title: result[0].title,
            description: result[0].description
          })
        }
        catch{
          console.log("functions failed for columns")
        }
        setDatagridData(result[0].data)
        setTempCol(tempCols)
      }
      getEditData()
    } catch (error) {
      notif('error', 'There is something wrong! Unable to display data!')
    }
  }, [props.data])

  useEffect(() => { //disable buttons for adding column
    if (addColumn === undefined ||addColumn ==='') {
      setState({...state, disabledColumn: true});
    } else {
      setState({...state, disabledColumn: false});
    }
  }, [addColumn]);

  const addTextColumn = () => {
    setTempCol([...columns, {
      ...keyColumn(addColumn, textColumn),
      title: addColumn,
      type: 'text'
    }])
    setAddColumn('')
    changeColumns( 'text' , addColumn, props.data.id.tableID)
  }

  const addCheckboxColumn = () => {
    setTempCol([...columns, {
      ...keyColumn(addColumn, checkboxColumn),
      title: addColumn,
      type: 'Checkbox'
    }])
    setAddColumn('')
    changeColumns( 'Checkbox' , addColumn, props.data.id.tableID)
  }

  const addCameraColumn = () => {
    setTempCol([...columns, {
      ...keyColumn(addColumn, cameraColumn),
      title: addColumn,
      type: 'camera'
    }])
    setAddColumn('')
    changeColumns( 'camera' , addColumn, props.data.id.tableID)
  }

  const removeColumn = (key) => { //removing column
   try {
    let editCol = tempCol
    let newColumn = editCol.filter(value => !key.includes(value.title));
    setTempCol(newColumn)
    datagridData.forEach((element) => delete element[key])
    columnDelete(newColumn, props.data.id.tableID)
   } catch (error) {
     notif('error', error)
   }
  }

  useEffect(() => {
    socket.on('receive-columns', msg => {
      try {
        if(msg === null|| msg=== undefined || msg === ''){
            return
        } else{
          let result  = checkColumnType(msg.type, msg.title)
          setTempCol([...tempCol, result])
        } 
      } catch (error) {
        notif('error', error)
      }
      socket.off('receive-columns')
    })
    socket.on('receive-columns-delete', msg => {
      try {
        if(msg === null|| msg=== undefined || msg === ''){
            return
        } else{
          let tempCols =[]
          for(let j = 0; j < msg.length ; j++) {
            tempCols.push(checkColumnType(msg[j].type, msg[j].title))
          }
          setTempCol(tempCols)
        }
      } catch (error) {
        notif('error', error)
    }}) 

  }, [tempCol])


  useEffect(() => {
    if(divDisabled === false){
      emitDatagridChange(datagridData, props.data.id.tableID)
    }
    clearTimeout(timer)
  }, [datagridData])

  useEffect(() => {
    socket.on('receive-datagrid', msg => {
      setDatagridData(msg)
    })
  }, [])


  function handleColumnToDelete(value) { //setting column to delete
    setState({...state, toRemoveColumn: value})
  }

  function download(){
    downloadCSV(datagridData, state.ID, state.title, userObj.USER.name)
  }

  return (
    <div style={{
      opacity: divDisabled ? 0.25 : 1,
      pointerEvents: divDisabled ? "none" : "initial"
      }}>
      <div>
        <div className="add-grid">
          <div style={{display:'grid'}}>
            <label style={{fontSize: '20px', fontFamily:'Montserrat'}}>
              Table Title
            </label>
            <Input  placeholder="Input table title" onChange={(e)=> {setState({...state, title: e.target.value})}} value={state.title}/> 
          </div>
          <div style={{display:'grid'}}>
            <label style={{fontSize: '20px', fontFamily:'Montserrat'}}>
              Table Description
            </label>
            <Input  placeholder="Enter table description" onChange={(e)=> {setState({...state, description: e.target.value})}} value={state.description}/>
          </div>
          <div style={{display:'grid'}}>
              <label style={{fontSize: '20px', fontFamily:'Montserrat'}}>
                Column Title
              </label>
              <div style={{display:'flex', flexDirection:'row', gap:'3px'}}>
                  <Input  placeholder="Enter Column title" onChange={(e)=> {setAddColumn( e.target.value)}} value={addColumn}/>
                  <Tooltip placement='top' title='Text Column'>
                    <Button disabled={state.disabledColumn}  onClick={addTextColumn}>
                      <FontSizeOutlined />
                    </Button>
                  </Tooltip>
                  <Tooltip placement='top' title='Checkbox Column'>
                    <Button disabled={state.disabledColumn}  onClick={addCheckboxColumn} >
                      <CheckSquareFilled />
                    </Button>
                  </Tooltip>
                  <Tooltip placement='top' title='Camera Column'>
                    <Button disabled={state.disabledColumn} onClick={addCameraColumn} >
                      <CameraFilled />
                    </Button>
                  </Tooltip>
              </div>
          </div>
          <div style={{display:'grid'}}>
            <label style={{fontSize: '20px', fontFamily:'Montserrat'}}>
              Delete Column 
            </label>
            <div style={{display:'flex', flexDirection:'row', gap:'5px', width:'300px'}}>
                <Select placeholder="Select column title to delete" onChange={handleColumnToDelete} mode="tags" tokenSeparators={[',']} style={{ width: '100%' }}>
                  {tempCol.map(column => (
                    <Option key={column.title} value={column.title}>{column.title}</Option>
                  ))}
                </Select>
                <Tooltip placement='top' title='Delete Selected Column'> 
                  <Button danger onClick={() => removeColumn(state.toRemoveColumn)}>
                    <DeleteFilled/>
                  </Button> 
                </Tooltip>
                <Tooltip placement='top' title='Download table in CSV'> 
                  <Button  onClick={download}>
                    <DownloadOutlined/>
                  </Button>
                </Tooltip>
            </div>
          </div>
        </div>  
        <div style={{marginTop:'20px'}}>
          {datagridData && datagridData.constructor === Array && datagridData.length === 0 ?  <div className="spinner"><Spin indicator={antIcon}/> </div>: 
            <div >
                <DynamicDataSheetGrid
                    data={datagridData}
                    onChange={setDatagridData}
                    columns={columns}
                    createRow={createRow}
                />
                <div style={{marginTop: '20px', display:'flex', justifyContent:'flex-end'}}>
                  <Button type="primary" id='save' onClick={update} >Save</Button>
                </div>
            </div> }
        </div>   
      </div>
    </div>
  )
}

export default EditDataGrid
