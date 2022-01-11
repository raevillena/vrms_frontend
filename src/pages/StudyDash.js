import React, {useState, useEffect} from 'react';
import Label from './Label'
import DataGrid from './DataGrid'
import { Tabs, Anchor} from 'antd'
import Tasks from './DisplayTasks'
import Documentation from './Documentation'
import '../styles/CSS/Userdash.css'
import Mobiledash from './StudyDash_mobile';
import StudyGallery from './StudyGallery';
import Layout1 from '../components/components/Layout1';


const { TabPane } = Tabs;

const StudyDash = () => {
    const { Link } = Anchor;
    const [isOnline, set_isOnline] = useState(true);
    let interval = null;
    const InternetErrMessagenger = () => set_isOnline(navigator.onLine);

    useEffect(() => {
        interval = setInterval(InternetErrMessagenger, 6000);
        return () => {
          clearInterval(interval)
        }
      }, [isOnline])

    return (
      <div >
        {isOnline !== true ? 
        <Layout1>
            <Anchor>
                <Link href='/offline' title='Go to offline'/>
            </Anchor> 
        </Layout1>:
        <Layout1>
            <div className='study-dash' style={{margin: '10px 10px 10px 10px'}}>
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
            <Mobiledash/>
        </Layout1>}
        </div>
    )
}

export default StudyDash
