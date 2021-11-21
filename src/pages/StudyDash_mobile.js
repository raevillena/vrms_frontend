import React from 'react';
import DataGrid from './DataGrid'
import {Typography} from 'antd'
import Tasks from './DisplayTasks'
import Documentation from './Documentation'
import '../styles/CSS/Userdash.css'
import StudyGallery from './StudyGallery';



const { Title } = Typography;

const StudyDash_Mobile = () => {

    return (
        <div className="mobile-study-dash">
            <div style={{marginTop: '5px',marginLeft:'10px', marginRight: '10px'}}>
                <div >
                    <Documentation/>
                </div>
                <div >
                    <Title level={2}>Tasks</Title>
                    <Tasks/>
                </div>
                <div style={{marginTop: '20px'}}>
                    <Title level={2}>Gallery</Title>
                    <StudyGallery/>
                </div>
               
            </div>
      <DataGrid/>
                
        </div>
    )
}

export default StudyDash_Mobile
