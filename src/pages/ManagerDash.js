import React, { useState, useEffect } from "react";
import {
  Button,
  Table,
  Progress,
  Spin,
  Popconfirm,
  notification,
  List,
  Tag,
  Input,
  Modal,
  Space,
} from "antd";
import "../styles/CSS/Userdash.css";
import "../styles/CSS/Layout.css";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import {
  onDeleteProject,
  onGetProgramforManager,
  onGetProjectforManager,
} from "../services/projectAPI";
import EditProgram from "./EditProgram";
import EditProject from "./EditProject";
import Highlighter from "react-highlight-words";
import { SearchOutlined } from "@ant-design/icons";

const ManagerDash = (props) => {
  const dispatch = useDispatch();
  let history = useHistory();
  const userObj = useSelector((state) => state.user);
  const [projectData, setProjectData] = useState(['spinme']);
  const [programData, setProgramData] = useState(['spinme']);
  const [id, setId] = useState();
  const [programProps, setProgramProps] = useState();
  const [projectProps, setProjectProps] = useState();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isProjectVisible, setIsProjectVisible] = useState(false);
  const [expandedRow, setExpandedRow] = useState(false);
  const [search, setSearch] = useState({ searchText: "", searchedColumn: "" });

  const notif = (type, message) => {
    notification[type]({
      message: "Notification",
      description: message,
    });
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const showModalProject = () => {
    setIsProjectVisible(true);
  };

  const handleProjectCancel = () => {
    setIsProjectVisible(false);
  };

  useEffect(() => {
    async function getProjects() {
      let result1 = await onGetProgramforManager({ user: userObj.USER._id });
      let programResult = result1.data;
      let tempProgramData = [];
      for (let j = 0; j < programResult.length; j++) {
        tempProgramData.push({
          key: j,
          programID: programResult[j].programID,
          programName: programResult[j].programName,
          programLeader: programResult[j].assigneeName,
          fundingAgency: programResult[j].fundingAgency,
          fundingCategory: programResult[j].fundingCategory,
          programLeaderID: programResult[j].assignee,
          dateCreated: moment(programResult[j].dateCreated).format(
            "MM-DD-YYYY"
          ),
        });
      }
      tempProgramData = [
        ...tempProgramData,
        {
          key: tempProgramData.length,
          programID: "others",
          programName: "Others",
          fundingAgency: "others",
          fundingCategory: "Others",
          programLeader: ["Others"],
          dateCreated: moment(Date.now()).format("MM-DD-YYYY"),
        },
      ];
      setProgramData(tempProgramData);
    }
    getProjects();
  }, [userObj.USER.name]);

  useEffect(() => {
    let cancel = false;
    if (props.data === null || props.data === undefined || props.data === "") {
      return;
    } else {
      if (cancel) return;
      if (props.data.type === "program") {
        setProgramData([
          ...programData,
          {
            key: props.data.newProgram._id,
            programID: props.data.newProgram.program,
            programName: props.data.newProgram.programName,
            programLeader: props.data.newProgram.assigneeName,
            fundingAgency: props.data.newProgram.fundingAgency,
            fundingCategory: props.data.newProgram.fundingCategory,
            dateCreated: moment(props.data.newProgram.dateCreated).format(
              "MM-DD-YYYY"
            ),
          },
        ]);
      } else {
        if (props.data.data.program === id) {
          setProjectData([
            ...projectData,
            {
              key: projectData.length + 1,
              projectID: props.data.data.projectID,
              projectLeader: props.data.data.assigneeName,
              projectLeaderID: props.data.data.assignee,
              projectName: props.data.data.projectName,
              deadline: moment(props.data.data.deadline).format("MM-DD-YYYY"),
              programID: props.data.data.program,
              fundingAgency: props.data.data.fundingAgency,
              fundingCategory: props.data.data.fundingCategory,
              dateCreated: moment(props.data.data.dateCreated).format(
                "MM-DD-YYYY"
              ),
              dateUpdated: moment(props.data.data.dateUpdated).format(
                "MM-DD-YYYY"
              ),
              progress: props.data.data.progress,
              status: [props.data.data.status],
            },
          ]);
        } else {
          return;
        }
      }
    }
    return () => {
      cancel = true;
    };
  }, [props.data]);

  const handleRemove = (key) => {
    //deleting datasheet
    let newData = projectData.filter((tempData) => {
      return tempData.key !== key;
    });
    setProjectData(newData);
  };

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearch({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearch({ ...search, searchText: "" });
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: "block" }}
          id="searchInput"
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
          <Button
            onClick={() => handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
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
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        : "",

    render: (text) =>
      search.searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[search.searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const programColumns = [
    {
      title: "Program Leader",
      dataIndex: "programLeader",
      width: "25%",
      key: "programLeader",
      ...getColumnSearchProps("programLeader"),
      render: (leader) => (
        <List
          size="small"
          dataSource={leader}
          renderItem={(item) => <List.Item>{item}</List.Item>}
        ></List>
      ),
    },
    {
      title: "Program Name",
      dataIndex: "programName",
      key: "programName",
      ...getColumnSearchProps("programName"),
      width: "30%",
      ellipsis: true,
    },
    {
      title: "Date Created",
      dataIndex: "dateCreated",
      key: "dateCreated",
      width: "10%",
    },
    {
      title: "Funding Agency",
      dataIndex: "fundingAgency",
      key: "fundingAgency",
      ...getColumnSearchProps("fundingAgency"),
      ellipsis: true,
      width: "10%",
    },
    {
      title: "Funding Category",
      dataIndex: "fundingCategory",
      key: "fundingCategory",
      filters: [
        { text: "GAA", value: "GAA" },
        { text: "GIA", value: "GIA" },
      ],
      onFilter: (value, record) => record.fundingCategory.indexOf(value) === 0,
      width: "10%",
    },
    {
      title: "Action",
      dataIndex: "action",
      width: "10%",
      key: "action",
      fixed: "right",
      render: (text, record, index) => (
        <div style={{ display: "flex", flexDirection: "row", gap: "5px" }}>
          <Button
            className="editButton"
            type="link"
            onClick={() => {
              let prop = { record, index };
              setProgramProps(prop);
              showModal();
            }}
          >
            Edit
          </Button>
        </div>
      ),
    },
  ];

  const expandedRowRender = (programs) => {
    const columns = [
      {
        title: "Project Leader",
        dataIndex: "projectLeader",
        key: "projectLeader",
        ...getColumnSearchProps("projectLeader"),
        render: (leader) => (
          <List
            size="small"
            dataSource={leader}
            renderItem={(item) => <List.Item>{item}</List.Item>}
          ></List>
        ),
      },
      {
        title: "Project Name",
        dataIndex: "projectName",
        key: "projectName",
        ...getColumnSearchProps("projectName"),
        ellipsis: false,
      },
      {
        title: "Date Created",
        dataIndex: "dateCreated",
        key: "dateCreated",
      },
      {
        title: "Funding Agency",
        dataIndex: "fundingAgency",
        key: "fundingAgency",
        ...getColumnSearchProps("fundingAgency"),
        ellipsis: true,
      },
      {
        title: "Funding Category",
        dataIndex: "fundingCategory",
        key: "fundingCategory",
        filters: [
          { text: "GAA", value: "GAA" },
          { text: "GIA", value: "GIA" },
        ],
        onFilter: (value, record) =>
          record.fundingCategory.indexOf(value) === 0,
      },
      {
        title: "Progress",
        dataIndex: "progress",
        key: "progress",
        render: (progress) => <Progress percent={progress} size="small" />,
      },
      {
        title: "Status",
        dataIndex: "status",
        key: "status",
        filters: [
          { text: "Completed", value: "COMPLETED" },
          { text: "Ongoing", value: "ONGOING" },
        ],
        onFilter: (value, record) => record.status.indexOf(value) === 0,
        render: (status) => (
          <span>
            {status.map((stat) => {
              let color = stat === "Ongoing" ? "geekblue" : "green";
              return (
                <Tag color={color} key={stat}>
                  {stat.toUpperCase()}
                </Tag>
              );
            })}
          </span>
        ),
      },
      {
        title: "Action",
        dataIndex: "action",
        key: "action",
        fixed: "right",
        render: (text, record, index) => (
          <div style={{ display: "flex", flexDirection: "row" }}>
            <Button
              className="manageButton"
              type="link"
              onClick={(e) => {
                dispatch({
                  type: "SET_PROJECT",
                  value: record,
                });
                history.push("/studies");
              }}
            >
              MANAGE
            </Button>

            <Button
              className="editButton"
              type="link"
              onClick={() => {
                let prop = { record, index, programs };
                setProjectProps(prop);
                showModalProject();
              }}
            >
              EDIT
            </Button>

            <Popconfirm
              title="Sure to delete?"
              onConfirm={async (key) => {
                let id = { _id: record.key, user: userObj.USER._id };
                let result = await onDeleteProject(id);
                await handleRemove(record.key);
                notif("error", result.data.message);
              }}
            >
              <Button className="deleteButton" type="error" danger>
                DELETE
              </Button>
            </Popconfirm>
          </div>
        ),
      },
    ];

    if (programData === "") {
      return <Spin className="spinner" />;
    } else {
      return (
        <Table columns={columns} dataSource={projectData} pagination={false} />
      ); //expanded table view
    }
  };

  useEffect(() => {
    async function getProject() {
      let result = await onGetProjectforManager({
        user: userObj.USER._id,
        program: id,
      }); //CHANGE TO ID
      let projectResult = result.data;
      let tempProjectData = [];
      for (let i = 0; i < projectResult.length; i++) {
        tempProjectData.push({
          key: projectResult[i]._id,
          projectID: projectResult[i].projectID,
          projectLeader: projectResult[i].assigneeName,
          projectLeaderID: projectResult[i].assignee,
          programID: projectResult[i].program,
          projectName: projectResult[i].projectName,
          fundingAgency: projectResult[i].fundingAgency,
          fundingCategory: projectResult[i].fundingCategory,
          deadline: moment(projectResult[i].deadline).format("MM-DD-YYYY"),
          dateCreated: moment(projectResult[i].dateCreated).format(
            "MM-DD-YYYY"
          ),
          dateUpdated: moment(projectResult[i].dateUpdated).format(
            "MM-DD-YYYY"
          ),
          progress: projectResult[i].progress,
          status: [projectResult[i].status],
        });
      }
      setProjectData(tempProjectData);
    }
    getProject();
    return () => {
      console.log("unmounting");
    };
  }, [id]);

  const pull_data = (data) => {
    let objIndex = programData.findIndex(
      (obj) => obj.programID === data.program
    );
    programData[objIndex].programLeaderID = data.assignee;
    programData[objIndex].programLeader = data.assigneeName;
    programData[objIndex].programName = data.programName;
    programData[objIndex].fundingAgency = data.fundingAgency;
    programData[objIndex].fundingCategory = data.fundingCategory;
  };

  const edit_data = (data) => {
    let objIndex = projectData.findIndex(
      (obj) => obj.projectID === data.project.id
    );
    if (projectData[objIndex].programID !== data.project.program) {
      let arr = projectData;
      arr.splice(objIndex, 1);
      setProjectData([...arr]);
    } else {
      projectData[objIndex].projectLeaderID = data.project.assignee;
      projectData[objIndex].projectLeader = data.project.assigneeName;
      projectData[objIndex].projectName = data.project.projectName;
      projectData[objIndex].programID = data.project.program;
      projectData[objIndex].fundingAgency = data.project.fundingAgency;
      projectData[objIndex].fundingCategory = data.project.fundingCategory;
    }
  };

  return (
    <div>
      {programData[0] === "spinme" ? (
        <Spin className="spinner" />
      ) : (
        <div>
          <Table
            size="small"
            className="components-table-demo-nested"
            expandable={{ expandedRowRender }}
            onExpand={(isExpanded, record) => {
              setExpandedRow([record.key]);
              setId(isExpanded ? record.programID : undefined);
            }}
            expandedRowKeys={expandedRow}
            dataSource={programData}
            columns={programColumns}
          />
        </div>
      )}
      <Modal
        title="Edit Program"
        visible={isModalVisible}
        footer={null}
        onCancel={handleCancel}
      >
        <EditProgram data={programProps} func={pull_data} />
      </Modal>
      <Modal
        title="Edit Project"
        visible={isProjectVisible}
        footer={null}
        onCancel={handleProjectCancel}
      >
        <EditProject data={projectProps} func={edit_data} />
      </Modal>
    </div>
  );
};

export default ManagerDash;
