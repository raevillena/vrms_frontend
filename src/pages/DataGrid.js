import React, {useState, useEffect, useMemo, useCallback} from 'react';
import {Button, Input, Select, notification, Modal, Image, Tooltip} from 'antd'
import { onAddDatagrid} from '../services/studyAPI';
import { useSelector} from 'react-redux';
import { DynamicDataSheetGrid, 
  checkboxColumn,
  textColumn,
  keyColumn  } from 'react-datasheet-grid'
import GridTable from './GridTable';
import {CheckSquareFilled, CameraFilled, DeleteFilled, DownloadOutlined, FontSizeOutlined, EyeFilled, PlusSquareFilled} from '@ant-design/icons';
import { onUploadDataGrid } from '../services/uploadAPI';
import '../styles/CSS/Userdash.css'


const DataGrid = () => {

  const { Option } = Select

  const studyObj = useSelector(state => state.study) //study reducer
  const userObj = useSelector(state => state.user) //user reducer
  const [addTableStyle, setAddTableStyle] = useState("none")
  const [title, setTitle] = useState() 
  const [description, setDescription] = useState()
  const [ data, setData ] = useState([])
  const [columnsData, setColumnsData] = useState([]) // adding columns
  const [addColumnTitle, setAddColumnTitle] = useState()
  const [disabledColumn, setDisabledColumn] = useState(true)
  const [toRemoveColumn, setToRemoveColumn] = useState()
  const [disabledCreate, setDisabledCreate] = useState(true)
  const [addTable, setAddTable] = useState() //add data to table
  const [tempCol, setTempCol] = useState( [{ //column
    ...keyColumn('Checkbox', checkboxColumn),
    title: 'Checkbox',
    type: 'Checkbox'
  }])
  const [isModalVisible, setIsModalVisible] = useState(false) //modal for image viewing
  const [imageFilename, setImageFilename] = useState() //to view image

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

  const columns = useMemo(() => tempCol, [tempCol]) //displaying columns in datasheet 
  const createRow = useCallback(() => ({}), []) //creating row
  
  const addTextColumn = () => {
    setTempCol([...columns, {
      ...keyColumn(addColumnTitle, textColumn),
      title: addColumnTitle,
      type: 'text'
    }])
    setAddColumnTitle('')
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
        setColumnsData(tempColumns)
  }
    getColumns()
  }, [tempCol, columns])

  useEffect(() => { //disable column
    if (addColumnTitle === undefined ||addColumnTitle ==='') {
      setDisabledColumn(true);
    } else {
      setDisabledColumn(false);
    }
  }, [addColumnTitle]);

  useEffect(() => { //create button disable
    if (title === undefined ||title ===''|| description === undefined ||description ==='') {
      setDisabledCreate(true);
    } else {
      setDisabledCreate(false);
    }
  }, [title,description]);


  const addCheckboxColumn = () => {
    setTempCol([...columns, {
      ...keyColumn(addColumnTitle, checkboxColumn),
      title: addColumnTitle,
      type:'Checkbox'
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
try {
  let newColumn = columns.filter(value => !key.includes(value.title));
  setTempCol(newColumn)
} catch (error) {
  notif('error', error)
}
  }

  function handleColumnToDelete(value) { //handling deleting column
    setToRemoveColumn(value)
  }


  async function saveToDB(){
    const dataToSend ={
      user: userObj.USER.name,
      title: title,
      description: description,
      studyID: studyObj.STUDY.studyID,
      data: data,
      columns: tempCol
    }
    let result = await onAddDatagrid(dataToSend)
    if(result.status === 200){
      setAddTable(result.data.data)
      setTitle('')
      setDescription('')
      setTempCol([{
        ...keyColumn('Checkbox', checkboxColumn),
        title: 'Checkbox',
        type: 'Checkbox'
      }])
      setData([])
      notif('success', result.data.message)
      setAddTableStyle('none')
    }else{
     notif('error', result.data.message)
    }
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
      element.download = `${title}.csv`
      document.body.appendChild(element)
      element.click()
      notif('success', "Download sucessful!")
    } catch (error) {
      notif('error', 'Download failed!')
    }
      
  }

  function showTable() { 
    setAddTableStyle("block")
  }
  function hideTable(){
    setAddTableStyle("none")
  }
  return (
    <div>
      <GridTable  data={addTable}/>
      <div >
      <Tooltip placement="top" title="Add Table">
      <Button style={{background: '#A0BF85', marginTop: '15px' }} onClick={showTable} icon={<PlusSquareFilled/>}>Add Table</Button>
      </Tooltip>
      </div>
      <div style={{display: addTableStyle}}>
        <h1 style={{fontFamily: 'Montserrat', fontSize: '20px'}}>Add Table</h1>
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
                <Modal title="View Image" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                    <div style={{display: 'grid' }}>
                      <Image
                      src={`/datagrid/${imageFilename}`}
                      />
                    </div>
                </Modal>
            <div style={{float:'right', rowGap:'0px', gap:'5px', display:'flex', marginTop:'20px'}}>
            <Button type="primary" disabled={disabledCreate} onClick={saveToDB}>Create</Button>
            <Button danger onClick={hideTable}>Exit</Button>
            </div>
            </div>
        </div>
    </div>
  )
}

export default DataGrid
