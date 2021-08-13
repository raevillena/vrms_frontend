import React, {useEffect, useState, useMemo} from 'react'
import {Button, Collapse} from 'antd'
import { onGetAllTask } from '../services/taskAPI';
import { useSelector} from 'react-redux';


const { Panel } = Collapse;
const DisplayTasks = () => {
    const studyObj = useSelector(state => state.study)
    const userObj = useSelector(state => state.user)

    const [task , setTask] = useState([])

    const forBackend = {
        studyName: studyObj.STUDY.title,
        assignee: userObj.USER.name
    }

    useEffect( async () => {
       let resultTask = await onGetAllTask(forBackend)
       console.log('task', resultTask)
       let loopTask = resultTask.data.tasks
       let tempTaskData = []
        for(let i = 0; i < loopTask.length; i++){ 
          tempTaskData.push({
            key: loopTask[i],
            createdBy: loopTask[i].createdBy,
            dateCreated: loopTask[i].dateCreated,
            lastUpdated: loopTask[i].lastUpdated,
            deadline: loopTask[i].deadline,
            taskTitle: loopTask[i].tasksTitle,
            taskDescription: loopTask[i].tasksDescription,
            assignee: loopTask[i].assignee,
            status: loopTask[i].status
          });
        }
        setTask(tempTaskData)
        
    }, [])

  
    return (
        <div style={{marginTop: '20px'}}>
            <Collapse accordion>
                {task.map(tasks =>(<Panel header={tasks.taskTitle} key={tasks.key} extra={<Button style={{background: '#A0BF85', borderRadius: '50px'}}>Assigned</Button>}>
                    <div>
                        <div>
                            <label>Task:</label>
                            <p>{tasks.taskDescription}</p>
                        </div>
                        <div>
                            <label>Last Updated:</label>
                            <p>{tasks.lastUpdated}</p>
                        </div>
                        <div>
                            <label>Deadline</label>
                            <p>{tasks.deadline}</p>
                        </div>
                        <div>
                            <label>Assignee:</label>
                            <p>{tasks.assignee}</p>
                        </div>
                        <div>
                            <label>Adviser:</label>
                            <p>{tasks.createdBy}</p>
                        </div>
                    </div>
                </Panel>))}
            </Collapse>
        </div>
    )
}

export default DisplayTasks
