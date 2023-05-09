import Head from "next/head";
import React, { useEffect, useState } from "react";
import { Button, DatePicker, Select, Table } from "antd";
import { Dayjs } from "dayjs";
import { defaultClassYear, defaultDepartment } from "../utils/constants";
import axios from "axios";
import type { ColumnsType } from "antd/es/table";
import { useRouter } from "next/router";
import Link from "next/link";

const { RangePicker } = DatePicker;

interface DataType {
  attendanceId: string;
  classDept: string;
  classDivision: number;
  classSubject: string;
  classYear: string;
  duration: number;
  startTime: number;
  students: string;
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
    title: "Attendance Count",
    dataIndex: "attendanceCount",
    key: "attendanceCount",
    sorter: (a, b) => (a.students !== null ? a.students.split(",").length : 0) - (b.students !== null ? b.students.split(",").length : 0),
    render: (_, record) => <p>{record.students !== null && record.students.length > 0 ? record.students.split(",").length : 0}</p>,
  },
  {
    title: "Download Record",
    key: "downloadRecord",
    render: (_, record) => (
      <Link href={"report/" + record.attendanceId} className="bg-[#1677ff] text-white px-3 rounded-lg py-2">
        See Record
      </Link>
    ),
  },
];

const Teacher = () => {
  const router = useRouter();
  const [teacherId, setTeacherId] = useState<String>();
  const [classYear, setClassYear] = useState(defaultClassYear);
  const [department, setDepartment] = useState(defaultDepartment);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [attendances, setAttendances] = useState([]);
  const [displayAttendance, setDisplayAttendance] = useState(attendances);
  const [teacherDetails, setTeacherDetails] = useState<any>();
  const handleClassYearChange = (value: string[]) => {
    setClassYear(
      defaultClassYear?.filter(
        (option) =>
          value.find((element) => {
            return element === option.label;
          }) != null
      )
    );
  };

  const handleDepartmentChange = (value: string[]) => {
    setDepartment(
      defaultDepartment?.filter(
        (option) =>
          value.find((element) => {
            return element === option.label;
          }) != null
      )
    );
  };

  const onRangeChange = (dates: null | (Dayjs | null)[]) => {
    if (dates && dates.length === 2) {
      setStartTime(new Date(dates[0]!!.toDate()!!).getTime());
      setEndTime(new Date(dates[1]!!.toDate()!!).getTime() + 86399999);
    }
  };

  useEffect(() => {
    const id = localStorage.getItem("id");
    if (id != null) {
      setTeacherId(id);
      axios
        .get(`http://localhost:3000/api/teacherDetails?teacherId=${id}`)
        .then((data) => {
          setTeacherDetails(data.data.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, []);

  useEffect(() => {
    if (teacherId === null || !teacherId) return;
    axios
      .get(`http://localhost:3000/api/getAllAttendance?teacherId=${teacherId}`)
      .then((data) => {
        setAttendances(data.data.data);
        setDisplayAttendance(data.data.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }, [teacherId]);

  useEffect(() => {
    const newDisplayAttendance = attendances.filter((attendance: any) => {
      return classYear?.find((ele) => {
        return ele.label === attendance.classYear;
      });
    });
    setDisplayAttendance(newDisplayAttendance);
  }, [classYear]);
  useEffect(() => {
    const newDisplayAttendance = attendances.filter((attendance: any) => {
      return department?.find((ele) => {
        return ele.label === attendance.classDept;
      });
    });
    setDisplayAttendance(newDisplayAttendance);
  }, [department]);
  useEffect(() => {
    const newDisplayAttendance = attendances.filter((attendance: any) => {
      return attendance.startTime >= startTime && attendance.startTime + attendance.duration <= endTime;
    });
    setDisplayAttendance(newDisplayAttendance);
  }, [startTime, endTime]);

  return (
    <div className="overflow-x-hidden">
      <Head>
        <title>{teacherDetails !== null ? teacherDetails?.name : "Teacher"} - Present Ma'am</title>
      </Head>
      <div className="flex items-center mt-5 justify-between px-5">
        <p className="font-bold text-center flex-1">Hey, {teacherDetails?.name}! Welcome to Present Ma'am</p>
        <Button
          onClick={() => {
            localStorage.removeItem("email");
            localStorage.removeItem("password");
            localStorage.removeItem("id");
            router.push("/");
          }}
          type="primary"
          className="text-white bg-[#1677ff] ml-2"
        >
          Logout {teacherDetails?.name}
        </Button>
      </div>
      <nav className="p-5">
        <Select mode="multiple" allowClear placeholder="Please select the class" defaultValue={["FE", "SE", "TE", "BE"]} onChange={handleClassYearChange} options={defaultClassYear} style={{ width: "20%" }} />
        <Select mode="multiple" allowClear maxTagCount="responsive" className="ml-2" placeholder="Please select the departent" defaultValue={["Computer Engineering", "Information-Teachnolgy", "Electronics & Telecommunication Engineering", "Mechanical Engineering", "Electrical Engineering", "Chemical Engineering", "Production Engineering", "BioTechnology Engineering", "FirstYear Engineering"]} onChange={handleDepartmentChange} options={defaultDepartment} style={{ width: "44.2%" }} />
        <RangePicker className="ml-2" onChange={onRangeChange} />
        <Button type="primary" onClick={() => router.push("/create")} className="text-white bg-[#1677ff] ml-2">
          Create Attendance
        </Button>
      </nav>
      <main className="p-5">
        <Table pagination={false} rowKey="attendanceId" columns={columns} dataSource={displayAttendance} />
      </main>
    </div>
  );
};

export default Teacher;
