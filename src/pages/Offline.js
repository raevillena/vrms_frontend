import React, {useState, useRef, useLayoutEffect, useMemo, useCallback, useEffect} from 'react'
import {Button, Table, Modal, Input, Tooltip, Select} from 'antd'
import Layout1 from '../components/components/Layout1';
import {PlusSquareFilled, FontSizeOutlined, RetweetOutlined, CheckSquareFilled, DeleteFilled} from '@ant-design/icons'
import { useSelector} from 'react-redux';
import { DynamicDataSheetGrid, 
    checkboxColumn,
    keyColumn  } from 'react-datasheet-grid'
import { notif } from '../functions/datagrid';
import Cookies from 'universal-cookie';
import { useHistory } from 'react-router-dom';
import moment from 'moment';
import OfflineView from './../components/components/OfflineView'

const Offline = () => {
    const cookies = new Cookies();
    const  history = useHistory();
    const { Option } = Select
    const userObj = useSelector(state => state.user)
    //const authObj = useSelector(state => state.auth)
    const [state, setstate] = useState({
        title: '', 
        description: '', 
        columnsData: [], 
        disableCol: true, 
        removeCol: '', 
        disableCreate: true,
        addTable: '', 
        isModalImage: false,
        isModalAdd: false,
        dupCol : []
      })
      const [ addColumn, setAddColumn ] = useState([])
      const [col, setCol] = useState({newCol: '', replaceCol: []})
      const [ data, setData ] = useState([])
      const [isOnline, set_isOnline] = useState(false)
      const [cookie, setCookie] = useState([])
      const [isModalVisible, setIsModalVisible] = useState(false)
      const [manageData, setManageData] = useState({})

      let interval = null;
      const InternetErrMessagenger = () => set_isOnline(navigator.onLine);

      const new_data = (arr) => {
        let arrData = arr.state
        let tempArr = []
        for (let i = 0; i < arrData.length; i++) {
          tempArr.push({
            id: i,
            user: arrData[i].user,
            title: arrData[i].title,
            description: arrData[i].description,
            data: arrData[i].data,
            columns: arrData[i].columns,
            dateCreated: moment(arrData[i].dateCreated).format('MM-DD-YYYY')
          })
          setCookie(tempArr)
        }
        
      }
  
      const finaldata = useMemo(() => cookie, [cookie])

      useEffect(()=>{
        interval = setInterval(InternetErrMessagenger, 6000); // call the function name only not with function with call `()`
        return ()=>{
           clearInterval(interval) // for component unmount stop the interval
        }
     },[])
     
     useEffect(() => {
         if(isOnline === true){
             history.push('/')
         }else{
             return
         }
     }, [isOnline])


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
          return (
            <input
              ref={ref}
              className="dsg-input"
              style={{border: 'none'}}
              value={rowData}
              onChange={(e) => setRowData(e.target.value)}
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

    
      const [ tempCol, setTempCol ] = useState([{ //column
        ...keyColumn('Default', textColumn),
        title: 'Default',
        type: 'text'
      }])
    
      
      const columns = useMemo(() => tempCol, [tempCol]) //displaying columns in datasheet 
      const createRow = useCallback(() => ({}), []) //creating row

      const checkColumnType= (key,title) => {
        switch(key) {
            case 'Checkbox':
              return { ...keyColumn(title, checkboxColumn), title: title, type: 'Checkbox'}
            case 'text':
              return { ...keyColumn(title, textColumn), title: title,  type: 'text'}
            default:
                return { ...keyColumn(title, textColumn), title: title,  type: 'text'}
        }
    }
      
      const addTextColumn = () => {
        setTempCol([...columns, {
          ...keyColumn(addColumn, textColumn),
          title: addColumn,
          type: 'text'
        }])
        console.log('added column', columns)
        setAddColumn('')
      }
    
      const addCheckboxColumn = () => {
        setTempCol([...tempCol, {
          ...keyColumn(addColumn, checkboxColumn),
          title: addColumn,
          type:'Checkbox'
        }])
        setAddColumn('')
      }
    
      const removeColumn = (key) => {
        try {
          let newColumn = columns.filter(value => !key.includes(value.title));
          setTempCol(newColumn)
        } catch (error) {
          notif('error', error)
        }
      }

      useEffect(() => { //disable column
        if (addColumn === undefined ||addColumn ==='') {
          setstate({...state, disableCol: true})
        } else {
          setstate({...state, disableCol: false})
        }
      }, [addColumn]);

      useEffect(() => { //create button disable
        if (state.title === undefined ||state.title ===''|| state.description === undefined ||state.description ==='') {
          setstate({...state, disableCreate: true})
        } else {
          setstate({...state, disableCreate: false})
        }
      }, [state.title,state.description]);

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
        })
        setData([])
        setTempCol([checkColumnType('text','Default')])
        /*setTempCol([{ //column
          ...keyColumn('Sample', textColumn),
          title: 'Sample',
          type: 'text'
        }])*/
      };

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
          data.forEach((element) => {
            element[col.newCol] = element[col.replaceCol]
            delete element[col.replaceCol]
          })
          setCol({...col, newCol: '', replaceCol: []})
          
        }
      }

      
    function handleDuplicateColumn(value) { //handling duplicating table
        let arr = state.dupCol
        let tempColArr = []
        let obj = arr.find(o => o.title === value); 
        for (let index = 0; index < obj.value.length; index++) {
        tempColArr.push(checkColumnType(obj.value[index].type, obj.value[index].title))
        }
    setTempCol(tempColArr)
    }
    
    function saveToCookies(){
        console.log('off')
        setCookie([...cookie, {
          user: userObj.USER.name,
          title: state.title,
          description: state.description,
          data: data,
          columns: tempCol,
          id: cookie.length+1,
          dateCreated: moment(Date.now()).format('MM-DD-YYYY'),
        }])
        setstate({...state, 
          title: '', 
          description: '', 
          addColumn:'', 
          removeCol: '', 
          isModalAdd: false,
        })
        setData([])
        setTempCol([checkColumnType('text','Default')])
      }

      useEffect(() => {
        cookies.set('add', cookie);
        console.log(cookies.get('add'));
      }, [cookie])

      function handleColumnToDelete(value) { //handling deleting column
        setstate({...state, removeCol: value})
      }
    
      function handleColumnToReplace(value) { //setting column to delete
        setCol({...col, replaceCol: value})
      }
      
      const showModal = (record) => {
        console.log(record)
        setManageData(record)
        setIsModalVisible(!isModalVisible);
    };

    const handleCancelShow = () => {
      setIsModalVisible(false);
      setManageData({})
  }

    const tableColumn = [
        {
          title: 'Table ID',
          width: '10%',
          dataIndex: 'id',
          key: 'id',
          sorter: (a, b) => a.id - b.id,
        },
        {
          title: 'Title',
          width: '25%',
          dataIndex: 'title',
          key: 'title',
          ellipsis: true
        },
        {
            title: 'Description',
            width: '25%',
            dataIndex: 'description',
            key: 'description',
            ellipsis: true
        },
        {
            title: 'Date Created',
            width: '10%',
            dataIndex: 'dateCreated',
            key: 'dateCreated',
            filters: [{text: 'January', value: '01'},
              {text: 'February', value: '02'},
              {text: 'March', value: '03'},
              {text: 'April', value: '04'},
              {text: 'May', value: '05'},
              {text: 'June', value: '06'},
              {text: 'July', value: '07'},
              {text: 'August', value: '08'},
              {text: 'September', value: '09'},
              {text: 'October', value: '10'},
              {text: 'November', value: '11'},
              {text: 'December', value: '12'}
          ],
            onFilter: (value, record) => record.dateCreated.indexOf(value) === 0
        },
        {
            title: 'Action',
            key: 'operation',
            fixed: 'right',
            width: '10%',
            render: (text, record, index) => 
              <Button onClick={()=> showModal(record)} type='link'>View</Button>   
          },
        ]

        
    return (
        <div>
            <Layout1>
                <div style={{marginLeft: '20px', marginRight: '20px'}}> 
                    <Button style={{background: '#A0BF85', marginTop: '15px', display: userObj.USER.category === 'director' ? 'none' : 'initial' }} onClick={showModalAdd} icon={<PlusSquareFilled/>}>Add Table</Button>
                    <Table size="small" scroll={{ x: 1500, y: 500 }} columns={tableColumn} dataSource={finaldata} ></Table> 
                </div>
                <Modal visible={isModalVisible} footer={null} onCancel={handleCancelShow} width={1000} title="View Table">
                    <OfflineView data={manageData} func={new_data}/>
                </Modal>
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
                            <Input  placeholder="Enter Column title" onChange={(e)=> {setAddColumn(e.target.value)}} value={addColumn}/>
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
                        </div>
                        </div>
                        <div style={{display:'grid'}}>
                        <label style={{fontSize: '20px', fontFamily:'Montserrat'}}>
                            Delete Column 
                        </label>
                        <div style={{display:'flex', flexDirection:'row', gap:'5px', width:'300px'}}>
                            <Select placeholder="Select column title to delete" onChange={handleColumnToDelete} mode="tags" tokenSeparators={[',']} style={{ width: '100%' }}>
                                {tempCol.map(column => (
                                <Option key={column.title} value={column.title}>{column.title}</Option>
                                ))}
                            </Select>
                            <Tooltip placement='top' title='Delete Selected Column'> 
                                <Button danger onClick={() => removeColumn(state.removeCol)}><DeleteFilled/></Button> 
                            </Tooltip>
                        </div>
                        </div>
                    </div>
                    <div className="add-grid">
                    <div style={{display:'grid'}}>
                        <label style={{fontSize: '20px', fontFamily:'Montserrat'}}>
                            Duplicate Table 
                        </label>
                        <div style={{display:'flex', flexDirection:'row', gap:'5px'}}>
                            <Select placeholder="Select table to duplicate" onChange={handleDuplicateColumn}>
                                {state.dupCol.map(column => (
                                <Option key={column.title} value={column.title}>{column.title}</Option>
                                ))}
                            </Select>
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
                        </div>
                    <div style={{marginTop:'20px'}}>
                        <DynamicDataSheetGrid
                            data={data}
                            onChange={setData}
                            columns={columns}
                            createRow={createRow}
                        />
                        <div style={{marginTop: '20px', display: 'flex', justifyContent:'flex-end'}}>
                          <Button onClick={saveToCookies}>
                              Create
                          </Button>
                        </div>
                    </div>
                    </div>
                </Modal>
            </Layout1>
        </div>
    )
}

export default Offline
