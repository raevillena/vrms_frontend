import React, {useEffect, useState} from 'react'
import {Button, Collapse, Spin, Empty, Typography } from 'antd'
import { onGetAllTask } from '../services/taskAPI';
import { useSelector} from 'react-redux';
import moment from 'moment';
import AddComment from './AddComment';
import '../styles/CSS/Userdash.css'



const { Panel } = Collapse;
const DisplayTasks = () => {
    const studyObj = useSelector(state => state.study)
    const userObj = useSelector(state => state.user)

    const [task , setTask] = useState([])
    const [loading, setloading] = useState(false)

    const [data, setData] = useState({task: '', length: 3})

    const forBackend = {
        studyName: studyObj.STUDY.title,
        assignee: userObj.USER.name
    }

    async function getAllTask (){
        setloading(true)
        let resultTask = await onGetAllTask(forBackend)
        let loopTask = resultTask.data.tasks
        let tempTaskData = []
         for(let i = 0; i < loopTask.length; i++){ 
           tempTaskData.push({
             key: [i],
             id: loopTask[i]._id,
             createdBy: loopTask[i].createdBy,
             dateCreated: moment(loopTask[i].dateCreated).format('MM-DD-YYYY HH:MM:SS'),
             lastUpdated: moment(loopTask[i].lastUpdated).format('MM-DD-YYYY HH:MM:SS'),
             deadline: moment(loopTask[i].deadline).format('MM-DD-YYYY HH:MM:SS'),
             taskTitle: loopTask[i].tasksTitle,
             taskDescription: loopTask[i].tasksDescription,
             assignee: loopTask[i].assignee,
             status: loopTask[i].status
           });
         }
         setTask(tempTaskData)
         setloading(false)
    }

    useEffect( async () => {
        getAllTask()
    }, [])

    
    async function callback(key) {
            setData(task[key||0].id)
      }

    return (
        <div >
            {loading?  <div className="spinner"><Spin /> </div> : task.length==0 ? <Empty/> :
            <div>
            <Collapse accordion onChange={callback}>
                {task.map(tasks =>(<Panel header={tasks.taskTitle} key={tasks.key} extra={<Button style={{background: '#A0BF85', borderRadius: '50px'}}>{tasks.status}</Button>}>
                    <div>
                        <div style={{display: 'flex', gap: '5px'}}>
                            <label style={{fontWeight:'bolder'}}>Task:</label>
                            <p>{tasks.taskDescription}</p>
                        </div>
                        <div style={{display: 'grid', margin: '0px'}}>
                        <div style={{display: 'flex', gap: '5px', lineHeight:'2px'}}>
                            <label style={{fontWeight:'bold'}}>Date Created:</label>
                            <p>{tasks.dateCreated}</p>
                        </div>
                        <div style={{display: 'flex', gap: '5px', lineHeight:'2px'}}>
                            <label style={{fontWeight:'bold'}}>Last Updated:</label>
                            <p>{tasks.lastUpdated}</p>
                        </div>
                        <div style={{display: 'flex', gap: '5px',lineHeight:'2px'}}>
                            <label style={{fontWeight:'bold'}}>Deadline:</label>
                            <p>{tasks.deadline}</p>
                        </div>
                        <div style={{display: 'flex', gap: '5px',lineHeight:'2px'}}>
                            <label style={{fontWeight:'bold'}}>Assignee:</label>
                            <p>{tasks.assignee}</p>
                        </div>
                        <div style={{display: 'flex', gap: '5px', lineHeight:'2px'}}>
                            <label style={{fontWeight:'bold'}}>Adviser:</label>
                            <p>{tasks.createdBy}</p>
                        </div>
                        <div>
                            <label style={{fontWeight:'bold'}}>Comments:</label>
                            <AddComment data={data}/>
                        </div>
                        </div>
                    </div>
                </Panel>))}
            </Collapse></div>  }
        </div>
    )
}

export default DisplayTasks
