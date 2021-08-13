import React from 'react'
import { useSelector} from 'react-redux';
import { Typography, Progress, Button} from 'antd'
import moment from 'moment';

const { Title } = Typography;
const Label = () => {

    const studyObj = useSelector(state => state.study)

    return (
        <div>
            <Title style={{marginTop: '0px', marginBottom: '0px', fontFamily: 'Montserrat'}}>{studyObj.STUDY.key.studyTitle}</Title>
            <div style={{textAlign: 'right', position:'relative'}}>
            <div style={{display:'inline-block', gap:'10px', position: 'absolute', left: '0px'}}>
                <div style={{display:'flex', flexDirection: 'row', gap:'10px'}}>
            <div style={{display:'flex', flexDirection: 'row', gap:'5px'}}>
                <label>Last Updated: </label>
                <p>{moment(studyObj.STUDY.key.dateUpdated).format('MM-DD-YYYY HH:MM:SS')}</p>
            </div>
            <div>
                <label>@{studyObj.STUDY.key.updatedBy}</label>
            </div>
            <div style={{display: 'flex', flexDirection:'row', gap:'5px'}}>
                <label>Deadline:  </label>
                <p>{moment(studyObj.STUDY.key.deadline).format('MM-DD-YYYY HH:MM:SS')}</p>
            </div>
            </div>
            </div>
            <div >
            <Progress percent={studyObj.STUDY.key.progress} size="small" style={{maxWidth: '150px'}} />
            <Button style={{background: '#A0BF85', borderRadius: '50px'}}>{studyObj.STUDY.key.status}</Button>
            </div>
            </div>
        </div>
    )
}

export default Label
