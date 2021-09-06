import React, {useEffect, useState} from 'react'
import {Button, Collapse, Spin, Empty, Popconfirm, notification, Tooltip } from 'antd'
import {  onDeleteTask, onGetAllTaskManager, onUpdateTask } from '../services/taskAPI';
import { useSelector} from 'react-redux';
import moment from 'moment';
import AddComment from './AddComment';
import '../styles/CSS/Userdash.css'
import { DeleteFilled } from '@ant-design/icons';



const { Panel } = Collapse;
const ManagerDisplayTask = (props) => {
    const studyObj = useSelector(state => state.study)
    const projectObj = useSelector(state => state.project)

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
            setloading(true)
            let resultTask = await onGetAllTaskManager({studyName: studyObj.STUDY.title})
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
        getAllTask()
    }, [studyObj.STUDY.title])

    useEffect(() => {
        if(props.data == null||undefined||''){
            return
        }else{
        let newTask = props.data.newTask
       setTask([...task, {
           key: task.length +1,
           id: newTask._id,
           createdBy: newTask.createdBy,
           dateCreated: moment(newTask.dateCreated).format('MM-DD-YYYY HH:MM:SS'),
           lastUpdated: moment(newTask.lastUpdated).format('MM-DD-YYYY HH:MM:SS'),
           deadline: moment(newTask.deadline).format('MM-DD-YYYY HH:MM:SS'),
           taskTitle: newTask.tasksTitle,
           taskDescription: newTask.tasksDescription,
           assignee: newTask.assignee,
           status: newTask.status
       }])}

       async function getAllTask (){
        setloading(true)
        let resultTask = await onGetAllTaskManager({studyName: studyObj.STUDY.title})
        setloading(false)
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
         
    }
    getAllTask()

    }, [props.data])
    
    async function callback(key) {
            setData(task[key||0].id)
      }

      const handleRemove = (key) => { //deleting task
        let newData = task.filter((tempData) => {
          return tempData.key !== key
        })
        setTask(newData)
      }

    async function markComplete(key){
        try {
            let complete = task.filter(function(tasks){
                return tasks.status==="COMPLETED"
            }) 
            let progress = (complete.length+1)/task.length
            let progressDB =  Math.floor(progress*100)
            let result = await onUpdateTask({taskId: task[key||0].id, status: "COMPLETED", study: studyObj.STUDY.studyID, progress: progressDB, projectName: projectObj.PROJECT.projectName})
            notif('info', result.data.message)
            let newTask = [...task]
            newTask[key]= {...newTask[key], status : "COMPLETED"}
            setTask(newTask)
            
        } catch (error) {
            notif('error', error)
        }
    }

    async function deleteTask(key){
        try {
           let result =  await onDeleteTask({taskId: task[key||0].id, projectName: projectObj.PROJECT.projectName})
           handleRemove(key)
           notif('info', result.data.message)
        } catch (error) {
            notif('error', error)
        }
    }


    return (
        <div >
            {loading ?  <div className="spinner"><Spin /> </div> : task.length===0 ? <Empty/> :
            <div>
            <Collapse accordion onChange={callback} >
                {task.map(tasks =>(<Panel header={tasks.taskTitle} key={tasks.key} extra={ tasks.status === "SUBMITTED" ? 
                    <div>
                        <Popconfirm title="Are you sure?" onConfirm={()=>markComplete(tasks.key)}>
                            <Tooltip title="Click to complete task!" placement="leftTop">
                            <Button disabled={tasks.status==="COMPLETED"? true: false} style={{background: '#A0BF85', borderRadius: '50px'}}>{tasks.status}</Button>
                            </Tooltip>
                        </Popconfirm>
                    </div> : 
                    <div>
                        <Button disabled={true} >{tasks.status}</Button>
                        <Popconfirm title="Are you sure?" onConfirm={()=>deleteTask(tasks.key)}>
                        <Tooltip title="Click to delete task!" placement="leftTop">
                            <Button danger icon={<DeleteFilled/>}></Button>
                        </Tooltip>
                        </Popconfirm>
                    </div>
                        }>
                    
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

export default ManagerDisplayTask
