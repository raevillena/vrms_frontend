import React, {useState, useEffect, useMemo, useCallback} from 'react';
import {Button, Input, Select, notification, Space} from 'antd'
import { onAddDatagrid} from '../services/studyAPI';
import { useSelector} from 'react-redux';
import { DynamicDataSheetGrid, 
  checkboxColumn,
  textColumn,
  keyColumn  } from 'react-datasheet-grid'
import GridTable from './GridTable';
import {CheckSquareFilled, CameraFilled, DeleteFilled, DownloadOutlined, FontSizeOutlined, } from '@ant-design/icons';
import { CSVLink } from 'react-csv'







const DataGrid = () => {

  const { Option } = Select

  const studyObj = useSelector(state => state.study)
  const userObj = useSelector(state => state.user)

  const [title, setTitle] = useState() 
  const [description, setDescription] = useState()
  const [ data, setData ] = useState([])
  const [columnsData, setColumnsData] = useState([]) // adding columns
  const [addColumnTitle, setAddColumnTitle] = useState()
  const [disabledColumn, setDisabledColumn] = useState(true)
  const [toRemoveColumn, setToRemoveColumn] = useState()
  const [disabledCreate, setDisabledCreate] = useState(true)
  const [addTable, setAddTable] = useState() //add data to table
  const [tempCol, setTempCol] = useState( [{
    ...keyColumn('checkbox', checkboxColumn),
    title: 'Checkbox',
    type: 'checkbox'
  }])


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

  useEffect(() => {
    if (title === undefined ||title ===''|| description === undefined ||description ==='') {
      setDisabledCreate(true);
    } else {
      setDisabledCreate(false);
    }
  }, [title,description]);

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
      <input type="file" id="file_input_id" accept="image/*"
              ></input>
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
      type:'checkbox'
    }])
    setAddColumnTitle('')
  }

  const addCameraColumn = () => {
    setTempCol([...columns, {
      ...keyColumn(addColumnTitle, cameraColumn),
      title: addColumnTitle,
      type:'camera'
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

  const successNotif = (type, message) => {
    notification[type]({
      message: 'Notification',
      description:
        message,
    });
  };

  const errorNotif = (type, message) => {
    notification[type]({
      message: 'Notification',
      description:
        message,
    });
  };

  async function saveToDB(){
    const dataToSend ={
      user: userObj.USER._id,
      title: title,
      description: description,
      studyID: studyObj.STUDY.studyID,
      data: data,
      columns: tempCol
    }
    let result = await onAddDatagrid(dataToSend)
    if(result.status === 200){
      successNotif('success', result.data.message)
     // alert(result.data.message)
      setAddTable(result.data.data)
      setTitle('')
      setDescription('')
      setTempCol([{
        ...keyColumn('checkbox', checkboxColumn),
        title: 'Checkbox',
        type: 'checkbox'
      }])
      setData([])
    }else{
     // alert(result.data.message)
     errorNotif('error', result.data.message)
    }
  }

  function showTable() {
    var x = document.getElementById("table");
    if (x.style.display === "none") {
      x.style.display = "block";
    } else {
      x.style.display = "none";
      setTitle('')
      setDescription('')
      setTempCol([{
        ...keyColumn('checkbox', checkboxColumn),
        title: 'Checkbox',
        type: 'checkbox'
      }])
      setData([])
    }
  }
  
  return (
    <div>
      <GridTable  data={addTable}/>
      <div id='table' style={{display: 'none'}}>
        <h1 style={{fontFamily: 'Montserrat'}}>Add Table</h1>
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
            <DynamicDataSheetGrid
                    data={data}
                    onChange={setData}
                    columns={columns}
                    createRow={createRow}
                />
            <div style={{float:'right', rowGap:'0px', gap:'5px', display:'flex', marginTop:'20px'}}>
            <Button type="primary" disabled={disabledCreate} onClick={saveToDB}>Create</Button>
            <Button danger onClick={showTable}>Exit</Button>
            </div>
            </div>
        </div>
    </div>
  )
}

export default DataGrid
