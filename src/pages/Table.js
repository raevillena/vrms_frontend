import React, {useState, useEffect} from 'react';
import { Layout, Button, Input, Form} from 'antd'
import Datagrid, {TextEditor, SelectColumn, Column, FillEvent, PasteEvent} from 'react-data-grid'
import Sidebar from '../components/components/Sidebar'
import Headers from '../components/components/Header'



const { Header, Content, Sider } = Layout;



const Table = () => {

      const [row, setRow] = useState([])
      const [column, setColumn] = useState([])
      const [columnTitle, setColumnTitle] = useState()
      const [removeColumn, setRemoveColumn] = useState()

      const addColumn = () => {
        setColumn([...column, {key: columnTitle, name: columnTitle, editor: TextEditor, editable: true}])
      }

      const addRow = () => {
        setRow([...row, {editor: TextEditor, editable: true}])
        console.log(row)
      }

      const handleRemoveColumn = () => {
        var index = column.map(function (col) { return col.name }).indexOf(removeColumn);
        console.log(index)
        console.log("remove pressed")
        if (index > -1) {
          column.splice(index, 1)
          setColumn([...column ])
          console.log("after splice", column)
        }
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
          <Input placeholder="Input table title"/> 
        </Form.Item>
        <Form.Item >
            <Input onChange={(e)=> {setColumnTitle(e.target.value)}} placeholder="Enter column title"></Input>
            <Button onClick={addColumn}>Add Column</Button>
            <Input onChange={(e)=> {setRemoveColumn(e.target.value)}} placeholder="Enter column title"></Input>
            <Button onClick={handleRemoveColumn}>Delete Column</Button>
            <Button onClick={addRow}>Add Row</Button>
            <Datagrid columns={column} rows={row} />
        </Form.Item>
        <Form.Item>
          <Button htmlType='submit'>Save</Button>
        </Form.Item>
        </Form>
      </Content>
    </Layout>      
</Layout>
    </div>
  )
}

export default Table
