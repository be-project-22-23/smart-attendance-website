import Head from "next/head";
import { Button, Form, Input, InputNumber, Select } from "antd";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useQRCode } from "next-qrcode";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import { useGeolocated } from "react-geolocated";

const { Option } = Select;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

const CreateAttendance = () => {
  const { Canvas } = useQRCode();
  const [attendanceId, setAttendanceId] = useState(0);
  const [teacherDetails, setTeacherDetails] = useState<any>();
  const [location, setLocation] = useState<any>();
  const onFinish = (values: any) => {
    axios
      .post(
        "http://localhost:3000/api/createAttendance",
        {
          classYear: values.classYear,
          classDivision: values.classDivision,
          classDept: values.classDept,
          classSubject: values.subject,
          startTime: new Date().getTime(),
          duration: values.duration * 60000,
          teacherId: localStorage.getItem("id"),
          latitude: location?.latitude,
          longitude: location?.longitude,
          classBatch: values.classBatch,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((data) => {
        setAttendanceId(data.data.id);
      })
      .catch((error) => console.log(error));
  };

  const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    if (lat1 === lat2 && lon1 === lon2) {
      return 0;
    }
    const radlat1 = (Math.PI * lat1) / 180;
    const radlat2 = (Math.PI * lat2) / 180;
    const theta = lon1 - lon2;
    const radtheta = (Math.PI * theta) / 180;
    let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    if (dist > 1) {
      dist = 1;
    }
    dist = Math.acos(dist);
    dist = (dist * 180) / Math.PI;
    dist = dist * 60 * 1.1515;
    return dist;
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          if (getDistance(latitude, longitude, 18.4682959, 73.8364566) < 150)
            setLocation({
              latitude,
              longitude,
            });
        },
        () => {
          console.log("No GPS.");
        },
        { maximumAge: 10000, timeout: 5000, enableHighAccuracy: true }
      );
    }
  }, []);

  useEffect(() => {
    const id = localStorage.getItem("id");
    if (id != null) {
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

  return (
    <>
      <Head>
        <title>Create Attendance - Present Ma`am</title>
      </Head>

      {attendanceId !== 0 ? (
        <div className="flex flex-col w-full items-center h-screen justify-center">
          <p className="mb-5 font-bold text-xl">Time Remaining for the Attendance to close.</p>
          <CountdownCircleTimer isPlaying duration={900} colors={["#004777", "#F7B801", "#A30000"]} colorsTime={[7, 5, 2, 0]}>
            {({ remainingTime }) => remainingTime}
          </CountdownCircleTimer>
          <Canvas
            text={attendanceId.toString()}
            options={{
              level: "M",
              margin: 3,
              scale: 4,
              width: 400,
            }}
          />
        </div>
      ) : (
        <div className="h-screen m-auto overflow-hidden">
          <div className="flex flex-col text-lg items-center mt-20 justify-between px-5">
            <p className="font-bold text-center flex-1">Hey, {teacherDetails?.name}! The Created Attendance will be active for the next 15 minutes.</p>
            <p className="font-bold text-center flex-1">After the attendance is created a QR Code will be displayed, students can scan the QR Code to mark their attendance.</p>
          </div>
          <Form {...layout} name="control-hooks" onFinish={onFinish} style={{ maxWidth: 600 }} className="mx-auto mt-24 flex justify-center flex-col">
            <Form.Item name="classYear" label="Class Year" rules={[{ required: true }]}>
              <Select placeholder="Select a class year" allowClear>
                <Option value="BE">BE</Option>
                <Option value="TE">TE</Option>
                <Option value="SE">SE</Option>
                <Option value="FE">FE</Option>
              </Select>
            </Form.Item>
            <Form.Item name="classDept" label="Class Department" rules={[{ required: true }]}>
              <Select placeholder="Select a class dept" allowClear>
                <Option value="Computer Engineering">Computer Engineering</Option>
                <Option value="Information Teachnolgy">Information-Teachnolgy</Option>
                <Option value="Electronics And Telecommunication Engineering">Electronics & Telecommunication Engineering</Option>
                <Option value="Mechanical Engineering">Mechanical Engineering</Option>
                <Option value="Electrical Engineering">Electrical Engineering</Option>
                <Option value="Production Engineering">Production Engineering</Option>
                <Option value="Chemical Engineering">Chemical Engineering</Option>
                <Option value="BioTechnology Engineering">BioTechnology Engineering</Option>
                <Option value="FirstYear Engineering">FirstYear Engineering</Option>
              </Select>
            </Form.Item>
            <Form.Item label="Class Division" name="classDivision" rules={[{ required: true }]}>
              <Select placeholder="Select a class division" allowClear>
                <Option value="A">A</Option>
                <Option value="B">B</Option>
                <Option value="C">C</Option>
                <Option value="D">D</Option>
              </Select>
            </Form.Item>
            <Form.Item name="subject" label="Subject" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="duration" label="Duration in minutes" rules={[{ required: true }]}>
              <InputNumber min={1} />
            </Form.Item>
            <Form.Item name="classBatch" label="Class Batch" rules={[{ required: true }]}>
              <Select placeholder="Select a class batch" allowClear>
                <Option value="A">A</Option>
                <Option value="B">B</Option>
                <Option value="C">C</Option>
                <Option value="D">D</Option>
              </Select>
            </Form.Item>
            <Form.Item {...tailLayout}>
              <Button className="text-white bg-[#1677ff]" type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </div>
      )}
    </>
  );
};

export default CreateAttendance;
