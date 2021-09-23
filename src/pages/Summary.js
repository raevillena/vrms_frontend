import React, {useState, useRef, useEffect} from 'react'
import {Editor, EditorState} from 'draft-js';
import { useSelector } from 'react-redux';
import { onGetStudyForDoc, onUpdateSummary } from '../services/studyAPI';
import moment from 'moment';
import { Button, Spin, Input, notification } from 'antd';
import { convertToRaw, convertFromRaw } from 'draft-js';
import { LoadingOutlined } from '@ant-design/icons';
import '../styles/CSS/Userdash.css'

const Summary = () => {
    const [editorState, setEditorState] = useState(EditorState.createEmpty())
    const editor= useRef(null)
    const [study, setStudy] = useState({})
    const [assignees, setAssignees] = useState([])
    const [update, setUpdate] = useState(true)
    const [updateTitleandBudget, setUpdateTitleandBudget] = useState(true)
    const [loading, setLoading] = useState(false)

    const studyObj = useSelector(state => state.study) //study reducer
    const userObj = useSelector(state => state.user) //study reducer
    const content = editorState.getCurrentContent(); 
    const dataToSaveBackend = JSON.stringify(convertToRaw(content))
    const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

    const notif = (type, message) => {
        notification[type]({
          message: 'Notification',
          description:
            message,
        });
      };
    
    function focusEditor() {
        editor.current.focus();
    }

    async function updateSummary(){
        try {
            await onUpdateSummary({studyID: studyObj.STUDY.studyID, summary: dataToSaveBackend, user: userObj.USER.name, title: study.studyTitle, budget: study.budget})
            setUpdate(true)
            setUpdateTitleandBudget(true)
            notif('success', 'Document updated!')
        } catch (error) {
            notif('error', 'Error in updating document!')
        }
    }

    function onUpdate(){
        setUpdate(false)
       if( userObj.USER.category === "user") {
           setUpdateTitleandBudget(true)} 
       else{
        setUpdateTitleandBudget(false)
    }}

      useEffect(() => {
        async function getStudyData(){
            try {
                setLoading(true)
                let result = await onGetStudyForDoc({studyID: studyObj.STUDY.studyID})
                setLoading(false)
                setStudy(result.data.study[0]) //study data
                    let xAssignee = [result.data.study[0]] //for displaying assignee
                    let tempAssignee = []
                for (let i = 0; i < xAssignee.length; i++) {
                    tempAssignee.push({
                        key: xAssignee[i],
                        assignee:  xAssignee[i].assignee
                    })
                }
                setAssignees(tempAssignee) 
                const contentState = convertFromRaw(JSON.parse(result.data.study[0].summary)); //displaying summary
                setEditorState(EditorState.createWithContent(contentState))
                
            } catch (error) {
               // notif('error', 'Error in getting data!')
            }
        }

          getStudyData()
      }, [studyObj.STUDY.studyID])

    return (
        <div>
            {loading? <Spin indicator={antIcon} className='spinner' /> : 
            <div>
            <div className="div-flex">
                <label style={{fontWeight:'bolder', marginTop: '4px'}}>Title: </label>
                <Input bordered={false} disabled={ updateTitleandBudget} value={study.studyTitle} onChange={e => setStudy({...study, studyTitle: e.target.value})}/>
            </div>
            <div style={{display: 'inline-grid', left:'0px'}}>
                <label style={{fontWeight:'bolder'}}>Summary:</label>
                <div onClick={focusEditor}>
                    <Editor
                        readOnly={update}
                        ref={editor}
                        editorState={editorState}
                        onChange={editorState => setEditorState(editorState)}
                     />
                </div>
            </div>
            <div className="div-flex">
                <label style={{fontWeight:'bolder', marginTop: '4px'}}>Budget: </label>
                <Input bordered={false} disabled={updateTitleandBudget} value={study.budget} onChange={e => setStudy({...study, budget: e.target.value})}/>
            </div>
            <div className="div-flex">
                <label style={{fontWeight:'bolder'}}>Duration: </label>
                <p>{moment(study.dateCreated).format("MM-DD-YYYY")} to {moment(study.deadline).format("MM-DD-YYYY")}</p>
            </div>
            <div className="div-flex">
                <label style={{fontWeight:'bolder'}}>Person Involved: </label>
                {assignees.map( assign => (<p key={assign.key}>{assign.assignee}</p>))}
            </div>
            <div style={{display:'flex', justifyContent:'flex-end', lineHeight: '20px', gap:'5px'}}>
                <Button type='primary' onClick={updateSummary}>Save</Button>
                <Button type='primary' onClick={onUpdate}>Update</Button>
            </div> </div>}
        </div>
    )
}

export default Summary
