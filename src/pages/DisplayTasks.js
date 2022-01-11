import React, { useState} from 'react'
import {Button, Collapse, Form, Empty, Popconfirm, Input, Table, Tag, Modal, Upload, Space } from 'antd'
import { onGetAllTask,  onUpdateTaskUser } from '../services/taskAPI';
import { useSelector} from 'react-redux';
import moment from 'moment';
import AddComment from './AddComment';
import '../styles/CSS/Userdash.css'
import AddTask from './AddTask';
import { notif } from '../functions/datagrid';
import {  UploadOutlined } from '@ant-design/icons';
import { onGetFileList } from '../services/taskAPI';
import { onUploadTaskFile, onDownloadFileTask } from '../services/uploadAPI';


const { Panel } = Collapse;
const DisplayTasks = () => {
    const studyObj = useSelector(state => state.study)
    const userObj = useSelector(state => state.user)

    const [task , setTask] = useState([])
    const [taskModal, setTaskModal] = useState({taskTitle: '', dateCreated: '', taskDescription: '', lastUpdated:'', deadline: '', assignee: '', createdBy: '',verification: '', status: ''})
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [data, setData] = useState({task: '', length: 3})
    const [visible, setVisible] = useState(false); //modal2
    const [description, setDescription] = useState();
    const [fileData, setfileData] = useState({file: '', description: '', dateUploaded: '', uploadedBy: ''})

    const dataForm = new FormData()
    const initialValues = { description: '', data: ''}
    const [form] = Form.useForm();
    
    async function callback(key) {
            setData(task.id)
            const forBackend = {
                studyName: studyObj.STUDY.studyID,
                assignee: userObj.USER._id,
                objective: key
            }        
            let resultTask = await onGetAllTask(forBackend)
            let loopTask = resultTask.data.tasks
            console.log(loopTask)
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
                 assignee: loopTask[i].assigneeName.join(),
                 objectives: loopTask[i].objectives,
                 status: [loopTask[i].status]
               });
             }
             setTask(tempTaskData)
      }

      async function markComplete(key){
        try {
          let result =  await onUpdateTaskUser({taskId: taskModal.id, status: "SUBMITTED"})
            setTaskModal({...taskModal, status: ['SUBMITTED']})
            taskModal.status = ['SUBMITTED']
            notif('info', result.data.message) 
        } catch (error) {
            notif('error', error)
        }
    }

    const handleCancel = () => {
        setIsModalVisible(false);
      };


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

    const saveFile = async (value) => {
        await onDownloadFileTask(value)
      };

    async function getFileList(value){
        let files = value.data.tasksfile
        let tempFiles = []
        for (let i = 0; i < files.length; i++) {
            tempFiles.push({
                key : files[i]._id,
                file: files[i].file,
                description: files[i].description,
                dateUploaded: moment(files[i].uploadDate).format('MM-DD-YYYY'),
                uploadedBy: files[i].uploadedByName
            }) 
        }
        setfileData(tempFiles)
    }



return (
    <div>
        {userObj.USER.category === "user" ? 
            <div>
                {studyObj.STUDY.objectives.length===0 ? <Empty/> : 
                    <div>
                    <Collapse accordion onChange={callback} >
                        {studyObj.STUDY.objectives.map(obj => (
                            <Panel header={obj} key={obj}>
                                {task.length===0 ? <Empty/> :<Table dataSource={task} scroll={{ x: 700, y: 500 }} columns={columns}/>}
                            </Panel>
                        ))}
                    </Collapse>
                    </div>  }
            </div> :<AddTask/>
        }
        <Modal width={1000} title='Task' visible={isModalVisible} onCancel={handleCancel} footer={taskModal.status[0] === "ONGOING" ? 
                        <div>
                            <Popconfirm placement="leftTop" title="Continue to submit?" onConfirm={()=>markComplete(taskModal.key)}>
                                <Button disabled={taskModal.status[0] === "SUBMITTED" ? true : false} style={{background: '#A0BF85', borderRadius: '50px'}}>
                                    {taskModal.status[0] === "ONGOING" ? "Submit" : "SUBMITTED"}
                                </Button>
                            </Popconfirm>
                        </div> : 
                        <Button disabled={true} style={{background: '#A0BF85', borderRadius: '50px'}}>{taskModal.status[0]}</Button>}>
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
                            <div >
                                <label style={{fontWeight:'bold'}}>Adviser:</label>
                                <p>{taskModal.createdByName}</p>
                            </div>
            
                        <div>
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
                        <Form.Item label="File Description:" name='description'>
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
    )
}

export default DisplayTasks
