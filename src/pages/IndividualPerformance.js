import React, { useState, useEffect } from 'react';
import { Line } from '@ant-design/charts';
import { onGetUserTaskProductivity } from '../services/taskAPI';
import _ from 'lodash'
import moment from 'moment';
import { useSelector } from 'react-redux';
import { FileTextFilled, ProjectFilled, FileFilled} from '@ant-design/icons';
import { Row, Col, Card} from 'antd'
import { onGetStudyForUser, onGetAllCreatedTable } from '../services/studyAPI';
import { onGetAllTaskMonitoring } from '../services/taskAPI';
import IndividualProjectTable from './IndividualProjectTable';

const { Meta } = Card

const IndividualPerformance = () => {
  let monitorObj = useSelector(state => state.monitor)
  const [state, setstate] = useState({'study': '', 'tasks': '', 'table': ''})
  const [loading, setLoading] = useState(true)
    const [data, setData] = useState([
        { month: 'January', value: 0 },
        { month: 'February', value: 0},
        { month: 'March', value: 0 },
        { month: 'April', value: 0 },
        { month: 'May', value: 0 },
        { month: 'June', value: 0 },
        { month: 'July', value: 0 },
        { month: 'August', value: 0 },
        { month: 'September', value: 0 },
        { month: 'October', value: 0 },
        { month: 'November', value: 0 },
        { month: 'December', value: 0 },
    ])
    useEffect(() => {
       try {
          async function getData(){
            let res = await  onGetUserTaskProductivity(monitorObj.MONITOR.key)
            let study =  await onGetStudyForUser({'_id': monitorObj.MONITOR.key})
            let task = await onGetAllTaskMonitoring(monitorObj.MONITOR.key)
            let table =  await onGetAllCreatedTable(monitorObj.MONITOR.name)
            let studyLength = study.data.length
            let taskLength = task.data.tasks.length
            let tableLength = table.data.length
            let arr = res.data.tasks
                const monthName = item => moment(item.deadline, 'YYYY-MM-DD').format('MM');
                const result = _.groupBy(arr, monthName);
                let tempArray =[]
            
                for (let i = 1; i < 13; i++) {
                 if(result[i] === undefined || result[i] === null){
                     tempArray.push({
                         month: moment(i, 'MM').format('MMMM'),
                         value: 0
                     }) 
                 } else{
                     let completed = _.filter(result[i], {status: 'COMPLETED'});
                     let denominator = result[i].length
                     let percentage = completed.length/denominator
                     tempArray.push({
                         month: moment(i, 'MM').format('MMMM'),
                         value: percentage*100
                     }) 
                 }
                }
                setData(tempArray)
                setstate({...state, study: studyLength, tasks: taskLength, table: tableLength})
                setLoading(false)
          }
          getData()  
        } catch (err) {
          console.log(err)
        }
    }, [monitorObj.MONITOR.key])

  const config = {
    data,
    height: 200,
    yField: 'value',
    xField: 'month',
    tooltip: {
      customContent: (title, items) => {
        return (
          <>
            <h5 style={{ marginTop: 16 }}>{title}</h5>
            <ul style={{ paddingLeft: 0 }}>
              {items?.map((item, index) => {
                const { name, value, color } = item;
                return (
                  <li
                    key={item.year}
                    className="g2-tooltip-list-item"
                    data-index={index}
                    style={{ marginBottom: 4, display: 'flex', alignItems: 'center' }}
                  >
                    <span className="g2-tooltip-marker" style={{ backgroundColor: color }}></span>
                    <span
                      style={{ display: 'inline-flex', flex: 1, justifyContent: 'space-between' }}
                    >
                      <span style={{ margiRight: 16 }}>{name}:</span>
                      <span className="g2-tooltip-list-item-value">{value}</span>
                    </span>
                  </li>
                );
              })}
            </ul>
          </>
        );
      },
    },
    point: {
      size: 4,
      shape: 'diamond',
      style: {
        fill: 'white',
        stroke: '#2593fc',
        lineWidth: 2,
      },
    },
  };

  return <div>
    <Row justify="space-around">
        <Col  span={23}>
          <Card style={{  borderRadius: '10px', fontStyle: 'Montserrat'}} size='small' hoverable title={`${monitorObj.MONITOR.name} Year Performance`} loading={loading}>
              <Line autoFit={true} {...config} />
          </Card>
        </Col>   
    </Row>
  <Row justify="space-around">
      <Col span={7}>
          <Card style={{  borderRadius: '10px', background: '#7CAD4F', fontStyle: 'Montserrat', marginTop: 16}} size='small' hoverable loading={loading}>
              <Meta style={{color: '#FFFFFF'}} title={state.study} description='Total Assigned Studies' avatar={<FileTextFilled style={{fontSize: '45px'}}/>}/>
          </Card>
      </Col>
      <Col span={7}>
          <Card style={{borderRadius: '10px', background: '#A0BF85', fontStyle: 'Montserrat', marginTop: 16}} size='small' hoverable loading={loading}>
              <Meta style={{color: '#FFFFFF'}} title={state.tasks} description='Total Assigned Tasks' avatar={<ProjectFilled style={{fontSize: '45px'}}/>}/>
          </Card>
      </Col>
      <Col span={7}>
          <Card style={{borderRadius: '10px', background: '#8EAA75', fontStyle: 'Montserrat', marginTop: 16}} size='small' hoverable loading={loading}>
              <Meta style={{color: '#FFFFFF'}} title={state.table} description='Total Created Table' avatar={<FileFilled style={{fontSize: '45px'}}/>}/>
          </Card>
      </Col>
</Row>
<Row justify="space-around">
      <Col span={23}>
          <Card style={{  borderRadius: '10px', fontStyle: 'Montserrat', marginTop: 16}} size='small' hoverable loading={loading} title='Projects'>
              <IndividualProjectTable />
          </Card>
      </Col>
</Row>
</div>
}

export default IndividualPerformance
