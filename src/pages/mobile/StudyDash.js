import React, { useState, useEffect } from 'react';
import {  Icon, NavBar, Tabs, WhiteSpace} from 'antd-mobile';
import { Modal } from 'antd';
import Documentation from '../Documentation';
import DisplayTasks from '../DisplayTasks';
import GridTable from './GridTable';
import 'antd-mobile/dist/antd-mobile.css';
import '/Users/user/vrms/vrms_frontend/src/styles/CSS/Mobile.css'
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { PlusOutlined} from '@ant-design/icons';
import DataGrid from './Datagrid';
import EditDatagrid from './EditDatagrid';


const StudyDash = () => {
    let history= useHistory();
    const studyObj = useSelector(state => state.study)

    const [isModalVisible, setIsModalVisible] = useState(false) //for modal
    const [addTable, setAddTable] = useState([])

    const tabs = [
        { title: 'Documentation', sub: '1' },
        { title: 'Tasks', sub: '2' },
        { title: 'Data', sub: '3' },
        { title: 'Charts', sub: '4' },
      ];
      
      const showModal = () => { //for add table
        setIsModalVisible(true);
      };
    
      const handleOk = () => { //modal
        setIsModalVisible(false);
      };
    
      const handleCancel = () => {//modal
        setIsModalVisible(false);
      };


    return (
        <div style={{position:'relative'}}>

          <NavBar mode="light" 
          leftContent={<Icon type="left" />}
          onLeftClick={()=> {history.push('/dash')}}
          rightContent={<a style={{fontSize: '25px'}} icon={<PlusOutlined/>} onClick={showModal}>+</a>}
          >
            <h1 style={{ fontWeight: "bolder", fontSize:'20px'}}>{studyObj.STUDY.title}</h1>
          </NavBar> 
            <Modal title="Add Table" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
              <DataGrid/>
            </Modal>
            <div >
                <WhiteSpace />
                    <Tabs tabs={tabs} tabBarPosition="top" initialPage={0} 
                     >
                             <div style={{margin: '10px'}}>
                             <Documentation/>
                             </div>
                             <div style={{margin: '10px'}}>
                             <DisplayTasks/>
                             </div>
                             <div style={{margin: '10px'}}>
                             <GridTable />
                             </div>
                    </Tabs>
                <WhiteSpace />
            </div>
        </div>
        
    )
}

export default StudyDash
