import React, {useState, useEffect} from 'react'
import {Table, Progress, Tag, Button} from 'antd'
import { useSelector, useDispatch } from 'react-redux'
import moment from 'moment'
import {useHistory} from 'react-router-dom'

const IndividualStudiesTable = (props) => {
  let monitorObj = useSelector(state => state.monitor)
  let userObj = useSelector(state => state.user)
  const [data, setdata] = useState([])
  const dispatch = useDispatch()
  let history= useHistory();

  useEffect(() => {
    async function getProject() {
      let resData = props.data
      let tempArr = []
      for (let i = 0; i < resData.length; i++) {
        tempArr.push({
            key: resData[i]._id,
            title: resData[i].studyTitle,
            studyID: resData[i].studyID,
            dateCreated: moment(resData[i].dateCreated).format('MM-DD-YYYY'),
            dateUpdated: moment(resData[i].dateUpdated).format('MM-DD-YYYY'),
            progress: resData[i].progress,
            status: [resData[i].status],
            updatedBy: resData[i].updatedBy,
            deadline: moment(resData[i].deadline).format('MM-DD-YYYY'),
            objectives: resData[i].objectives,
        })
      }
      setdata(tempArr)
    }
    getProject()
  }, [monitorObj])

  const columns = [
    {
      title: 'Study Title',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true
    },
    {
      title: 'Date Created',
      dataIndex: 'dateCreated',
      key: 'dateCreated',
    },
    {
      title: 'Deadline',
      dataIndex: 'deadline',
      key: 'deadline',
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
            type: "SET_STUDY",
            value: record
        })
        history.push('/editstudy')
        }
      } type='link'>View</Button>
      }
    ];

    const columns2 = [
      {
        title: 'Study Title',
        dataIndex: 'title',
        key: 'title',
        ellipsis: true
      },
      {
        title: 'Date Created',
        dataIndex: 'dateCreated',
        key: 'dateCreated',
      },
      {
        title: 'Deadline',
        dataIndex: 'deadline',
        key: 'deadline',
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
        {userObj.USER.category === 'director'? <Table size="small"  dataSource={data} columns={columns}></Table>: 
        <Table size="small" dataSource={data} columns={columns2}></Table>}
      </div>
    )
}

export default IndividualStudiesTable
