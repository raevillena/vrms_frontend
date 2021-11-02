import React, {useState, useEffect} from 'react'
import {Table, Tag} from 'antd'
import moment from 'moment'


const IndividualTasksTable = (props) => {
    const [data, setdata] = useState([])

    useEffect(() => {
        async function getProject() {
            let resData = props.data
            let tempArr = []
            for (let i = 0; i < resData.length; i++) {
                tempArr.push({
                    key: resData[i]._id,
                    title: resData[i].tasksTitle,
                    description: resData[i].tasksDescription,
                    studyID: resData[i].studyName,
                    dateCreated: moment(resData[i].dateCreated).format('MM-DD-YYYY'),
                    dateUpdated: moment(resData[i].dateUpdated).format('MM-DD-YYYY'),
                    progress: resData[i].progress,
                    status: [resData[i].status],
                    updatedBy: resData[i].updatedBy,
                    deadline: resData[i].deadline,
                    objective: resData[i].objective,
                })
            }
            setdata(tempArr)
        }
        getProject()
    }, [props])

    const columns = [
        {
            title: 'Task',
            dataIndex: 'title',
            key: 'title',
            ellipsis: true
        },
        {
            title: 'Task Description',
            dataIndex: 'description',
            key: 'description',
            ellipsis: true
        },
        {
          title: 'Objective',
          dataIndex: 'objective',
          key: 'objective',
          ellipsis: true
      },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            filters: [
                { text: 'Completed', value: 'COMPLETED' },
                { text: 'Ongoing', value: 'ONGOING' },
                { text: 'Submitted', value: 'SUBMITTED' },
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
            <Table size="small" pagination={{ pageSizeOptions: ['5', '10'] }}  dataSource={data} columns={columns}></Table>
        </div>
    )
}

export default IndividualTasksTable
