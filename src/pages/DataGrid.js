import React, {useState, useEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Layout, Menu, Button} from 'antd'
import logo from '../components/images/logo.png'
import { BookOutlined, UserOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router-dom';
import {
  DataSheetGrid,
  checkboxColumn,
  textColumn,
} from 'react-datasheet-grid'
import 'react-datasheet-grid/dist/index.css'
import Sidebar from '../components/components/Sidebar'


const { Header, Content, Sider } = Layout;

const DataGrid = () => {
  let history= useHistory();
  const dispatch = useDispatch();

  const [ data, setData ] = useState([
    { active: true, firstName: 'Ellon', lastName: 'Musk' },
    { active: false, firstName: 'Jeff', lastName: 'Bezos'},
  ])
const [columns, setColumns] = useState([
    checkboxColumn({ title: 'Active', key: 'active' }),
    textColumn({ title: 'First Name', key: 'firstName' }),
    textColumn({ title: 'Last name', key: 'lastName' }),
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

  const handleLogout = async () => {
    try {

      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      dispatch({
        type: "VERIFIED_AUTHENTICATION",
        value: false
     })
      history.push('/')
    } catch (error) {
      console.error(error)
      alert(error.response.data.error);
    }
  };

  const account = async () => {
    try {
      history.push("/account")
    } catch (error) {
      console.log(error)
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
          <Sidebar></Sidebar>
      </Sider>
    <Layout style={{ marginLeft: 200 }}>
      <Header style={{ padding: 0, background:'#f2f2f2' }} >
      <a href="/dash"style={{padding: '25px', fontSize: '32px', color: 'black', fontFamily: 'Montserrat'}} >Studies</a>
        <a  onClick={handleLogout}  style={{float: 'right', color:'black', fontFamily: 'Montserrat'}}>Logout</a>
      </Header>
      <Content style={{ margin: '24px 16px 0', overflow: 'initial' }} >          
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
