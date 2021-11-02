import React, {useState, useEffect} from 'react'
import {Table, Progress, Tag, Button} from 'antd'
import { useSelector, useDispatch } from 'react-redux'
import moment from 'moment'
import { useHistory } from 'react-router-dom'

const IndividualProjectTable = (props) => {
    let monitorObj = useSelector(state => state.monitor)
    const [data, setdata] = useState([])
    const dispatch = useDispatch()
    let history= useHistory();
    
    useEffect(() => {
        async function getProject() {
            let resData = props.data
            let tempProj = []
            for (let i = 0; i < resData.length; i++) {
                tempProj.push({
                  key:  resData[i]._id,
                  projectID:  resData[i].projectID,
                  projectLeader:  resData[i].assigneeName,
                  projectLeaderID:  resData[i].assignee,
                  programID: resData[i].program,
                  projectName:  resData[i].projectName,
                  dateCreated: moment( resData[i].dateCreated).format('MM-DD-YYYY'),
                  dateUpdated: moment( resData[i].dateUpdated).format('MM-DD-YYYY'),
                  progress:  resData[i].progress,
                  status: [resData[i].status]
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
            ellipsis: true
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
        {
          title: 'Action',
          dataIndex: 'action',
          key: 'action',
          fixed: 'right',
          width: '15%',
          render: (text, record, index) => <Button onClick = {
            (e) => {
              dispatch({
                type: "SET_PROJECT",
                value: record
             })
             history.push('/studies')
            }
          } type='link'>View</Button>
        },
      ];
    return (
        <div>
            <Table size="small" pagination={{ pageSizeOptions: ['5', '10'] }}  dataSource={data} columns={columns}></Table>
        </div>
    )
}

export default IndividualProjectTable
