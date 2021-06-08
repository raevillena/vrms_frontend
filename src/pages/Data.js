import React, {useState, useEffect} from 'react'
import ReactDataSheet from 'react-datasheet';
import 'react-datasheet/lib/react-datasheet.css';


export default function Data() {

    const defaultData = [
        [
            { value: 1 }, 
            { value: 3 }
        ],
        [
            { value: 2 }, 
            { value: 4 }
        ],
    ]

    const [cellData, setCellData] = useState(defaultData)


    useEffect(() => {
        console.log(cellData)
    }, [cellData])

    return (
        <div>
            <ReactDataSheet
                data={cellData}
                valueRenderer={cell => cell.value}
                onCellsChanged={changes => {
                    const grid = cellData.map(row => [...row]);
                    changes.forEach(({ cell, row, col, value }) => {
                        grid[row][col] = { ...grid[row][col], value };
                    });
                    setCellData(grid)
                }}
            />
        </div>
    )
}
