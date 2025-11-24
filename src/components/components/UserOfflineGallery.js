import React, {useState, useEffect} from 'react'
import {Image, Select, Button, Input} from 'antd'
import { onGetStudyForUser } from '../../services/studyAPI';
import { useSelector} from 'react-redux';
import {onUpdateOfflineGallery} from '../../services/offline'
import { notif } from '../../functions/datagrid';

const UserOfflineGallery = (props) => {
  const { Option } = Select;
  const [study, setStudy] = useState([])

  const userObj = useSelector(state => state.user)

  const [toMove, setToMove] = useState({
    id: props.data.id,
    caption: props.data.caption,
    uploadedBy: userObj.USER.name,
    studyID: '',
    user: userObj.USER._id
  })

  useEffect(() => {
    async function getStudy(){
       let res = await onGetStudyForUser(userObj.USER)
       let arr = res.data
       let tempStudy = []
       for (let i = 0; i < arr.length; i++) {
           tempStudy.push({
              studyID: arr[i].studyID,
              studyName: arr[i].studyTitle
           })
       }
       setStudy(tempStudy)
    }
    getStudy()
}, [])

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
          Study
        </label>
        <Select placeholder="Select study" onChange={handleStudyChange}>
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

export default UserOfflineGallery