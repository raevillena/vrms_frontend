import React, {useState, useEffect} from 'react';
import { Layout, Button, Input, Form} from 'antd'
import {
  DataSheetGrid,
  checkboxColumn,
  textColumn,
  cameraColumn,
  progressColumn
} from 'react-datasheet-grid'
import 'react-datasheet-grid/dist/index.css'
import Sidebar from '../components/components/Sidebar'
import Headers from '../components/components/Header'
import { CSVLink, CSVDownload } from "react-csv"
import { onUploadDataGrid } from '../services/uploadAPI';
import { onGetDatagrid, onUpdateDatagrid } from '../services/studyAPI';
import { useSelector, useDispatch} from 'react-redux';



const { Header, Content, Sider } = Layout;

let tempCol = [
  checkboxColumn({title: 'Active', key:'active'}),
  textColumn({title: 'First Name', key:'firstName'}),
  textColumn({title: 'Last Name', key:'lastName'}),
    cameraColumn({title:'camera', key: 'camera'}),
]

const DataGrid = () => {
  const studyObj = useSelector(state => state.study)
  const userObj = useSelector(state => state.user)
  const [titles, setTitles] = useState()

  const [ data, setData ] = useState([
    { active: true, firstName: 'Elon', lastName: 'Musk' },
    { active: false, firstName: 'Jeff', lastName: 'Bezos' },
  ])

const [columns, setColumns] = useState([
  checkboxColumn({title: 'Active', key:'active'}),
  textColumn({title: 'First Name', key:'firstName'}),
  textColumn({title: 'Last Name', key:'lastName'}),
    cameraColumn({title:'camera', key: 'camera'}),
])
 
const [newColumn, setNewColumn] = useState()
const [removeColumn, setRemoveColumn] = useState()
useEffect(() => {
  console.log(columns)
  //save to database here
  const dataToSend ={
    user: userObj.USER._id,
    title: titles,
    studyID: studyObj.STUDY.studyID,
    data: data
  }
  onUpdateDatagrid(dataToSend)
 // onGetDatagrid(studyObj.STUDY.studyID)
   
}, [data, columns])

const onUpload = () => {
 // for( var i = 0; i < data.length; i++){
 //   console.log("for loop")
  //  data[i].setAttribute('data-index', i);
  //  data[i].addEventListener('click', function(){
  //     alert(this.getAttribute('data-index'));
  //  });
  //}
 // console.log(data[0].camera)
 //  const img = new FormData()
 //  img.append("user", data[0].firstName )
  //  img.append("file", data[0].camera)
  //  onUploadDataGrid(img)
}




const addNewColumn = () => {
  if (!newColumn) {
      return
  }
  setColumns([...columns, textColumn({title: newColumn, key: newColumn, editable: true})])
  console.log(tempCol)
  tempCol = [...tempCol, textColumn({title: newColumn, key: newColumn, editable: true})]
  console.log(tempCol)
}

const handleRemoveColumn = () => {

  let temp = tempCol.filter((col) => {
    return col.title !== removeColumn;
  })


  console.log(temp)

  tempCol = temp
  // setColumns(temp)

  // var index = columns.map(function (col) { return col.title }).indexOf(removeColumn);
  // var index1 = tempCol.map(function (col) { return col.title }).indexOf(removeColumn);

  // //console.log(index)
  // console.log("remove pressed", columns, tempCol)
  // if (index > -1) {
  //   let temp = columns
  //   temp.splice(index, 1)
  //   tempCol.splice(index1, 1)
  //   console.log("after splice", temp, tempCol)
  //   setColumns(temp)
  // }
  //setColumns(columns => [...columns])
  //setColumns(columns.filter(index));
 };




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
      <Form> 
        <Form.Item>
          <Input placeholder="Input table title" onChange={(e)=> {setTitles(e.target.value)}}/> 
        </Form.Item>
        <Form.Item>
          {console.log(tempCol)}
          <DataSheetGrid
            data={data}
            onChange={setData}
            columns={[...tempCol]}
          />
          <input onChange={(e)=> {setNewColumn(e.target.value)}} placeholder="Enter Column Title"/>
          <button onClick={addNewColumn}>
              Add Column
          </button>
          <input onChange={(e)=> {setRemoveColumn(e.target.value)}} placeholder="Enter Column Title"/>
          <button onClick={handleRemoveColumn}>
              Delete Column
          </button>
          <CSVLink data={data}>Download as CSV</CSVLink>
        </Form.Item>
        </Form>
      </Content>
    </Layout>      
</Layout>
    </div>
  )
}

export default DataGrid
