import React, {useState, useEffect} from 'react';
import { Layout} from 'antd'
import {
  DataSheetGrid,
  checkboxColumn,
  textColumn,
  cameraColumn,
} from 'react-datasheet-grid'
import 'react-datasheet-grid/dist/index.css'
import Sidebar from '../components/components/Sidebar'
import Headers from '../components/components/Header'



const { Header, Content, Sider } = Layout;



const DataGrid = () => {
 

  const [ data, setData ] = useState([
    { active: true, firstName: 'Ellon', lastName: 'Musk' },
    { active: false, firstName: 'Jeff', lastName: 'Bezos'},
  ])
const [columns, setColumns] = useState([
    checkboxColumn({ title: 'Active', key: 'active' }),
    textColumn({ title: 'First Name', key: 'firstName' }),
    textColumn({ title: 'Last name', key: 'lastName' }),
    cameraColumn({title:'camera', key: 'camera'}),
    textColumn({ title: 'Photo', key: 'Photo' }),
])

const [newColumn, setNewColumn] = useState()

useEffect(() => {
    console.log(data, columns)
}, [data, columns])

const addNewColumn = () => {
    if (!newColumn) {
        return
    }
    setColumns([...columns, textColumn({title: <div>{newColumn}</div>, key: newColumn})])
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
      <DataSheetGrid
          data={data}
          onChange={setData}
          columns={columns}
        />
        <input onChange={(e)=> {setNewColumn(e.target.value)}}/>
        <button onClick={addNewColumn}>
            CLICK ME
        </button>
      </Content>
      
    </Layout>      
</Layout>
    </div>
  )
}

export default DataGrid
