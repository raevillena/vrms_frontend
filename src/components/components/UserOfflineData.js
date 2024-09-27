import React, {useState, useMemo, useRef, useLayoutEffect, useCallback, useEffect} from 'react'
import { Input, Button, Select, Spin, Image, Tooltip } from 'antd'
import { DynamicDataSheetGrid, keyColumn, checkboxColumn } from 'react-datasheet-grid'
import {CheckSquareFilled, CameraFilled, DeleteFilled, FontSizeOutlined, LoadingOutlined, UndoOutlined, RedoOutlined, RetweetOutlined } from '@ant-design/icons';
import { onUploadDataGrid } from '../../services/uploadAPI';
import { notif } from '../../functions/datagrid';
import { onMoveOfflineData } from '../../services/offline';
import { onGetStudyForUser } from '../../services/studyAPI';
import { useSelector, useDispatch} from 'react-redux';

const UserOfflineData = (props) => {
    const dispatch = useDispatch();
    //redux states
    //const studyObj = useSelector(state => state.study)
    const userObj = useSelector(state => state.user)
    const undoObj = useSelector(state => state.undo)
    const redoObj = useSelector(state => state.redo)
    const [state, setState] = useState({
        title : props.data.title, 
        description: props.data.description, 
        isLoading: true, 
        deleteColumn: [], 
        disabledColumn: true,
        toRemoveColumn: [],
        index: props.data.id
      })
    const [datagridData, setDatagridData]= useState([])
    const [addColumn, setAddColumn] = useState('')//add column data
    const [tempCol, setTempCol] = useState([])
    const [col, setCol] = useState({newCol: '', replaceCol: []})
    const [study, setStudy] = useState([])
    const { Option } = Select;

    const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;


    const data = useMemo(() => datagridData, [datagridData])
    const columns = useMemo(() => tempCol, [tempCol]) //setting columns
    const createRow = useCallback(() => ({}), []) //create row 

    const [toMove, setToMove] = useState({
      data: '',
      columns: '',
      tableID: props.data.tableID,
      title: state.title,
      description: state.description,
      uploadedBy: userObj.USER.name,
      studyID: '',
      user: userObj.USER.name
    })


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

    const TextComponent = React.memo(
        ({ rowData, setRowData, active}) => {
          const ref = useRef(null);
          useLayoutEffect(() => {
            if (active) {
                ref.current?.focus();
            } else {
                ref.current?.blur();
            }
          }, [active]);
          const handleOnChange = (e) =>{
              setRowData(e.target.value)
          }
          return (
            <input
              ref={ref}
              className="dsg-input"
              style={{border: 'none'}}
              value={rowData}
              onChange={(e) => handleOnChange(e)}
            />
          )
        }
      )
    
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
                          let result = await onUploadDataGrid(data) //uploading
                          setRowData(result.data.filename)
                          notif('info', result.data.message)
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

      useEffect(() => {
          async function getStudy(){
             let res = await onGetStudyForUser(userObj.USER)
             let arr = res.data
             let tempStudy = []
             for (let i = 0; i < arr.length; i++) {
                 tempStudy.push({
                    studyID: arr[i].studyID,
                    studyName: arr[i].studyTitle
                 })
             }
             setStudy(tempStudy)
          }
          getStudy()
      }, [])

      useEffect(() => {
          async function getEditData(){
            let editCol = props.data.columns
            let tempCols = []
            for (let i = 0; i < editCol.length; i++) {
                tempCols.push(checkColumnType(editCol[i].type, editCol[i].title)) 
            }
            setDatagridData(props.data.data)
            setTempCol(tempCols)
            setState({...state, title: props.data.title, description: props.data.description, tableID: props.data.tableID})
          }
          getEditData()
          setToMove({...toMove, data: datagridData, columns: tempCol, tableID: props.data.tableID})
      }, [props.data])

      useEffect(() => {
        setToMove({...toMove, data: datagridData, columns: tempCol})
      }, [datagridData, tempCol])

      useEffect(() => { //disable buttons for adding column
        if (addColumn === undefined ||addColumn ==='') {
          setState({...state, disabledColumn: true});
        } else {
          setState({...state, disabledColumn: false});
        }
      }, [addColumn]);

      function handleColumnToDelete(value) { //setting column to delete
        setState({...state, toRemoveColumn: value})
      }
    
      function handleColumnToReplace(value) { //setting column to delete
        setCol({...col, replaceCol: value})
      }

      const addTextColumn = () => {
        setTempCol([...columns, {
          ...keyColumn(addColumn, textColumn),
          title: addColumn,
          type: 'text'
        }])
        dispatch({
          type: "SET_UNDO",
          column: tempCol,
        })
        setAddColumn('')
      }

      const addCheckboxColumn = () => {
        setTempCol([...columns, {
          ...keyColumn(addColumn, checkboxColumn),
          title: addColumn,
          type: 'Checkbox'
        }])
        dispatch({
          type: "SET_UNDO",
          column: tempCol,
        })
        setAddColumn('')
      }

      const addCameraColumn = () => {
        setTempCol([...columns, {
          ...keyColumn(addColumn, cameraColumn),
          title: addColumn,
          type: 'camera'
        }])
        dispatch({
          type: "SET_UNDO",
          column: tempCol,
        })
        setAddColumn('')
      }

      const removeColumn = (key) => { //removing column
        try{
          let editCol = tempCol
          let undo_arr = []
          
          datagridData.forEach((element) => {
            undo_arr = [...undo_arr, Object.assign({},element)]
            delete element[key]
          })
    
          let newColumn = editCol.filter(value => !key.includes(value.title));
          setTempCol(newColumn)
          setState({...state, toRemoveColumn: []})
    
          dispatch({
            type: "DELETE_COL",
            column: editCol,
            data: undo_arr
          })
          dispatch({
            type: "PRESS_REDO"
          })
        }catch(error){
          notif('error', error)
        }
      }

      const undoFunction = () => {
        try {
          let col = undoObj.column
          let tempCols =[]
          for(let j = 0; j < col.length ; j++) {
            tempCols.push(checkColumnType(col[j].type, col[j].title))
          }
          dispatch({
            type: "PRESS_UNDO",
            column: tempCol,
            data: datagridData
          })
    
          setTempCol(tempCols)
          setDatagridData(undoObj.data)
        } catch (error) {
          notif('error', error)
        }
      }
    
      const redoFunction = () => {
        try {
          let col = redoObj.column
          let tempCols =[]
          for(let j = 0; j < col.length ; j++) {
            tempCols.push(checkColumnType(col[j].type, col[j].title))
          }
          dispatch({
            type: "PRESS_REDO",
            column: undoObj.column,
            data: undoObj.datas
          })
          setTempCol(tempCols)
          setDatagridData(redoObj.data)
        } catch (error) {
          notif('error', error)
        }
      }
    
      const handleReplace = () =>{
          if(col.newCol === ''){
            notif('error', 'New column anme is empty!')
          }else{
            let arr = []
    
            let index = tempCol.findIndex((obj => obj.title === col.replaceCol))
            tempCol[index].title = col.newCol
            tempCol.forEach((col) => {
              arr.push(checkColumnType(col.type, col.title))
            })
            setTempCol(arr)
            datagridData.forEach((element) => {
              element[col.newCol] = element[col.replaceCol]
              delete element[col.replaceCol]
            })
            setCol({...col, newCol: '', replaceCol: []})
            
          }
      }

      const handleStudyChange = (value) =>{
        setToMove({...toMove, studyID: value})
      }

      const handleSubmit = async () =>{
        let res = await onMoveOfflineData(toMove)
        notif('info', res.data.message)
        props.func({index: state.index})
      }

    return (
        <div>        
         <div>
        <div className="add-grid">
          <div style={{display:'grid'}}>
            <label style={{fontSize: '20px', fontFamily:'Montserrat'}}>
              Table Title
            </label>
            <Input  placeholder="Input table title" onChange={(e)=> {setState({...state, title: e.target.value})}} value={state.title}/> 
          </div>
          <div style={{display:'grid'}}>
            <label style={{fontSize: '20px', fontFamily:'Montserrat'}}>
              Table Description
            </label>
            <Input  placeholder="Enter table description" onChange={(e)=> {setState({...state, description: e.target.value})}} value={state.description}/>
          </div>
          <div style={{display:'grid'}}>
              <label style={{fontSize: '20px', fontFamily:'Montserrat'}}>
                Column Title
              </label>
              <div style={{display:'flex', flexDirection:'row', gap:'3px'}}>
                  <Input  placeholder="Enter Column title" onChange={(e)=> {setAddColumn( e.target.value)}} value={addColumn} />
                  <Tooltip placement='top' title='Text Column'>
                    <Button disabled={state.disabledColumn}  onClick={addTextColumn}>
                      <FontSizeOutlined />
                    </Button>
                  </Tooltip>
                  <Tooltip placement='top' title='Checkbox Column'>
                    <Button disabled={state.disabledColumn}  onClick={addCheckboxColumn} >
                      <CheckSquareFilled />
                    </Button>
                  </Tooltip>
                  <Tooltip placement='top' title='Camera Column'>
                    <Button disabled={state.disabledColumn} onClick={addCameraColumn} >
                      <CameraFilled />
                    </Button>
                  </Tooltip>
              </div>
          </div>
          <div style={{display:'grid'}}>
              <label style={{fontSize: '20px', fontFamily:'Montserrat'}}>
                Edit Column Title
              </label>
              <div style={{display:'flex', flexDirection:'row', gap:'3px'}}>
                  <Input  placeholder="Enter New Column title" onChange={(e)=> {setCol({...col, newCol: e.target.value})}} value={col.newCol} />
                  <Select placeholder="Column to Replace" onChange={handleColumnToReplace}  value={col.replaceCol}  >
                  {tempCol.map(column => (
                    <Option key={column.title} value={column.title}>{column.title}</Option>
                  ))}
                </Select>
                  <Tooltip placement='top' title='Replace Column Title'>
                    <Button onClick={handleReplace}>
                      <RetweetOutlined />
                    </Button>
                  </Tooltip>
              </div>
          </div>
          <div style={{display:'grid'}}>
            <label style={{fontSize: '20px', fontFamily:'Montserrat'}}>
              Delete Column 
            </label>
            <div style={{display:'flex', flexDirection:'row', gap:'5px'}}>
                <Select placeholder="Select column title to delete" onChange={handleColumnToDelete} value={state.toRemoveColumn} mode="tags" tokenSeparators={[',']} style={{width: 150}}>
                  {tempCol.map(column => (
                    <Option key={column.title} value={column.title}>{column.title}</Option>
                  ))}
                </Select>
                <Tooltip placement='top' title='Delete Selected Column'> 
                  <Button danger onClick={() =>  removeColumn(state.toRemoveColumn)}>
                    <DeleteFilled/>
                  </Button> 
                </Tooltip>
                
                <Tooltip placement='top' title='Undo'> 
                  {undoObj.buttonEnable? (
                    <Button onClick={() => undoFunction()}>
                      <UndoOutlined />
                    </Button>
                  ):(
                    <Button disabled onClick={() => undoFunction()}>
                      <UndoOutlined />
                    </Button>
                  )}

                </Tooltip>

                <Tooltip placement='top' title='Redo'>
                  {redoObj.buttonEnable? (
                    <Button onClick={()=> redoFunction()}>
                        <RedoOutlined />
                    </Button>
                  ):(
                    <Button disabled onClick={()=> redoFunction()}>
                        <RedoOutlined />
                    </Button>
                  )}
                </Tooltip>
            </div>
          </div>
        </div> 
        <div className='add-datagrid'>
          <div style={{display: 'grid'}}>
            <label style={{fontSize: '20px', fontFamily:'Montserrat'}}>
              Study
            </label>
            <Select placeholder="Select study" onChange={handleStudyChange}>
                {study.map(stud =>(
                  <Option key={stud.studyID} value={stud.studyID}>{stud.studyName}</Option>
                ))}
            </Select>
          </div>
          </div> 
        <div style={{marginTop:'20px'}}>
          {datagridData && datagridData.constructor === Array && datagridData.length === 0 ?  <div className="spinner"><Spin indicator={antIcon}/> </div>: 
            <div >
                <DynamicDataSheetGrid
                    data={data}
                    onChange={setDatagridData}
                    columns={columns}
                    createRow={createRow}
                />
                </div>
            }
            </div>
            </div>
            <div style={{marginTop: '20px', display:'flex', justifyContent:'flex-end', gap: '10px'}}>
                <Button type='primary' onClick={handleSubmit}>Save Changes</Button>
            </div>
        </div>
    )
}

export default UserOfflineData
