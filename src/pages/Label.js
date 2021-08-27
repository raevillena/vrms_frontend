import React from 'react'
import { useSelector} from 'react-redux';
import { Typography, Progress, Button} from 'antd'
import moment from 'moment';
import '../styles/CSS/Userdash.css'

const { Title } = Typography;
const Label = () => {

    const studyObj = useSelector(state => state.study)

    return (
        <div className="label-hidden">
            <Title className="label-header">{studyObj.STUDY.key.studyTitle}</Title>
            <div style={{textAlign: 'right', position:'relative'}}>
                <div className="div-inline-block">
                <div className="div-flex">
                    <div className="div-flex">
                        <label>Last Updated: </label>
                        <p>{moment(studyObj.STUDY.key.dateUpdated).format('MM-DD-YYYY HH:MM:SS')}</p>
                    </div>
                    <div>
                        <label>@{studyObj.STUDY.key.updatedBy}</label>
                    </div>
                    <div className="div-flex">
                        <label>Deadline:  </label>
                        <p>{moment(studyObj.STUDY.key.deadline).format('MM-DD-YYYY HH:MM:SS')}</p>
                    </div>
                </div>
            </div>
            <div className="progress-label" >
            <Progress percent={studyObj.STUDY.key.progress} size="small" style={{maxWidth: '150px'}} />
            <Button style={{background: '#A0BF85', borderRadius: '50px'}}>{studyObj.STUDY.key.status}</Button>
            </div>
            </div>
        </div>
    )
}

export default Label
