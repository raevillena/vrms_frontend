import React, {useState, useEffect} from 'react'
import {Table} from 'antd'
import { useSelector } from 'react-redux'
import moment from 'moment'

const IndividualProgramTable = (props) => {
    let monitorObj = useSelector(state => state.monitor)
    const [data, setdata] = useState([])
    
    useEffect(() => {
        async function getProject() {
            let resData = props.data
            let tempProj = []
            for (let i = 0; i < resData.length; i++) {
                tempProj.push({
                    key:  i,
                    programID: resData[i].programID,
                    programName: resData[i].programName,
                    programLeader:  resData[i].assigneeName.join(),
                    programLeaderID:  resData[i].assignee,
                    dateCreated: moment( resData[i].dateCreated).format('MM-DD-YYYY'),
                })
            }
            setdata(tempProj)
        }
        getProject()
    }, [monitorObj])

    const columns = [
        {
            title: 'Program Name',
            dataIndex: 'programName',
            key: 'programName',
        },
        {
            title: 'Program Leader',
            dataIndex: 'programLeader',
            key: 'programLeader',
        },
        {
            title: 'Date Created',
            dataIndex: 'dateCreated',
            key: 'dateCreated',
        },

      ];
    return (
        <div>
            <Table size="small" pagination={{ pageSizeOptions: ['5', '10'] }}  dataSource={data} columns={columns}></Table>
        </div>
    )
}

export default IndividualProgramTable
