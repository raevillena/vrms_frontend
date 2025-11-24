import React, {useState, useEffect, useMemo} from 'react';
import { DynamicDataSheetGrid, checkboxColumn,keyColumn} from 'react-datasheet-grid';
import { onEditDatagrid } from '../services/studyAPI';
import '../styles/CSS/Userdash.css'
import { notif} from '../functions/datagrid'
import {Button, Image, Spin} from 'antd'
 import {CameraFilled} from '@ant-design/icons'
 import { socket } from '../services/socket';


const ViewDatagrid = (props) => {

  //declaring initial states
  const [state, setState] = useState({
    title : '', 
    description: '', 
    isLoading: true, 
    deleteColumn: [], 
    disabledColumn: true,
    toRemoveColumn: [],
    imageFilename: '',
    ID: '',
    mode: '' //state of mode in terms od editing
  })
  const [datagridData, setDatagridData]= useState([])
  const [tempCol, setTempCol] = useState([])
  const [loading, setLoading] = useState(true)



  //declaring memoise and callbacks
  const columns = useMemo(() => tempCol, [tempCol]) //setting columns 
  const data = useMemo(() => datagridData, [datagridData])

  
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


const CameraComponent = React.memo(
    ({ rowData, setRowData }) => {
      return (
        <div style={{display:'flex', gap:'5px'}}>
        <div>
            <Button value={rowData}>
              <label className="file_input_id"><CameraFilled/>
                <input type="file"  accept="image/*" onChange={async e => {
                      const file = e.target.files[0]
                      const data = new FormData()
                      data.append("file", file)
                     // let result = await onUploadDataGrid(data) //uploading
                      //setRowData(result.data.filename)
                     // notif('info', result.data.message)
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

  const TextComponent = React.memo(
    ({ rowData, setRowData, active}) => { 
      return (
        <input
          className="dsg-input"
          style={{border: 'none'}}
          value={rowData}
        />
      )
    }
  )

  const textColumn = {
    component: TextComponent,
    deleteValue: () => '',
    copyValue: ({ rowData }) => rowData,
    pasteValue: ({ value }) => value,
  }

  const cameraColumn = {
    component: CameraComponent,
    deleteValue: () => '',
    copyValue: ({ rowData }) => rowData,
    pasteValue: ({ value }) => value,
  }
 
  useEffect(()=> { //getting data
    try {
      async function getEditData(){ //edit data
        setLoading(true)
        let resultDB =  await onEditDatagrid(props.data.id)
        let result = resultDB.data
        let tempCols=[]
        try{
          for(let j = 0; j < result[0].columns.length ; j++) {
            tempCols.push(checkColumnType(result[0].columns[j].type, result[0].columns[j].title))
          }
          setState({...state,
            title: result[0].title,
            description: result[0].description
          })
        }
        catch{
          console.log("functions failed for columns")
        }
        setDatagridData(result[0].data)
        setTempCol(tempCols)
        setLoading(false)
      }
      getEditData()
    } catch (error) {
      notif('error', 'There is something wrong! Unable to display data!')
    }
  }, [props.data])


  useEffect(() => {
    socket.on('receive-datagrid', msg => {
      setDatagridData(msg)
    })
  }, [])

  useEffect(() => {
    socket.on('receive-columns', msg => {
        try {
          if(msg === null|| msg=== undefined || msg === ''){
              return
          } else{
            let result  = checkColumnType(msg.type, msg.title)
            setTempCol([...tempCol, result])
          } 
        } catch (error) {
          notif('error', error)
        }
    })

    socket.on('receive-columns-delete', msg => {
        try {
          if(msg === null|| msg=== undefined || msg === ''){
              return
          } else{
            let tempCols =[]
            for(let j = 0; j < msg.length ; j++) {
              tempCols.push(checkColumnType(msg[j].type, msg[j].title))
            }
            setTempCol(tempCols)
          }
        } catch (error) {
          notif('error', error)
      }})
  }, [tempCol])

 

  return (
    <div>
          {loading ?  <div className="spinner"><Spin /> </div>  : 
        <DynamicDataSheetGrid
            data={data}
            columns={columns}
        />
    }
    </div>
  )
}

export default ViewDatagrid
