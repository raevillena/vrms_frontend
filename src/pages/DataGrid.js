import React, {useState, useEffect, useMemo, useCallback} from 'react';
import { Layout, Button, Input, Form, Select} from 'antd'
import Sidebar from '../components/components/Sidebar'
import Headers from '../components/components/Header'
import { onUploadDataGrid } from '../services/uploadAPI';
import { onAddDatagrid, onGetDatagrid,  } from '../services/studyAPI';
import { useSelector} from 'react-redux';
import { DynamicDataSheetGrid, 
  checkboxColumn,
  textColumn,
  keyColumn  } from 'react-datasheet-grid'
import GridTable, {getDatagridData} from './GridTable';
import {CheckSquareFilled, CameraFilled, DeleteFilled, DownloadOutlined } from '@ant-design/icons';
import { CSVLink } from 'react-csv'



const { Header, Content, Sider } = Layout;


const DataGrid = () => {

  const { Option } = Select

  const studyObj = useSelector(state => state.study)
  const userObj = useSelector(state => state.user)

  const [title, setTitle] = useState() 
  const [description, setDescription] = useState()
  const [ data, setData ] = useState([])
  const [columnsData, setColumnsData] = useState([]) // adding columns
  const [addColumnTitle, setAddColumnTitle] = useState()
  const [toRemoveColumn, setToRemoveColumn] = useState()


  useEffect(()=> {
    getColumns()
  }, [data])

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

  const TextComponent = React.memo(
    ({ rowData, setRowData }) => {
      return (
      <input type="file"/>
      )
    }
  )
  
  
  const cameraColumn = {
    component: TextComponent,
    deleteValue: () => '',
    copyValue: ({ rowData }) => rowData,
    pasteValue: ({ value }) => value,
  }


  const [tempCol, setTempCol] = useState( [{
    ...keyColumn('checkbox', checkboxColumn),
    title: 'Checkbox',
  }])

  const columns = useMemo(() => tempCol, [tempCol])
  const createRow = useCallback(() => ({}), [])
  
  const addTextColumn = () => {
    setTempCol([...columns, {
      ...keyColumn(addColumnTitle, textColumn),
      title: addColumnTitle,
    }])
    setAddColumnTitle('')
  }

  const addCheckboxColumn = () => {
    setTempCol([...columns, {
      ...keyColumn(addColumnTitle, checkboxColumn),
      title: addColumnTitle,
    }])
    setAddColumnTitle('')
  }

  const addCameraColumn = () => {
    setTempCol([...columns, {
      ...keyColumn(addColumnTitle, cameraColumn),
      title: addColumnTitle,
    }])
    setAddColumnTitle('')
  }

  const removeColumn = (key) => {
    let newColumn = columns.filter((tempData) => {
      return tempData.title !== key
    })
    setTempCol(newColumn)
  }

  function handleColumnToDelete(value) { 
    setToRemoveColumn(value)
  }

  async function saveToDB(){
    const dataToSend ={
      user: userObj.USER._id,
      title: title,
      description: description,
      studyID: studyObj.STUDY.studyID,
      data: data,
      columns: columns
    }
    let result = await onAddDatagrid(dataToSend)
    console.log(result)
    if(result.status === 200){
      alert(result.data.message)
    }else{
      alert(result.data.message)
    }
  }

  function showTable() {
    var x = document.getElementById("table");
    if (x.style.display === "none") {
      x.style.display = "block";
    } else {
      x.style.display = "none";
    }
  }
  
  return (
    <div>
      <Layout  > 
      <Sider  style={{
        overflow: 'auto',
        height: '100vh',
        position: 'fixed',
        left: 0,
        background:'white'
      }} >
          <Sidebar/>
      </Sider>
    <Layout style={{ marginLeft: 200 }}>
      <Header style={{ padding: 0, background:'#f2f2f2' }} >
      <Headers/>
      </Header>
      <Content style={{ margin: '24px 16px 0', overflow: 'initial' , minHeight: "100vh"}} >  
      
      <GridTable />
      <div id='table' style={{display: 'none'}}>
          <Input  placeholder="Input table title" onChange={(e)=> {setTitle(e.target.value)}} value={title}/> 
          <Input  placeholder="Enter table description" onChange={(e)=> {setDescription(e.target.value)}} value={description}></Input>
          <Input style={{maxWidth: '30%'}} placeholder="Enter Column title" onChange={(e)=> {setAddColumnTitle(e.target.value)}} value={addColumnTitle}></Input>
            <Button  onClick={addTextColumn}>T</Button>
            <Button  onClick={addCheckboxColumn} icon={<CheckSquareFilled />}></Button>
            <Button  onClick={addCameraColumn} icon={<CameraFilled />}></Button>
            <Button><CSVLink data={data}><DownloadOutlined/></CSVLink>
    
            </Button>
        <Select style={{maxWidth: '30%'}} placeholder="Enter column title to delete" onChange={handleColumnToDelete}>
            {columnsData.map(column => (
                            <Option key={column.key} value={column.value}>{column.name}</Option>
                        ))}
            </Select>
            <Button danger icon={<DeleteFilled />} onClick={() => removeColumn(toRemoveColumn)}></Button> 
            <DynamicDataSheetGrid
                data={data}
                onChange={setData}
                columns={columns}
                createRow={createRow}
            />
            <Button type="primary" onClick={saveToDB}>Save</Button>
            <Button danger onClick={showTable}>Exit</Button>
        </div>
      </Content>
    </Layout>      
</Layout>
    </div>
  )
}

export default DataGrid
