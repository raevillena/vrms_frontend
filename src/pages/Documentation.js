import React from 'react'
import { Tabs } from 'antd';
import Introduction from './Introduction';
import Methodology from './Methodology';
import ResultsAndDiscussion from './ResultsAndDiscussion';
import Conclusion from './Conclusion';
import '../styles/CSS/Documentation.css'
import Summary from './Summary'
import Objectives from './Objectives';
import Rrl from './Rrl'


const { TabPane } = Tabs;

const Documentation = () => {
    return (
        <div >
            <Tabs >
                <TabPane tab="Summary" key="1">
                    <Summary/>
                </TabPane>
                <TabPane tab="Objectives" key="2">
                    <Objectives/>
                </TabPane>
                <TabPane tab="Introduction" key="3">
                    <Introduction/>
                </TabPane>
                <TabPane tab="Review of Related Literature" key="4">
                    <Rrl/>
                </TabPane>
                <TabPane tab="Methodology" key="5">
                    <Methodology />
                </TabPane>
                <TabPane tab="Results and Discussion" key="6">
                   <ResultsAndDiscussion/>
                </TabPane>
                <TabPane tab="Conclusion" key="7">
                    <Conclusion/>
                </TabPane>
            </Tabs>
  </div>
    )
}

export default Documentation
