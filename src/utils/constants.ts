import { SelectProps } from "antd";

export const defaultClassYear: SelectProps["options"] = [
  {
    label: "BE",
    value: "BE",
  },
  {
    label: "TE",
    value: "TE",
  },
  {
    label: "SE",
    value: "SE",
  },
  {
    label: "FE",
    value: "FE",
  },
];

export const defaultDepartment: SelectProps["options"] = [
  { label: "Computer Engineering", value: "Computer Engineering" },
  { label: "Information Technology", value: "Information Technology" },
  {
    label: "Electronics And Telecommunication Engineering",
    value: "Electronics And Telecommunication Engineering",
  },
  { label: "Mechanical Engineering", value: "Mechanical Engineering" },
  { label: "Electrical Engineering", value: "Electrical Engineering" },
  { label: "Chemical Engineering", value: "Chemical Engineering" },
  { label: "Production Engineering", value: "Production Engineering" },
  { label: "BioTechnology Engineering", value: "BioTechnology Engineering" },
  { label: "FirstYear Engineering", value: "FirstYear Engineering" },
  { label: "Civil Engineering", value: "Civil Engineering" },
  { label: "Instrumental Engineering", value: "Instrumental Engineering" },
];

export function getDownloadUrl(attendanceId: any): string | undefined {
  return `http://localhost:3000/api/downloadReport?attendanceId=${attendanceId}`;
}
