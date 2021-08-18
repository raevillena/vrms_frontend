import React from 'react'
import { Tabs } from 'antd';
import Introduction from './Introduction';
import Methodology from './Methodology';
import ResultsAndDiscussion from './ResultsAndDiscussion';
import Conclusion from './Conclusion';
import '../styles/CSS/Documentation.css'
import Summary from './Summary'


const { TabPane } = Tabs;

const Documentation = () => {
    return (
        <div className="card-container">
            <Tabs type="card">
                <TabPane tab="Summary" key="1">
                    <Summary/>
                </TabPane>
                <TabPane tab="Introduction" key="2">
                    <Introduction/>
                </TabPane>
                <TabPane tab="Methodology" key="3">
                    <Methodology />
                </TabPane>
                <TabPane tab="Results and Discussion" key="4">
                   <ResultsAndDiscussion/>
                </TabPane>
                <TabPane tab="Conclusion" key="5">
                    <Conclusion/>
                </TabPane>
            </Tabs>
  </div>
    )
}

export default Documentation
