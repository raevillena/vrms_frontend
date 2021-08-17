import React from 'react'
import { Tabs } from 'antd';
import Editors from './Editors';
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
                    <Editors/>
                </TabPane>
                <TabPane tab="Methodology" key="3">
                    <Editors/>
                </TabPane>
                <TabPane tab="Results and Discussion" key="4">
                    <Editors/>
                </TabPane>
                <TabPane tab="Conclusion" key="5">
                    <Editors/>
                </TabPane>
            </Tabs>
  </div>
    )
}

export default Documentation
