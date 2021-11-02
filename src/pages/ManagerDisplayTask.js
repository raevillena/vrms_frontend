import React, { useState, useEffect, useRef} from 'react'
import {Button, Collapse, Form, Empty, Popconfirm, notification, Tooltip, Table, Tag,Modal, Upload, Input, Space } from 'antd'
import {  onDeleteTask, onGetAllTaskManager, onGetFileList, onGetManagerCSV, onUpdateTask } from '../services/taskAPI';
import { useSelector} from 'react-redux';
import moment from 'moment';
import AddComment from './AddComment';
import '../styles/CSS/Userdash.css'
import { DeleteFilled, UploadOutlined } from '@ant-design/icons';
import { onDownloadFileTask, onUploadTaskFile } from '../services/uploadAPI';
import { CSVLink } from 'react-csv';




const { Panel } = Collapse;
const ManagerDisplayTask = (props) => {
    const studyObj = useSelector(state => state.study)
    const userObj = useSelector(state => state.user)
    const projectObj = useSelector(state => state.project)
    const csvLink = useRef() 

    const [task , setTask] = useState([])
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [taskModal, setTaskModal] = useState({taskTitle: '', dateCreated: '', taskDescription: '', lastUpdated:'', deadline: '', assignee: '', createdBy: '',verification: '', status: ''})
    const [fileData, setfileData] = useState({file: '', description: '', dateUploaded: '', uploadedBy: ''})
    const [data, setData] = useState({task: '', length: 3})
    const [visible, setVisible] = useState(false); //modal2
    const [description, setDescription] = useState();
    const [obj, setObj] = useState() 
    const [ fileDataDownload, setFileDataDownload ] = useState([]); //download report

    const [fileHeaders] = useState([
        {label: 'Task Title', key: 'title'},
        {label: 'Task Desription', key: 'description'},
        {label: 'Means of Verification', key: 'verification'},
        {label: 'Objective', key: 'objective'},
        {label: 'Assignee', key: 'assignee'},
        {label: 'Deadline', key: 'deadline'},
        {label: 'Status', key: 'status'},
      ])
      

    const dataForm = new FormData()
    const initialValues = { description: '', data: ''}
    const [form] = Form.useForm();

    const notif = (type, message) => {
        notification[type]({
          message: 'Notification Title',
          description:
            message,
        });
      };

      const handleCancel = () => {
        setIsModalVisible(false);
      };

      useEffect(()=>{
        try {
            const handleDataFetch = async() => {
                const response = await onGetManagerCSV(studyObj.STUDY.studyID)
                let x = response.data.tasks
                let tempData = []
                for (let i = 0; i < x.length; i++) {
                   tempData.push({
                       title: x[i].tasksTitle,
                       description:  x[i].tasksDescription,
                       verification:  x[i].verification,
                       status:  x[i].status,
                       objective:  x[i].objective,
                       deadline: moment( x[i].deadline).format('YYYY-MM-DD'),
                       assignee:  x[i].assigneeName.join(),
                   })
                }
                setFileDataDownload(tempData)
              };
            handleDataFetch(); 
        } catch (error) {
            console.log(error)
        }
      }, [])

      useEffect(() => {
         try {
            if(props.data == null||undefined||''){
                return
            }else{
            let newTask = props.data.newTask
            if(obj === newTask.objective){
                setTask([...task, {
                    key: newTask._id,
                    id: newTask._id,
                    createdBy: newTask.createdBy,
                    createdByName: newTask.createdByName,
                    dateCreated: moment(newTask.dateCreated).format('MM-DD-YYYY'),
                    lastUpdated: moment(newTask.lastUpdated).format('MM-DD-YYYY'),
                    deadline: moment(newTask.deadline).format('MM-DD-YYYY'),
                    taskTitle: newTask.tasksTitle,
                    taskDescription: newTask.tasksDescription,
                    verification: newTask.verification,
                    assignee: newTask.assigneeName,
                    status: [newTask.status]
                }])
            }else{
                return
            }
            }
         } catch (error) {
             console.log(error)
         } 
      }, [props.data])
    
    async function callback(key) {
            setObj(key)
            let resultTask = await onGetAllTaskManager({studyName: studyObj.STUDY.studyID, objective: key})
            let loopTask = resultTask.data.tasks
            let tempTaskData = []
             for(let i = 0; i < loopTask.length; i++){ 
               tempTaskData.push({
                 key: loopTask[i]._id,
                 id: loopTask[i]._id,
                 createdBy: loopTask[i].createdBy,
                 createdByName: loopTask[i].createdByName,
                 dateCreated: moment(loopTask[i].dateCreated).format('MM-DD-YYYY'),
                 lastUpdated: moment(loopTask[i].lastUpdated).format('MM-DD-YYYY'),
                 deadline: moment(loopTask[i].deadline).format('MM-DD-YYYY'),
                 taskTitle: loopTask[i].tasksTitle,
                 taskDescription: loopTask[i].tasksDescription,
                 verification: loopTask[i].verification,
                 assignee: loopTask[i].assigneeName.join(),
                 status: [loopTask[i].status]
               });
             }
             setTask(tempTaskData)
      }

      const handleRemove = (key) => { //deleting task
        let newData = task.filter((tempData) => {
          return tempData.key !== key
        })
        setTask(newData)
      }

    async function markComplete(key){
        try {
            let result = await onUpdateTask({taskId: taskModal.id, status: "COMPLETED", study: studyObj.STUDY.studyID, projectID: projectObj.PROJECT.projectID})
            setTaskModal({...taskModal, status: ['COMPLETED']})
            taskModal.status = ['COMPLETED']
            notif('info', result.data.message)
        } catch (error) {
            notif('error', error)
        }
    }

    async function deleteTask(key){
        try {
           let result =  await onDeleteTask({taskId: taskModal.id, projectName: projectObj.PROJECT.projectID, user: userObj.USER._id})
           handleRemove(key)
           notif('info', result.data.message)
        } catch (error) {
            notif('error', error)
        }
    }

    const columns = [
        {
          title: 'Task',
          dataIndex: 'taskTitle',
          key: 'taskTitle',
          ellipsis: true,
        },
        {
          title: 'Task Description',
          dataIndex: 'taskDescription',
          key: 'taskDescription',
          ellipsis: true,
        },
        {
          title: 'Assignee',
          dataIndex: 'assignee',
          key: 'assignee',
          ellipsis: true,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
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
            render: (text, record, index) => <Button onClick={async ()=>{
                let result = await onGetFileList(record.id)
                getFileList(result)
                setTaskModal(record)
                setData(record.id)
                setIsModalVisible(true);
                
            }} 
               type='link'>MANAGE</Button>
            },
      ];

      const fileColumn = [
        {
          title: 'File Description',
          dataIndex: 'description',
          key: 'description',
          ellipsis: true,
        },
        {
          title: 'Uploaded By',
          dataIndex: 'uploadedBy',
          key: 'uploadedBy',
          ellipsis: true,
        },
        {
          title: 'Date Uploaded',
          dataIndex: 'dateUploaded',
          key: 'dateUploaded',
          ellipsis: true,
        },
        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
            render: (text, record, index) => 
                <div>
                    <Button type='link' onClick={()=>saveFile(record.file)}>Download</Button>
                </div>
            },
      ];

      const saveFile = async (value) => {
        await onDownloadFileTask(value)
      };

      const prop = {
        beforeUpload: file => {
          return file ? false : Upload.LIST_IGNORE;
        },
      };

      const upload = async(value)=>{
        dataForm.append("file", value.image.fileList[0].originFileObj)
        dataForm.append("task", taskModal.id )               
        dataForm.append("description", description)
        dataForm.append("userID", userObj.USER._id)
        dataForm.append("userName", userObj.USER.name)
        let res = await onUploadTaskFile(dataForm)
        setfileData([...fileData, {
            key: res.data.newFile._id,
            description: res.data.newFile.description,
            file: res.data.newFile.file,
            dateUploaded: moment(res.data.newFile.uploadDate).format('MM-DD-YYYY'),
            uploadedBy: res.data.newFile.uploadedByName
        }])
        notif('info', res.data.message)
        form.resetFields()
    }

   
        async function getFileList(value){
            let files = value.data.tasksfile
            let tempFiles = []
            for (let i = 0; i < files.length; i++) {
                tempFiles.push({
                    key : files[i]._id,
                    file: files[i].file,
                    description: files[i].description,
                    dateUploaded: moment(files[i].uploadDate    ).format('MM-DD-YYYY'),
                    uploadedBy: files[i].uploadedByName
                }) 
            }
            setfileData(tempFiles)
        }
  


    return (
        <div >
            <div>
            <CSVLink
                headers={fileHeaders}
                data={fileDataDownload}
                fileName="vrms.csv"
                target="_blank"
                ref={csvLink}
            >
                Download Summary
            </CSVLink>
            
            </div>
            {studyObj.STUDY.objectives.length===0 ? <Empty/> :
            <div>
            <Collapse accordion onChange={callback} >
                {studyObj.STUDY.objectives.map(obj => (
                    <Panel header={obj} key={obj}>
                        {task.length===0 ? <Empty/> :
                        <Table dataSource={task} scroll={{ x: 800, y: 500 }} columns={columns}/>
                        }
                    </Panel>
                ))}
            </Collapse></div>  }
            <div>
                <Modal width={1000} title='Task' visible={isModalVisible} footer={ taskModal.status[0] === "SUBMITTED" ? 
                    <div >
                        <Popconfirm title="Are you sure?" onConfirm={()=>markComplete(taskModal.key)}>
                            <Tooltip title="Click to complete task!" placement="leftTop">
                                <Button disabled={taskModal.status[0]==="COMPLETED"? true : false} style={{background: '#A0BF85', borderRadius: '5px'}}>{taskModal.status[0]}</Button>
                            </Tooltip>
                        </Popconfirm>
                    </div> : 
                    <div >
                        <Button disabled={true} >{taskModal.status[0]}</Button>
                        <Popconfirm title="Are you sure?" onConfirm={()=>deleteTask(taskModal.key)}>
                        <Tooltip title="Click to delete task!" placement="leftTop">
                            <Button danger icon={<DeleteFilled/>}></Button>
                        </Tooltip>
                        </Popconfirm>
                    </div>
                        } onCancel={handleCancel}>
                    <Space direction='vertical'>
                    <div >
                            <label style={{fontWeight:'bolder'}}>Task Title:</label>
                            <p>{taskModal.taskTitle}</p>
                        </div>
                        <div >
                            <label style={{fontWeight:'bolder'}}>Task:</label>
                            <p>{taskModal.taskDescription}</p>
                        </div>
                        <div >
                            <label style={{fontWeight:'bolder'}}>Means of Verification:</label>
                            <p>{taskModal.verification}</p>
                        </div>
                        <div >
                        <Space>
                            <div >
                                <label style={{fontWeight:'bold'}}>Date Created:</label>
                                <p>{taskModal.dateCreated}</p>
                            </div>
                            <div >
                                <label style={{fontWeight:'bold'}}>Last Updated:</label>
                                <p>{taskModal.lastUpdated}</p>
                            </div>
                            <div >
                                <label style={{fontWeight:'bold'}}>Deadline:</label>
                                <p>{taskModal.deadline}</p>
                            </div>
                        </Space>
                        <div >
                            <label style={{fontWeight:'bold'}}>Assignee:</label>
                            <p>{taskModal.assignee}</p>
                        </div>
                        <div className="task-display">
                            <label style={{fontWeight:'bold'}}>Adviser:</label>
                            <p>{taskModal.createdByName}</p>
                        </div>
                        <div >
                            <label style={{fontWeight:'bold'}}>Task File:</label>
                            <Button type='link' onClick={() => setVisible(true)}>Add File</Button>
                        </div>
                        <div>
                            <Table columns={fileColumn} dataSource={fileData}/>
                        </div>
                        <div>
                            <label style={{fontWeight:'bold'}}>Comments:</label>
                            <AddComment data={data}/>
                        </div>
                        </div>
                    </Space>
                    
                </Modal>
                <Modal bodyStyle={{overflowY: 'scroll', height: '100%'}} title='Upload Gallery Image' visible={visible} onCancel={() => setVisible(false)} centered footer={null}>
                    <Form onFinish={upload} initialValues={initialValues} form={form}>
                        <Form.Item label="File Description:" name='description' rules={[
                                    {
                                        required: true,
                                        message: 'Please enter a file description!',
                                    },
                                    ]}>
                            <Input onChange={e => setDescription(e.target.value)} value={description}/>
                        </Form.Item>
                        <Form.Item name='image' label='Selet File:'>
                            <Upload  {...prop} maxCount={1}>
                                <Button icon={<UploadOutlined />}>Choose file to upload</Button>
                            </Upload>
                        </Form.Item>
                        <Form.Item>
                            <Button block htmlType='submit' style={{background: "#A0BF85", borderRadius: "5px"}}>Upload</Button>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        </div>
    )
}

export default ManagerDisplayTask
