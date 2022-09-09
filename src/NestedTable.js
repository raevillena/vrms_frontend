import React from "react";
import ReactDOM from "react-dom";
import "antd/dist/antd.css";
import "./index.css";
import { Table } from "antd";

const columns = [
  { title: "Name", dataIndex: "name", key: "name" },
  { title: "Age", dataIndex: "age", key: "age" },
  { title: "Address", dataIndex: "address", key: "address" },
  {
    title: "Action",
    dataIndex: "",
    key: "x",
    render: () => <a href="javascript:;">Delete</a>
  }
];

const data = [
  {
    key: 1,
    name: "John Brown",
    age: 32,
    address: "New York No. 1 Lake Park",
    description:
      "My name is John Brown, I am 32 years old, living in New York No. 1 Lake Park."
  },
  {
    key: 2,
    name: "Jim Green",
    age: 42,
    address: "London No. 1 Lake Park",
    description:
      "My name is Jim Green, I am 42 years old, living in London No. 1 Lake Park."
  },
  {
    key: 3,
    name: "Joe Black",
    age: 32,
    address: "Sidney No. 1 Lake Park",
    description:
      "My name is Joe Black, I am 32 years old, living in Sidney No. 1 Lake Park."
  }
];

const data1 = [
  {
    key: 1,
    name: "I am diff",
    age: 32,
    address: "New York No. 1 Lake Park",
    description:
      "My name is John Brown, I am 32 years old, living in New York No. 1 Lake Park."
  },
  {
    key: 2,
    name: "yes",
    age: 42,
    address: "London No. 1 Lake Park",
    description:
      "My name is Jim Green, I am 42 years old, living in London No. 1 Lake Park."
  },
  {
    key: 3,
    name: "no",
    age: 32,
    address: "Sidney No. 1 Lake Park",
    description:
      "My name is Joe Black, I am 32 years old, living in Sidney No. 1 Lake Park."
  }
];

const data2 = [
  {
    key: 1,
    name: "hello",
    age: 32,
    address: "New York No. 1 Lake Park",
    description:
      "My name is John Brown, I am 32 years old, living in New York No. 1 Lake Park."
  },
  {
    key: 2,
    name: "hi",
    age: 42,
    address: "London No. 1 Lake Park",
    description:
      "My name is Jim Green, I am 42 years old, living in London No. 1 Lake Park."
  },
  {
    key: 3,
    name: "test",
    age: 32,
    address: "Sidney No. 1 Lake Park",
    description:
      "My name is Joe Black, I am 32 years old, living in Sidney No. 1 Lake Park."
  }
];

const expandedRow = row => {
  console.log(row.key);
  let inTable = row.key == 1 ? data2 : row.key == 2 ? data1 : data;
  return <Table columns={columns} dataSource={inTable} pagination={false} />;
};

function NestedTable() {
  return (
    <div>
       <Table columns={columns} expandedRowRender={expandedRow} dataSource={data} />
    </div>
  )
}

export default NestedTable
