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
import IndividualStudiesTable from './IndividualStudiesTable'
import IndividualProgramTable from './IndividualProgramTable';
import IndividualTaskTable from './IndividualTaskTable';
import IndividualManagerGraph from './IndividualManagerGraph'
import { onGetAllProgramIP, onGetAllProjectIP } from '../services/projectAPI';

const { Meta } = Card

const IndividualPerformance = () => {
  let monitorObj = useSelector(state => state.monitor)
  const [state, setstate] = useState({'study': '', 'tasks': '', 'table': '', 'projects': '', 'programs': ''})
  const [props, setProps] = useState({'study': '', 'tasks': '', 'table': '', 'projects': '', 'programs': ''})
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
        let program = await onGetAllProgramIP(monitorObj.MONITOR.key)
        let project = await onGetAllProjectIP(monitorObj.MONITOR.key)
        let studyLength = study.data.length
        let taskLength = task.data.tasks.length
        let tableLength = table.data.length
        let programLength = program.data.length
        let projectLength = project.data.length
        let studydata = study.data
        let taskdata = task.data.tasks
        let tabledata = table.data
        let programdata = program.data
        let projectdata = project.data

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
        setstate({...state, study: studyLength, tasks: taskLength, table: tableLength, projects: projectLength, programs: programLength})
        setProps({...props, study: studydata, tasks: taskdata, table: tabledata, projects: projectdata, programs: programdata})
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
              {monitorObj.MONITOR.category[0] === 'user' ? <Line autoFit={true} {...config} /> : <IndividualManagerGraph data={props.projects}/>}
              
          </Card>
        </Col>   
    </Row>
    <Row justify="space-around">
      <Col span={7}>
          <Card style={{  borderRadius: '10px', background: '#7CAD4F', fontStyle: 'Montserrat', marginTop: 16}} size='small' hoverable loading={loading}>
              <Meta style={{color: '#FFFFFF'}} title={monitorObj.MONITOR.category[0] === 'user' ? state.study : state.programs} description={monitorObj.MONITOR.category[0] === 'user' ? 'Total Assigned Studies' : 'Total Assigned Programs'} avatar={<FileTextFilled style={{fontSize: '45px'}}/>}/>
          </Card>
      </Col>
      <Col span={7}>
          <Card style={{borderRadius: '10px', background: '#A0BF85', fontStyle: 'Montserrat', marginTop: 16}} size='small' hoverable loading={loading}>
              <Meta style={{color: '#FFFFFF'}} title={monitorObj.MONITOR.category[0] === 'user' ? state.tasks : state.projects} description={monitorObj.MONITOR.category[0] === 'user' ? 'Total Assigned Tasks' : 'Total Assigned Project'} avatar={<ProjectFilled style={{fontSize: '45px'}}/>}/>
          </Card>
      </Col>
      <Col span={7}>
          <Card style={{borderRadius: '10px', background: '#8EAA75', fontStyle: 'Montserrat', marginTop: 16}} size='small' hoverable loading={loading}>
              <Meta style={{color: '#FFFFFF'}} title={state.table} description='Total Created Table' avatar={<FileFilled style={{fontSize: '45px'}}/>}/>
          </Card>
      </Col>
    </Row>
    {monitorObj.MONITOR.category[0] === 'manager'? 
    <div>
    <Row justify="space-around">
    <Col span={23}>
        <Card style={{  borderRadius: '10px', fontStyle: 'Montserrat', marginTop: 16}} size='small' hoverable loading={loading} title='Program'>
            <IndividualProgramTable data={props.programs}/>
        </Card>
    </Col>
    </Row>
    <Row justify="space-around">
    <Col span={23}>
        <Card style={{  borderRadius: '10px', fontStyle: 'Montserrat', marginTop: 16}} size='small' hoverable loading={loading} title='Projects'>
            <IndividualProjectTable data={props.projects}/>
        </Card>
    </Col>
    </Row>
    </div> : 
    <div>
    <Row justify="space-around">
    <Col span={23}>
      <Card style={{  borderRadius: '10px', fontStyle: 'Montserrat', marginTop: 16}} size='small' hoverable loading={loading} title='Studies'>
          <IndividualStudiesTable data={props.study}/>
      </Card>
    </Col>
    </Row>
    <Row justify="space-around">
      <Col span={23}>
        <Card style={{  borderRadius: '10px', fontStyle: 'Montserrat', marginTop: 16}} size='small' hoverable loading={loading} title='Tasks'>
          <IndividualTaskTable data={props.tasks} />
        </Card>
      </Col>
    </Row>
    </div>}
  </div>
}

export default IndividualPerformance
