import React, {useState, useRef, useEffect} from 'react'
import {Editor, EditorState} from 'draft-js';
import { useSelector } from 'react-redux';
import { onGetStudyForDoc, onUpdateSummary } from '../services/studyAPI';
import moment from 'moment';
import { Button, Spin, Input, notification, List } from 'antd';
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
                setAssignees(result.data.study[0].assigneeName)
                let contentState = null
                if(result.data.study[0].summary){
                    contentState = convertFromRaw(JSON.parse(result.data.study[0].summary))//displaying summary
                }else{
                    contentState = convertFromRaw(JSON.parse("{\"blocks\":[{\"key\":\"11i2s\",\"text\":\"\",\"type\":\"unstyled\",\"depth\":0,\"inlineStyleRanges\":[],\"entityRanges\":[],\"data\":{}}],\"entityMap\":{}}"))
                }
                setEditorState(EditorState.createWithContent(contentState))
            } catch (error) {
                notif('error', 'Error in getting data!')
            }
        }

          getStudyData()
          return () => console.log("unmounting from summary")
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
                <p>{moment(study.startDate).format("MM-DD-YYYY")} to {moment(study.deadline).format("MM-DD-YYYY")}</p>
            </div>
            <div className="div-flex">
                <label style={{fontWeight:'bolder', marginTop: '7px'}}>Person Involved: </label>
                <List size="small"
                    dataSource={assignees}
                    renderItem={item => <List.Item>{item}</List.Item>}
                    >
                </List>
            </div>
            <div style={{display:'flex', justifyContent:'flex-end', lineHeight: '20px', gap:'5px'}}>
                <Button type='primary' style={{display: userObj.USER.category === 'director' ? 'none' : 'initial'}} onClick={updateSummary}>Save</Button>
                <Button type='primary' style={{display: userObj.USER.category === 'director' ? 'none' : 'initial'}} onClick={onUpdate}>Edit</Button>
            </div> </div>} 
        </div>
    )
}

export default Summary