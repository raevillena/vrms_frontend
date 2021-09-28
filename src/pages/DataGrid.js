import React, {useState, useEffect, useMemo, useCallback} from 'react';
import {Button, Input, Select, notification, Modal, Image, Tooltip} from 'antd'
import { onAddDatagrid} from '../services/studyAPI';
import { useSelector} from 'react-redux';
import { DynamicDataSheetGrid, 
  checkboxColumn,
  textColumn,
  keyColumn  } from 'react-datasheet-grid'
import GridTable from './GridTable';
import {CheckSquareFilled, CameraFilled, DeleteFilled, DownloadOutlined, FontSizeOutlined, PlusSquareFilled} from '@ant-design/icons';
import { onUploadDataGrid } from '../services/uploadAPI';
import '../styles/CSS/Userdash.css'


const DataGrid = () => {

  const { Option } = Select

  const studyObj = useSelector(state => state.study) //study reducer
  const userObj = useSelector(state => state.user) //user reducer
  const [state, setstate] = useState({
    title: '', 
    description: '', 
    columnsData: [], 
    addColumn: '', 
    disableCol: true, 
    removeCol: '', 
    disableCreate: true,
    addTable: '', 
    tempCol: [{ //column
      ...keyColumn('Checkbox', checkboxColumn),
      title: 'Checkbox',
      type: 'Checkbox'
    }],
    isModalImage: false,
    isModalAdd: false
  })
  const [ data, setData ] = useState([])

  const notif = (type, message) => {
    notification[type]({
      message: 'Notification Title',
      description:
        message,
    });
  };


  const CameraComponent = React.memo(
    ({ rowData, setRowData }) => {
      return (
        <div style={{display:'flex', gap:'5px'}}>
          <div>
            <Button value={rowData}>
              <label className="file_input_id">
                <CameraFilled/>
                  <input type="file"  accept="image/*" onChange={async e => {
                        const file = e.target.files[0]
                        const data = new FormData()
                        data.append("file", file)
                        let result = await onUploadDataGrid(data) //uploading
                        setRowData(result.data.filename)
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

  const cameraColumn = {
    component: CameraComponent,
    deleteValue: () => '',
    copyValue: ({ rowData }) => rowData,
    pasteValue: ({ value }) => value,
  }

  const columns = useMemo(() => state.tempCol, [state.tempCol]) //displaying columns in datasheet 
  const createRow = useCallback(() => ({}), []) //creating row
  
  const addTextColumn = () => {
    setstate({
      ...state, 
      addColumn: '', 
      tempCol: [...columns, {
      ...keyColumn(state.addColumn, textColumn),
      title: state.addColumn,
      type: 'text'
    }]})
  }

  useEffect(()=> { //getting column
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
      setstate({...state, columnsData: tempColumns})
  }
    getColumns()
  }, [state.tempCol, columns])

  useEffect(() => { //disable column
    if (state.addColumn === undefined ||state.addColumn ==='') {
      setstate({...state, disableCol: true})
    } else {
      setstate({...state, disableCol: false})
    }
  }, [state.addColumn]);

  useEffect(() => { //create button disable
    if (state.title === undefined ||state.title ===''|| state.description === undefined ||state.description ==='') {
      setstate({...state, disableCreate: true})
    } else {
      setstate({...state, disableCreate: false})
    }
  }, [state.title,state.description]);


  const addCheckboxColumn = () => {
    setstate({...state, addColumn: '', tempCol: [...columns, {
      ...keyColumn(state.addColumn, checkboxColumn),
      title: state.addColumn,
      type:'Checkbox'
    }]})
  }

  const addCameraColumn = () => {
    setstate({...state, addColumn:'', tempCol: [...columns, {
      ...keyColumn(state.addColumn, cameraColumn),
      title: state.addColumn,
      disabled: ({ rowData }) => !rowData.Checkbox,
      type:'camera'
    }]})
  }

  const removeColumn = (key) => {
    try {
      let newColumn = columns.filter(value => !key.includes(value.title));
      setstate({...state, tempCol: newColumn})
    } catch (error) {
      notif('error', error)
    }
  }

  function handleColumnToDelete(value) { //handling deleting column
    setstate({...state, removeCol: value})
  }


  async function saveToDB(){
    const dataToSend ={
      user: userObj.USER.name,
      title: state.title,
      description: state.description,
      studyID: studyObj.STUDY.studyID,
      data: data,
      columns: state.tempCol
    }
    let result = await onAddDatagrid(dataToSend)
    if(result.status === 200){
      setstate({...state, title: '', description: '', addTable: result.data.data, tempCol: [{
        ...keyColumn('Checkbox', checkboxColumn),
        title: 'Checkbox',
        type: 'Checkbox'
      }]})
      setData([])
      notif('success', result.data.message)
    }else{
     notif('error', result.data.message)
    }
  }

  async function downloadCSV(){
    try {
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
      element.download = `${state.title}.csv`
      document.body.appendChild(element)
      element.click()
      notif('success', "Download sucessful!")
    } catch (error) {
      notif('error', 'Download failed!')
    }
      
  }

  const showModalAdd = () => {
    setstate({...state, isModalAdd: true})
  };

  const handleCancelAdd = () => {
    setstate({...state, 
      title: '', 
      description: '', 
      addColumn:'', 
      removeCol: '', 
      isModalAdd: false,
      tempCol: [{ 
        ...keyColumn('Checkbox', checkboxColumn),
        title: 'Checkbox',
        type: 'Checkbox'
      }]
    })
  };

  return (
    <div>
       <div style={{marginTop: '20px'}} >
          <Tooltip placement="top" title="Add Table">
            <Button style={{background: '#A0BF85', marginTop: '15px' }} onClick={showModalAdd} icon={<PlusSquareFilled/>}>
              Add Table
            </Button>
          </Tooltip>
        </div>
        <Modal visible={state.isModalAdd} footer={null} onCancel={handleCancelAdd} width={1000} title="Add Table">
            <div>
              <div className="add-grid">
                <div style={{display:'grid'}}>
                  <label style={{fontSize: '20px', fontFamily:'Montserrat'}}>
                    Table Title
                  </label>
                  <Input  placeholder="Input table title" onChange={(e)=> {setstate({...state, title: e.target.value})}} value={state.title}/> 
                </div>
                <div style={{display:'grid'}}>
                  <label style={{fontSize: '20px', fontFamily:'Montserrat'}}>
                    Table Description
                  </label>
                  <Input  placeholder="Enter table description" onChange={(e)=> {setstate({...state, description: e.target.value})}} value={state.description}/>
                </div>
                <div style={{display:'grid'}}>
                  <label style={{fontSize: '20px', fontFamily:'Montserrat'}}>
                    Column Title
                  </label>
                  <div style={{display:'flex', flexDirection:'row', gap:'3px'}}>
                    <Input  placeholder="Enter Column title" onChange={(e)=> {setstate({...state, addColumn: e.target.value})}} value={state.addColumn}/>
                    <Tooltip placement='top' title='Text Column'>
                      <Button disabled={state.disableCol}  onClick={addTextColumn}>
                        <FontSizeOutlined />
                      </Button>
                    </Tooltip>
                    <Tooltip placement='top' title='Checkbox Column'>
                      <Button disabled={state.disableCol}  onClick={addCheckboxColumn} >
                        <CheckSquareFilled />
                      </Button>
                    </Tooltip>
                    <Tooltip placement='top' title='Camera Column'>
                      <Button disabled={state.disableCol} onClick={addCameraColumn} >
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
                        {state.tempCol.map(column => (
                          <Option key={column.title} value={column.title}>{column.title}</Option>
                        ))}
                     </Select>
                     <Tooltip placement='top' title='Delete Selected Column'> 
                        <Button danger onClick={() => removeColumn(state.removeCol)}><DeleteFilled/></Button> 
                      </Tooltip>
                      <Tooltip placement='top' title='Download table in CSV'> 
                        <Button type='primary' onClick={downloadCSV}><DownloadOutlined/></Button>
                      </Tooltip>
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
                <div style={{marginTop: '20px', display: 'flex', justifyContent:'flex-end'}}>
                  <Button type="primary" disabled={state.disableCreate} onClick={saveToDB}>
                    Create
                  </Button>
                </div>
              </div>
            </div>
        </Modal>
        <GridTable  data={state.addTable}/>
    </div>
  )
}

export default DataGrid
