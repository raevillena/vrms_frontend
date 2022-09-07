
import LayoutComponent from './layout';
import React, {useEffect, useState} from 'react';
import {onGetAllProject } from '../services/projectAPI';
import {Table, Tag, Button, List, Space, Input, Progress, Modal} from 'antd'
import moment from 'moment';
import Highlighter from 'react-highlight-words';
import {SyncOutlined, SearchOutlined, CheckCircleOutlined, ExclamationOutlined} from '@ant-design/icons';
import EditProject from './editproject';

const Projects = () => {
    const [search, setSearch] = useState({searchText: '', searchedColumn:''})
    const [projectData, setProjectData]= useState(["spinme"])
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [props, setProps] = useState()

    useEffect(() => {
        async function getProjects(){
            let projectRes = await onGetAllProject()
            let projectResult = projectRes.data
            let tempProjectData = []
              for(let i = 0; i < projectResult.length; i++){ 
                    tempProjectData.push({
                        key:  projectResult[i]._id,
                        projectID: projectResult[i].projectID,
                        id: [i],
                        projectLeaderID: projectResult[i].assignee,
                        projectLeader: projectResult[i].assigneeName,
                        projectName:  projectResult[i].projectName,
                        dateCreated: moment( projectResult[i].dateCreated).format('MM-DD-YYYY'),
                        dateUpdated: moment( projectResult[i].dateUpdated).format('MM-DD-YYYY'),
                        progress:  projectResult[i].progress,
                        status: [projectResult[i].status],
                        active: [projectResult[i].active.toString()],
                        fundingCategory: projectResult[i].fundingCategory,
                        fundingAgency: projectResult[i].fundingAgency,
                        programID: projectResult[i].program,
                        createdBy: projectResult[i].createdByName
                    });
              }
              setProjectData(tempProjectData)
        }
          getProjects()
    }, [])

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearch({
          searchText: selectedKeys[0],
          searchedColumn: dataIndex,
        });
      };
      
      const handleReset = clearFilters => {
        clearFilters();
        setSearch({...search, searchText: '' });
      };
      
      const getColumnSearchProps = dataIndex => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
          <div style={{ padding: 8 }}>
            <Input
              placeholder={`Search ${dataIndex}`}
              value={selectedKeys[0]}
              onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
              onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
              style={{ marginBottom: 8, display: 'block' }}
              id='searchInput'
            />
            <Space>
              <Button
                type="primary"
                onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                icon={<SearchOutlined />}
                size="small"
                style={{ width: 90 }}
              >
                Search
              </Button>
              <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
                Reset
              </Button>
              <Button
                type="link"
                size="small"
                onClick={() => {
                  confirm({ closeDropdown: false });
                  setSearch({
                    searchText: selectedKeys[0],
                    searchedColumn: dataIndex,
                  });
                }}
              >
                Filter
              </Button>
            </Space>
          </div>
        ),
        filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
        onFilter: (value, record) =>
          record[dataIndex]
            ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
            : '',
       
        render: text =>
          search.searchedColumn === dataIndex ? (
            <Highlighter
              highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
              searchWords={[search.searchText]}
              autoEscape
              textToHighlight={text ? text.toString() : ''}
            />
          ) : (
            text
          ),
      });

    const columns = [
        {
            title: 'Project Leader',
            dataIndex: 'projectLeader',
            key: 'projectLeader',
            render: (leader) => <List size="small"
            dataSource={leader}
            renderItem={item => <List.Item>{item}</List.Item>}
            >
            </List>
          },
          {
            title: 'Project Name',
            dataIndex: 'projectName',
            ...getColumnSearchProps('projectName'),
            key: 'projectName',
            ellipsis: true,
          },
          {
            title: 'Project ID',
            dataIndex: 'projectID',
            key: 'projectID',
            ...getColumnSearchProps('projectID'),
            
          },
          {
            title: 'Date Created',
            dataIndex: 'dateCreated',
            key: 'dateCreated',
          },
          {
            title: 'Progress',
            dataIndex: 'progress',
            key: 'progress',
            render: progress =>
             <Progress percent={progress} size="small" />,
          },
          {
            title: 'Funding Agency',
            dataIndex: 'fundingAgency',
            key: 'fundingAgency',
            ...getColumnSearchProps('fundingAgency'),
            ellipsis: true, 
          },
          {
            title: 'Funding Category',
            dataIndex: 'fundingCategory',
            key: 'fundingCategory',
            filters: [
              { text: 'GAA', value: 'GAA' },
              { text: 'GIA', value: 'GIA' },
            ],
            onFilter: (value, record) => record.fundingCategory.indexOf(value) === 0, 
            },
          {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            filters: [
                { text: 'Completed', value: 'COMPLETED' },
                { text: 'Ongoing', value: 'ONGOING' },
              ],
              onFilter: (value, record) => record.status.indexOf(value) === 0,
              render: status => (
                <span>
                  {status.map(stat => {
                    let color = stat === 'ONGOING' ? 'geekblue' : 'green';                    
                    let iconState = color === 'green' ? true : false;
                    return (
                      <Tag icon={iconState ? <CheckCircleOutlined/> :<SyncOutlined spin/>} color={color} key={stat}>
                        {stat}
                      </Tag>
                    );
                  })}
                </span>
              )
          },
          {
            title: 'Active',
            dataIndex: 'active',
            key: 'active',
            filters: [
                { text: 'True', value: 'true' },
                { text: 'False', value: 'false' },
            ],
            onFilter: (value, record) => record.active.indexOf(value) === 0,
            render: active => (
              <span>
                {active.map(activeStat => {
                  let isActive = activeStat === 'true' ? true : false;
                  let color = isActive === true ? 'green' : 'error';
                  return (
                    <Tag icon={isActive ? <CheckCircleOutlined/> : <ExclamationOutlined/>} color={color} key={isActive}>
                      {activeStat.toUpperCase()}
                    </Tag>
                  );
                })}
              </span>
            ),
        },
          {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
            fixed: 'right',
            render: (text, record, index) => <div style={{display: 'flex', flexDirection:'row'}}>
              <Button className='editButton' type='link' onClick={()=>{
                  setProps(record)
                  setIsModalVisible(true)
              }} >Edit</Button>
            </div>
          },
      ];

      const handleCancel = () => {
        setIsModalVisible(false);
      };

      const edit_data = (data) => {
      let objIndex = projectData.findIndex((obj => obj.projectID === data.id));
      projectData[objIndex].assignee = data.assignee
      projectData[objIndex].assigneeName = data.assigneeName
      projectData[objIndex].lastUpdated = moment(Date.now).format('MM-DD-YYYY')
      projectData[objIndex].projectName = data.projectName
      projectData[objIndex].programID = data.program
      projectData[objIndex].active = data.active
      projectData[objIndex].fundingAgency = data.fundingAgency
      projectData[objIndex].fundingCategory = data.fundingCategory
      projectData[objIndex].deadline = moment(data.deadline).format('MM-DD-YYYY')
      projectData[objIndex].progress = data.progress
    }

    return (
        <div>
            <LayoutComponent>
                <Table size="small"  dataSource={projectData} columns={columns}></Table>
            </LayoutComponent>
            <Modal title='Edit Project' visible={isModalVisible} footer={null} onCancel={handleCancel}>
                <EditProject data={props} func={edit_data}/>
            </Modal>
        </div>
    )
}

export default Projects
