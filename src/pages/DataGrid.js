import React, {useState, useEffect, useMemo, useCallback} from 'react';
import {Button, Input, Select, notification, Modal, Image, Tooltip} from 'antd'
import { onAddDatagrid, onGetDatagridCol} from '../services/studyAPI';
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
    isModalAdd: false,
    dupCol : []
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

  useEffect(() => {
    const getCol = async() =>{
      let res = await onGetDatagridCol({study: studyObj.STUDY.studyID})
      let col = res.data
      let colArr = []
      for (let index = 0; index < col.length; index++) {
        colArr.push({
        key : col[index].title,
        value: col[index].columns,
        title: col[index].title
      })
      }
      setstate({...state, dupCol: colArr})
    }
    getCol()
  }, [])

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

  function handleColumnToDelete(value) { //handling deleting column
    setstate({...state, removeCol: value})
  }

  function handleDuplicateColumn(value) { //handling duplicating table
    let arr = state.dupCol
    let tempColArr = []
    let obj = arr.find(o => o.title === value); 
    for (let index = 0; index < obj.value.length; index++) {
      tempColArr.push(checkColumnType(obj.value[index].type, obj.value[index].title))
    }
    setstate({...state, tempCol: tempColArr })
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
      notif('success', result.data.message)
      setData([])
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
            <Button style={{background: '#A0BF85', marginTop: '15px', display: userObj.USER.category === 'director' ? 'none' : 'initial' }} onClick={showModalAdd} icon={<PlusSquareFilled/>}>
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
              <div className="add-grid">
              <div style={{display:'grid'}}>
                  <label style={{fontSize: '20px', fontFamily:'Montserrat'}}>
                    Duplicate Table 
                  </label>
                  <div style={{display:'flex', flexDirection:'row', gap:'5px', width:'300px'}}>
                    <Select placeholder="Select table to duplicate" onChange={handleDuplicateColumn}>
                        {state.dupCol.map(column => (
                          <Option key={column.title} value={column.title}>{column.title}</Option>
                        ))}
                     </Select>
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
        <div style={{marginTop: '10px'}}>
        <GridTable  data={state.addTable}/>
        </div>
    </div>
  )
}

export default DataGrid
