import React from 'react';
import Label from './Label'
import DataGrid from './DataGrid'
import { Tabs} from 'antd'
import Tasks from './DisplayTasks'
import Documentation from './Documentation'
import '../styles/CSS/Userdash.css'
import Mobiledash from './StudyDash_mobile';

import StudyGallery from './StudyGallery';
import Layout1 from '../components/components/Layout1';


const { TabPane } = Tabs;

const StudyDash = () => {

    return (
      <div>
        <Layout1>
            <div style={{margin: '10px 10px 10px 10px'}}>
            <Label/>
            <div className="card-container">
            <Tabs type='card'>
                <TabPane style={{height:'90vh'}} tab="Documentation" key="1">
                    <Documentation/>
                </TabPane>
                <TabPane style={{height:'90vh'}} tab="Tasks" key="2">
                    <Tasks/>
                </TabPane>
                <TabPane style={{height:'90vh'}} tab="Gallery" key="3">
                    <StudyGallery/>
                </TabPane>
                <TabPane style={{height:'90vh'}} tab="Data" key="4">
                    <DataGrid/>
                </TabPane>
            </Tabs>
            </div>
            </div>
        </Layout1>
        <Mobiledash/>
        </div>
    )
}

export default StudyDash
