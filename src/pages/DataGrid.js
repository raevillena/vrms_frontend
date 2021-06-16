import React, {useState, useEffect} from 'react'

import {
    DataSheetGrid,
    checkboxColumn,
    textColumn,
  } from 'react-datasheet-grid'
  import 'react-datasheet-grid/dist/index.css'
  
  export default function DataGrid() {
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
        setColumns([...columns, textColumn({title: <div>{newColumn}<button>camera</button></div>, key: newColumn})])
    }
      return (
        <div>
            <DataSheetGrid
          data={data}
          onChange={setData}
          columns={columns}
        
        />
        <input onChange={(e)=> {setNewColumn(e.target.value)}}/>
        <button onClick={addNewColumn}>
            CLICK ME
        </button>
        
        </div>
      )
}


