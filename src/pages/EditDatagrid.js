import React, {useState, useEffect, useMemo, useCallback, useRef} from 'react';
import {Button, Input, Select, Image, Spin, Upload} from 'antd'
import { onUpdateDatagrid} from '../services/studyAPI';
import { useSelector} from 'react-redux';
import { DynamicDataSheetGrid, 
  checkboxColumn,
  textColumn,
  keyColumn} from 'react-datasheet-grid'
import {CheckSquareFilled, CameraFilled, DeleteFilled, DownloadOutlined, FontSizeOutlined } from '@ant-design/icons';
import { CSVLink } from 'react-csv'
import IdleTimer from 'react-idle-timer';




const EditDataGrid = (props) => {

  const { Option } = Select

  const studyObj = useSelector(state => state.study)
  const userObj = useSelector(state => state.user)
  const idleTimerRef = useRef(null)

  const [loading, setLoading] = useState(false)
  const [title, setTitle] = useState() 
  const [description, setDescription] = useState()
  const [ data, setData ] = useState([])
  const [columnsData, setColumnsData] = useState([]) // adding columns
  const [addColumnTitle, setAddColumnTitle] = useState()
  const [disabledColumn, setDisabledColumn] = useState(true)
  const [toRemoveColumn, setToRemoveColumn] = useState()
  const [tempCol, setTempCol] = useState( [])

const checkColumnType= (key,title) => {
    switch(key) {
        case 'checkbox':
          return { ...keyColumn(title, checkboxColumn), title: title}
          break;
        case 'text':
          return { ...keyColumn(title, textColumn), title: title}
          break;
        case 'camera':
          return { ...keyColumn(title, cameraColumn), title: title}
          break;
        default:
            return { ...keyColumn(title, textColumn), title: title}
            break;
      }
}

  useEffect(()=> {
      setLoading(true)
      let x = props.data
      let tempCols=[]
    for(let i = 0; i < x.length; i++){   
        setTitle(x[i].title)
        setDescription(x[i].description)
        setData(x[i].data) 
        for(let j = 0; j < x[i].columns.length ; j++) {
            tempCols.push(checkColumnType(x[i].columns[j].type, x[i].columns[j].title))
        }
        console.log(tempCols)
        setTempCol(tempCols)   
    }
   }, [props])

   useEffect(()=> {
    setLoading(false)
  }, [])


  useEffect(()=> {
    getColumns()
  }, [tempCol])


  useEffect(() => {
    if (addColumnTitle === undefined ||addColumnTitle ==='') {
      setDisabledColumn(true);
    } else {
      setDisabledColumn(false);
    }
  }, [addColumnTitle]);


  //adding columns
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

  const CameraComponent = React.memo(
    ({ rowData, setRowData }) => {
      return (
        <div>
          <label for="file_input_id"><CameraFilled /></label>
          <input type="file" id="file_input_id" accept="image/*" onChange={async e => {
                const file = e.target.files[0]
                const data = new FormData()
                data.append("tableTitle", title)
                data.append("file", file)
                let result = await onUpdateDatagrid(data)
                console.log(result)
                alert(result.data.message)  
              }
            }
             />
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


  const columns = useMemo(() => tempCol, [tempCol])
  const createRow = useCallback(() => ({}), [])
  
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

  const removeColumn = (key) => {
   let newColumn = columns.filter(value => !key.includes(value.title));
    setTempCol(newColumn)
  }

  function handleColumnToDelete(value) { 
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

  function showTableEdit() {
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
        {loading ? <DynamicDataSheetGrid
                data={data}
                onChange={setData}
                columns={columns}
                createRow={createRow}
            /> : <Spin style={{display: 'flex', justifyContent:'center'}} />}
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
