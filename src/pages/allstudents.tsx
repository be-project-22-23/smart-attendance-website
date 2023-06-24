import { Tag } from "antd";
import axios from "axios";
import Head from "next/head";
import React, { useEffect, useState } from "react";
import { ColumnsType } from "antd/es/table";
import { Table } from "antd";
import Link from "next/link";

const AllStudents = () => {
  interface DataType {
    batch: string;
    createdAt: string;
    currentYear: string;
    department: string;
    division: string;
    email: string;
    name: string;
    password: string;
    phoneNumber: string;
    photoUrl: string;
    rollNo: string;
    studentId: number;
  }

  const columns: ColumnsType<DataType> = [
    {
      title: "Roll No.",
      dataIndex: "rollNo",
      key: "rollNo",
      render: (_, record) => <p>{record.rollNo}</p>,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (_, record) => <p>{record.name}</p>,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (_, record) => <p>{record.email}</p>,
    },
    {
      title: "Phone No.",
      dataIndex: "phoneNo",
      key: "phoneNo",
      render: (_, record) => <p>{record.phoneNumber}</p>,
    },
    {
      title: "Class",
      dataIndex: "class",
      key: "class",
      render: (_, record) => <p>{record.currentYear + "-" + record.division + " " + record.department}</p>,
    },
    {
      title: "Detail",
      dataIndex: "detail",
      key: "details",
      render: (_, record) => (
        <Link href={`/student/${record.studentId}`} className="bg-[#1677ff] text-white px-3 rounded-lg py-2">
          Student Details
        </Link>
      ),
    },
  ];

  const [allStudents, setAllStudents] = useState<any>([]);
  useEffect(() => {
    axios
      .get("http://localhost:3000/api/allStudents")
      .then((data) => {
        console.log(data.data.data);
        setAllStudents(data.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  return (
    <>
      <Head>
        <title>All Students - Present Ma'am</title>
      </Head>
      <Table pagination={false} rowKey="attendanceId" columns={columns} dataSource={allStudents} />
    </>
  );
};

export default AllStudents;
