import { InboxOutlined, LockOutlined, PhoneOutlined, UserOutlined } from "@ant-design/icons";
import { Upload } from "antd";
import { Button, Form, Input, Select } from "antd";
import Link from "next/link";
import { useState } from "react";
import { v4 } from "uuid";
import { storage } from "../utils/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import Head from "next/head";
import axios from "axios";
import { useRouter } from "next/router";
import Image from "next/image";

const { Option } = Select;

export default function Register() {
  const [profileImage, setProfileImage] = useState<File>();
  const router = useRouter();

  const onFinish = (values: any) => {
    if (profileImage == null) return;
    const imageRef = ref(storage, `teacher/${v4()}`);
    uploadBytes(imageRef, profileImage)
      .then((snapshot) => {
        getDownloadURL(snapshot.ref).then((value) => {
          console.log(value);
          axios
            .post(
              "http://localhost:3000/api/registration/teacher",
              {
                email: values.email,
                name: values.name,
                department: values.department,
                phoneNumber: values.phone,
                photoUrl: value,
                password: values.password,
                cpassword: values.confirm,
              },
              {
                headers: {
                  "Content-Type": "application/json",
                },
              }
            )
            .then((value) => {
              router.push("/");
            })
            .catch((error) => {
              console.log(error);
            });
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const normFile = (e: any) => {
    const file = e?.fileList[0]?.originFileObj;
    setProfileImage(file);
    return e?.fileList;
  };

  return (
    <>
      <Head>
        <title>Registration - Present Ma`am</title>
      </Head>
      <div className="flex flex-col justify-center align-center m-auto max-w-2xl">
        <Image src="./logo-white.svg" alt="./logo-no-background.svg" width={300} height={300} className="mx-auto" />
        <Form
          name="register"
          onFinish={onFinish}
          initialValues={{
            prefix: "91",
          }}
          scrollToFirstError
          className="w-fit mx-auto flex flex-col justify-center"
        >
          <Form.Item name="name" rules={[{ required: true, message: "Please input your name!" }]}>
            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Name" />
          </Form.Item>
          <Form.Item
            name="email"
            rules={[
              {
                type: "email",
                message: "The input is not valid E-mail!",
              },
              {
                required: true,
                message: "Please input your E-mail!",
              },
            ]}
          >
            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Email" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your password!",
              },
              () => ({
                validator(_, value) {
                  if (!value || value.length > 8) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Minimum password length is 8!"));
                },
              }),
            ]}
            hasFeedback
          >
            <Input.Password prefix={<LockOutlined className="site-form-item-icon" />} type="password" placeholder="Password" />
          </Form.Item>
          <Form.Item
            name="confirm"
            dependencies={["password"]}
            hasFeedback
            rules={[
              {
                required: true,
                message: "Please confirm your password!",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("The two passwords that you entered do not match!"));
                },
              }),
            ]}
          >
            <Input.Password prefix={<LockOutlined className="site-form-item-icon" />} type="password" placeholder="Confirm Password" />
          </Form.Item>
          <Form.Item
            name="department"
            rules={[
              {
                required: true,
                message: "Please select your department",
              },
            ]}
          >
            <Select placeholder="Select your department">
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
          <Form.Item
            name="phone"
            rules={[
              { required: true, message: "Please input your phone number!" },
              () => ({
                validator(_, value) {
                  if (value != null && value.toString().length === 10) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Enter corrent phone number"));
                },
              }),
            ]}
          >
            <Input
              addonBefore={
                <Form.Item name="prefix" noStyle>
                  <Select style={{ width: 70 }}>
                    <Option value="91">+91</Option>
                  </Select>
                </Form.Item>
              }
              style={{ width: "100%" }}
              prefix={<PhoneOutlined className="site-form-item-icon" />}
              placeholder="Phone Number"
            />
          </Form.Item>
          <Form.Item
            rules={[
              {
                required: true,
                message: "Please select your profile pic",
              },
            ]}
          >
            <Form.Item name="dragger" valuePropName="fileList" getValueFromEvent={normFile} noStyle>
              <Upload.Dragger
                beforeUpload={() => {
                  return false;
                }}
                name="files"
              >
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">Click or drag file to this area to upload</p>
                <p className="ant-upload-hint">Please select your profile photo!</p>
              </Upload.Dragger>
            </Form.Item>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-form-button bg-[#1677ff] text-white ml-auto">
              Register
            </Button>
            <div className="mt-3">
              OR
              <Link className="ml-2 underline text-[#1677ff]" href="/">
                Login!
              </Link>
            </div>
          </Form.Item>
        </Form>
      </div>
    </>
  );
}
