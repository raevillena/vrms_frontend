import React, {useEffect, useState} from 'react'
import {Button, Collapse, Spin, Empty, Popconfirm, notification, List } from 'antd'
import { onGetAllTask,  onUpdateTaskUser } from '../services/taskAPI';
import { useSelector} from 'react-redux';
import moment from 'moment';
import AddComment from './AddComment';
import '../styles/CSS/Userdash.css'
import AddTask from './AddTask';


const { Panel } = Collapse;
const DisplayTasks = () => {
    const studyObj = useSelector(state => state.study)
    const userObj = useSelector(state => state.user)

    const [task , setTask] = useState([])
    const [loading, setloading] = useState(false)

    const [data, setData] = useState({task: '', length: 3})
    
    const notif = (type, message) => {
        notification[type]({
          message: 'Notification Title',
          description:
            message,
        });
      };



    useEffect(() => {
        async function getAllTask (){
            const forBackend = {
                studyName: studyObj.STUDY.title,
                assignee: userObj.USER.name
            }        
            setloading(true)
            let resultTask = await onGetAllTask(forBackend)
            console.log('result', resultTask)
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
                 assignee: [loopTask[i].assignee],
                 status: loopTask[i].status
               });
             }
             setTask(tempTaskData)
             setloading(false)
        }
        getAllTask()
    }, [studyObj.STUDY.title, userObj.USER.name])

    async function callback(key) {
            setData(task[key||0].id)
      }

      async function markComplete(key){
        try {
          let result =  await onUpdateTaskUser({taskId: task[key||0].id, status: "SUBMITTED"})
            notif('info', result.data.message)
            let newTask = [...task]
            newTask[key]= {...newTask[key], status : "SUBMITTED"}
            setTask(newTask) 
        } catch (error) {
            notif('error', error)
        }
    }

return (
    <div>
        {userObj.USER.category === "manager" ? <AddTask/> : 
        <div >
            {loading?  <div className="spinner"><Spin /> </div> : task.length===0 ? <Empty/> :
            <div>
            <Collapse accordion onChange={callback}>
                {task.map(tasks =>(
                <Panel header={tasks.taskTitle} key={tasks.key} extra={tasks.status === "ONGOING" ? 
                    <div>
                        <Popconfirm placement="leftTop" title="Continue to submit?" onConfirm={()=>markComplete(tasks.key)}>
                            <Button disabled={tasks.status === "SUBMITTED" ? true : false} style={{background: '#A0BF85', borderRadius: '50px'}}>
                                {tasks.status === "ONGOING" ? "Submit" : "SUBMITTED"}
                            </Button>
                        </Popconfirm>
                    </div> : 
                    <Button disabled={true} style={{background: '#A0BF85', borderRadius: '50px'}}>{tasks.status}</Button>}>
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
                            <List size="small"
                                dataSource={task.assignee}
                                renderItem={item => <List.Item>{item}</List.Item>}
                            >
                            </List>
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
        </div>}
    </div>
    )
}

export default DisplayTasks
