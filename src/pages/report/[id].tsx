import { getDownloadUrl } from "@/utils/constants";
import { Table } from "antd";
import axios from "axios";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import type { ColumnsType } from "antd/es/table";

interface DataType {
  attendanceId: string;
  studentId: string;
  studentName: string;
  studentRollNo: string;
  studentBatch: string;
  totalClasses: number;
  attendedClasses: number;
}

const columns: ColumnsType<DataType> = [
  {
    title: "Id",
    dataIndex: "id",
    key: "id",
    render: (_, record) => <p>{record.studentId}</p>,
  },
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    render: (_, record) => <p>{record.studentName}</p>,
  },
  {
    title: "Roll No.",
    dataIndex: "rollNo",
    key: "rollNo",
    render: (_, record) => <p>{record.studentRollNo}</p>,
  },
  {
    title: "Batch",
    dataIndex: "batch",
    key: "batch",
    render: (_, record) => <p>{record.studentBatch}</p>,
  },
  {
    title: "Attendanded Classes",
    dataIndex: "attendanceCount",
    key: "attendanceCount",
    render: (_, record) => <p>{record.attendedClasses}</p>,
  },
  {
    title: "Total Classes",
    dataIndex: "attendanceCount",
    key: "attendanceCount",
    render: (_, record) => <p>{record.totalClasses}</p>,
  },
  {
    title: "Download Record",
    key: "downloadRecord",
    render: (_, record) => (
      <a href={getDownloadUrl(record.attendanceId)} className="bg-[#1677ff] text-white px-3 rounded-lg py-2">
        Download Record
      </a>
    ),
  },
];

const Report = () => {
  const router = useRouter();
  const { id } = router.query;
  const [report, setReport] = useState<any>();
  const [attendance, setAttendance] = useState<any>();

  useEffect(() => {
    axios
      .get(`http://localhost:3000/api/getAttendanceById?id=${id}`)
      .then((data) => {
        const currentAttendance = data.data.data;
        setAttendance(currentAttendance);
        axios
          .get(`http://localhost:3000/api/subjectWise?classYear=${currentAttendance.classYear}&classSubject=${currentAttendance.classSubject}&classDept=${currentAttendance.classDept}&classDivision=${currentAttendance.classDivision}`)
          .then((data) => {
            const currrentReport = data.data.data.map((student: any) => {
              return {
                attendanceId: id,
                studentId: student.studentId,
                studentName: student.name,
                studentRollNo: student.rollNo,
                studentBatch: student.batch,
                totalClasses: student.totalCount,
                attendedClasses: student.attendanceCount,
              };
            });
            setReport(currrentReport);
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  }, [id]);
  return (
    <div>
      <Head>
        <title>
          {attendance ? attendance.classYear : ""}-{attendance ? attendance.classDivision : ""} {attendance ? attendance.classSubject : ""}
        </title>
      </Head>
      <Table pagination={false} rowKey="studentId" columns={columns} dataSource={report} />
    </div>
  );
};

export default Report;
