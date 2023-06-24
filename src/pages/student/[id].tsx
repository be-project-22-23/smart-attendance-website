import { ColumnsType } from "antd/es/table";
import axios from "axios";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Table, Tag } from "antd";
import { PieChart } from "react-minimal-pie-chart";

interface DataType {
  attendanceId: string;
  classDept: string;
  classDivision: number;
  classSubject: string;
  classYear: string;
  duration: number;
  startTime: number;
  students: string;
  tag: string;
}

const columns: ColumnsType<DataType> = [
  {
    title: "Class",
    dataIndex: "class",
    key: "class",
    render: (_, record) => <p>{record.classYear + "-" + record.classDivision + " " + record.classDept}</p>,
    width: "25%",
  },
  {
    title: "Subject",
    dataIndex: "subject",
    key: "subject",
    sorter: (a, b) => a.classSubject.localeCompare(b.classSubject),
    render: (_, record) => <p>{record.classSubject}</p>,
  },
  {
    title: "Start Date",
    dataIndex: "startDate",
    key: "startDate",
    sorter: (a, b) => a.startTime - b.startTime,
    render: (_, record) => <p>{new Date(record.startTime).toLocaleString()}</p>,
  },
  {
    title: "End Date",
    dataIndex: "endDate",
    key: "endDate",
    sorter: (a, b) => a.startTime + a.duration - (b.startTime + b.duration),
    render: (_, record) => <p>{new Date(record.startTime + record.duration).toLocaleString()}</p>,
  },
  {
    title: "Attendance",
    key: "attendance",
    dataIndex: "attendance",
    render: (_, { tag }) => {
      let color = "green";
      if (tag === "Absent") {
        color = "volcano";
      }
      return (
        <Tag color={color} key={tag}>
          {tag?.toUpperCase()}
        </Tag>
      );
    },
  },
];

const Student = () => {
  const router = useRouter();
  const { id, subject } = router.query;
  const [attendanceCount, setAttendanceCount] = useState<any>();
  const [present, setPresent] = useState(0);
  const [student, setStudent] = useState<any>();
  useEffect(() => {
    if (id) {
      if (!subject) {
        axios.get(`http://localhost:3000/api/attendanceCount?studentId=${id}&allData=true`).then((response) => {
          const presentAttendanceCount = response.data.presentAttendance.map((row: any) => row.attendanceId);
          const data = response.data.allAttendance.map((row: any) => {
            return { ...row, tag: presentAttendanceCount.includes(row.attendanceId) ? "Present" : "Absent" };
          });
          console.log(data);
          setAttendanceCount(data);
        });
      } else {
        axios.get(`http://localhost:3000/api/attendanceCountBySubject?studentId=${id}&classSubject=${subject}`).then((response) => {
          const presentAttendanceCount = response.data.presentAttendance.map((row: any) => row.attendanceId);
          const data = response.data.allAttendance.map((row: any) => {
            return { ...row, tag: presentAttendanceCount.includes(row.attendanceId) ? "Present" : "Absent" };
          });
          console.log(data);
          setAttendanceCount(data);
        });
      }
    }
  }, [id, subject]);

  useEffect(() => {
    const presentData = attendanceCount?.filter((row: any) => row.tag === "Present");
    setPresent(presentData?.length);
  }, [attendanceCount]);

  useEffect(() => {
    axios
      .get(`http://localhost:3000/api/studentDetails?studentId=${id}`)
      .then((data) => {
        console.log(data.data.data);
        setStudent(data.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [id]);
  return (
    <div>
      <Head>
        <title>{student?.name}</title>
      </Head>
      <p className="w-fit mx-auto text-3xl mt-5 mb-5">Attendance Percentage of {student?.name}</p>
      <PieChart
        className="w-36 m-auto text-xs mb-5"
        data={[
          { title: "Present", value: present, color: "#379E0E" },
          { title: "Absent", value: attendanceCount?.length - present, color: "#D3370D" },
        ]}
        label={({ dataEntry }) => dataEntry.title}
      />
      <Table pagination={false} rowKey="attendanceId" columns={columns} dataSource={attendanceCount} />
    </div>
  );
};

export default Student;
