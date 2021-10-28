import React, {useState, useEffect} from 'react'
import {Table, Progress, Tag} from 'antd'
import { useSelector } from 'react-redux'
import { onGetAllProjectIP } from '../services/projectAPI'
import moment from 'moment'

const IndividualProjectTable = () => {
    let monitorObj = useSelector(state => state.monitor)
    const [data, setdata] = useState([])
    
    useEffect(() => {
        async function getProject() {
            let res = await onGetAllProjectIP(monitorObj.MONITOR.key)
            let resData = res.data
            let tempProj = []
            for (let i = 0; i < resData.length; i++) {
                tempProj.push({
                    key : resData[i]._id,
                    projectName: resData[i].projectName,
                    dateCreated: moment(resData[i].dateCreated).format('DD-MM-YYYY'),
                    program: resData[i].program,
                    status: [resData[i].status],
                    progress: resData[i].progress
                })
                
            }
            setdata(tempProj)
        }
        getProject()
    }, [monitorObj])

    const columns = [
        {
            title: 'Project Name',
            dataIndex: 'projectName',
            key: 'projectName',
        },
        {
            title: 'Date Created',
            dataIndex: 'dateCreated',
            key: 'dateCreated',
        },
        {
            title: 'Progress',
            dataIndex: 'progress',
            key: 'progress',
            render: progress=>
                <Progress percent={progress} size="small" />,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            filters: [
                { text: 'Completed', value: 'COMPLETED' },
                { text: 'Ongoing', value: 'ONGOING' },
              ],
              onFilter: (value, record) => record.status.indexOf(value) === 0,
              width: '15%',
              render: status => (
                <span>
                  {status.map(stat => {
                    let color = stat === 'Ongoing' ? 'geekblue' : 'green';
                    return (
                      <Tag color={color} key={stat}>
                        {stat.toUpperCase()}
                      </Tag>
                    );
                  })}
                </span>
              ),
        },
      ];
    return (
        <div>
            <Table size="small"  dataSource={data} columns={columns}></Table>
        </div>
    )
}

export default IndividualProjectTable
