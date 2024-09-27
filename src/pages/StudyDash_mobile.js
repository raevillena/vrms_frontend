import React from 'react';
import DataGrid from './DataGrid'
import {Tabs} from 'antd'
import Tasks from './DisplayTasks'
import Documentation from './Documentation'
import '../styles/CSS/Userdash.css'
import StudyGallery from './StudyGallery';


const { TabPane } = Tabs;

const StudyDash_Mobile = () => {
    

    return (
        <div className="mobile-study-dash">
            <div className="card-container" style={{marginTop: '5px',marginLeft:'10px', marginRight: '10px'}}>
                <Tabs defaultActiveKey="1" type='card'  style={{ marginTop: 20 }}>
                    <TabPane tab="Documentation" key="1">
                        <Documentation/>
                    </TabPane>
                    <TabPane tab="Tasks" key="2">
                        <Tasks/>
                    </TabPane>
                    <TabPane tab="Gallery" key="3">
                        <StudyGallery/>
                    </TabPane>
                    <TabPane tab="Data" key="4">
                        <DataGrid/>
                    </TabPane>
                </Tabs>
            </div>
        </div>
    )
}

export default StudyDash_Mobile
