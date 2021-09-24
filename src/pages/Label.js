import React from 'react'
import { useSelector} from 'react-redux';
import { Typography, Progress} from 'antd'
import moment from 'moment';
import '../styles/CSS/Userdash.css'

const { Title } = Typography;
const Label = () => {

    const studyObj = useSelector(state => state.study)


    return (
        <div className="label-hidden">
            <Title level={3} className="label-header">{studyObj.STUDY.title}</Title>
            <div style={{textAlign: 'right', position:'relative'}}>
                <div className="div-inline-block">
                <div className="div-flex">
                    <div className="div-flex">
                        <label>Last Updated: </label>
                        <p>{moment(studyObj.STUDY.dateUpdated).format('MM-DD-YYYY')}</p>
                    </div>
                    <div>
                        <label>@{studyObj.STUDY.updatedBy}</label>
                    </div>
                    <div className="div-flex">
                        <label>Deadline:  </label>
                        <p>{moment(studyObj.STUDY.deadline).format('MM-DD-YYYY')}</p>
                    </div>
                </div>
            </div>
            <div className="progress-label" >
                <Progress percent={studyObj.STUDY.progress} size="small" style={{maxWidth: '150px'}} />
            </div>
            </div>
        </div>
    )
}

export default Label
