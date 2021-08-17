import React, {useState, useRef, useEffect} from 'react'
import {Editor, EditorState} from 'draft-js';
import { useSelector } from 'react-redux';
import { onGetStudyForDoc, onUpdateSummary } from '../services/studyAPI';
import moment from 'moment';
import { Button } from 'antd';
import { convertToRaw, convertFromRaw } from 'draft-js';

const Summary = () => {
    const [editorState, setEditorState] = useState(EditorState.createEmpty())
    const editor= useRef(null)
    const [study, setStudy] = useState({})
    const [assignees, setAssignees] = useState([])

    const studyObj = useSelector(state => state.study) //study reducer
    const content = editorState.getCurrentContent(); 
    const dataToSaveBackend = JSON.stringify(convertToRaw(content))
    
    function focusEditor() {
        editor.current.focus();
    }

    async function getStudyData(){
        try {
            let result = await onGetStudyForDoc({studyID: studyObj.STUDY.studyID})
            setStudy(result.data.study[0]) //study data

            const contentState = convertFromRaw(JSON.parse(result.data.study[0].summary)); //displaying summary
            setEditorState(EditorState.createWithContent(contentState))

            let xAssignee = [result.data.study[0].assignee] //for displaying assignee
            let tempAssignee = []
            for (let i = 0; i < xAssignee.length; i++) {
                tempAssignee.push({
                   assignee:  xAssignee[i]
                })
            }
            setAssignees(tempAssignee) 
        } catch (error) {
            alert(error)
        }
    }

    async function updateSummary(){
        await onUpdateSummary({studyID: studyObj.STUDY.studyID, summary: dataToSaveBackend})
    }

      useEffect(() => {
          focusEditor()
          getStudyData()
      }, [])

    return (
        <div>
            <div style={{display: 'flex', gap: '5px'}}>
                <label style={{fontWeight:'bolder'}}>Title: </label>
                <p>{study.studyTitle}</p>
            </div>
            <div style={{display: 'grid'}}>
                <label style={{fontWeight:'bolder'}}>Summary:</label>
                <div onClick={focusEditor}>
                    {}
                    <Editor
                        ref={editor}
                        editorState={editorState}
                        onChange={editorState => setEditorState(editorState)}
                     />
                </div>
            </div>
            <div style={{display: 'flex', gap: '5px'}}>
                <label style={{fontWeight:'bolder'}}>Budget: </label>
                <p>{study.budget}</p>
            </div>
            <div style={{display: 'flex', gap: '5px'}}>
                <label style={{fontWeight:'bolder'}}>Duration: </label>
                <p>{moment(study.dateCreated).format("MM-DD-YYYY")} to {moment(study.deadline).format("MM-DD-YYYY")}</p>
            </div>
            <div style={{display: 'flex', gap: '5px'}}>
                <label style={{fontWeight:'bolder'}}>Person Involved: </label>
                {assignees.map( assign => (<p>{assign.assignee}</p>))}
            </div>
            <div style={{display:'flex', justifyContent:'flex-end', lineHeight: '20px', gap:'5px'}}>
                <Button type='primary' onClick={updateSummary}>Save</Button>
            </div> 
        </div>
    )
}

export default Summary
