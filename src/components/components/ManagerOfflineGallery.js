import React, {useState, useEffect} from 'react'
import {Image, Select, Button, Input} from 'antd'
import { useSelector} from 'react-redux';
import {onUpdateOfflineGallery} from '../../services/offline'
import { notif } from '../../functions/datagrid';
import { onGetProgramforManager, onGetProjectforManager } from '../../services/projectAPI';
import { onGetAllStudyforProject } from '../../services/studyAPI';

const ManagerOfflineGallery = (props) => {
  const { Option } = Select;
  const [study, setStudy] = useState([])
  const [project, setProject] = useState([])
  const [program, setProgram] = useState([])

  const userObj = useSelector(state => state.user)
  const [toMove, setToMove] = useState({
    id: props.data.id,
    caption: props.data.caption,
    uploadedBy: userObj.USER.name,
    studyID: props.data.studyID,
    user: userObj.USER._id
  })

  useEffect(() => {
    async function getProgram(){
      let tempProg = []
    let res = await onGetProgramforManager({user: userObj.USER._id})
    let arrProg = res.data
    for (let j = 0; j < arrProg.length; j++) {
        tempProg.push({
            programName: arrProg[j].programName,
            programID: arrProg[j].programID
        }) 
    }
    tempProg = [...tempProg, {
      programName: 'Others',
      programID: 'others'
    }]
    setProgram(tempProg)
  }
  getProgram()
}, [])

const handleProgramChange = async (value) =>{
  let res = await onGetProjectforManager({user: userObj.USER._id, program: value})
  let arrProj = res.data
  let tempProj = []
  for (let j = 0; j < arrProj.length; j++) {
    tempProj.push({
        projectName: arrProj[j].projectName,
        projectID: arrProj[j].projectID
    }) 
  }
  setProject(tempProj)
}

const handleProjectChange = async (value) => {
  let res = await onGetAllStudyforProject({projectID: value})
  let arrStudy = res.data
  let tempStudy = []
  for (let j = 0; j < arrStudy.length; j++) {
    tempStudy.push({
        studyName: arrStudy[j].studyTitle,
        studyID: arrStudy[j].studyID
    }) 
  }
  setStudy(tempStudy)
}

const handleStudyChange = (value) =>{
  setToMove({...toMove, studyID: value})
}

const handleSubmit = async () =>{
  let res = await onUpdateOfflineGallery(toMove)
  notif('info', res.data.message)
  props.func(toMove)
}

  return (
    <div>
      <Image
        width={200}
        src={props.data.image}
      />
      <div style={{display: 'grid'}}>
        <label style={{fontSize: '20px', fontFamily:'Montserrat'}}>
            Program
        </label>
        <Select placeholder="Select program" onChange={handleProgramChange}>
            {program.map(prog =>(
                <Option key={prog.programID} value={prog.programID}>{prog.programName}</Option>
            ))}
        </Select>
      </div>
      <div style={{display: 'grid'}}>
        <label style={{fontSize: '20px', fontFamily:'Montserrat'}}>
          Project
        </label>
        <Select placeholder="Select project" onChange={handleProjectChange}>
            {project.map(proj =>(
              <Option key={proj.projectID} value={proj.projectID}>{proj.projectName}</Option>
            ))}
        </Select>
      </div>
      <div style={{display: 'grid'}}>
        <label style={{fontSize: '20px', fontFamily:'Montserrat'}}>
          Study
        </label>
        <Select placeholder="Select study" onChange={handleStudyChange} value={toMove.studyID}>
            {study.map(stud =>(
              <Option key={stud.studyID} value={stud.studyID}>{stud.studyName}</Option>
            ))}
        </Select>
      </div>
      <div style={{display:'grid'}}>
        <label style={{fontSize: '20px', fontFamily:'Montserrat'}}>
          Caption
        </label>
        <Input  placeholder="Input caption" onChange={(e)=> {setToMove({...toMove, caption: e.target.value})}} value={toMove.caption}/> 
      </div>
      <div style={{marginTop: '20px', display:'flex', justifyContent:'flex-end', gap: '10px'}}>
        <Button type='primary' onClick={handleSubmit}>Save Changes</Button>
      </div>
    </div>
  )
}

export default ManagerOfflineGallery