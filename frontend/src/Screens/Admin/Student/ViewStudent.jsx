import React, { useEffect, useState } from "react";
import axios from "axios";
import { baseApiURL } from "../../../baseUrl";
import toast from "react-hot-toast";

const ViewStudents = () => {
  const [students, setStudents] = useState([]);

  // Function to fetch all student details
  const getStudentsData = () => {
    axios
      .get(`${baseApiURL()}/student/details/getAll`)
      .then((response) => {
        if (response.data.success) {
          setStudents(response.data.students);
        } else {
          toast.error(response.data.message);
        }
      })
      .catch((error) => {
        console.error("Error fetching students:", error.message);
        toast.error("Error fetching student data.");
      });
  };

  // Function to download student details as an Excel file
  const downloadStudentDetails = () => {
    axios({
      url: `${baseApiURL()}/student/details/download`,
      method: "GET",
      responseType: "blob", // Important to handle binary data
    })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "students.xlsx"); // Set file name
        document.body.appendChild(link);
        link.click();
      })
      .catch((error) => {
        console.error("Error downloading student data:", error.message);
        toast.error("Error downloading student data.");
      });
  };

  useEffect(() => {
    getStudentsData();
  }, []);

  return (
    <div className="w-[90%] mx-auto mt-10">
      <h1 className="text-2xl font-bold text-center mb-6">View Students</h1>
      <button 
        onClick={downloadStudentDetails} 
        className="bg-blue-500 text-white px-4 py-2 mb-4">
        Download Excel
      </button>
      <table className="min-w-full table-auto">
        <thead>
          <tr>
            <th className="px-4 py-2">Enrollment No</th>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Email</th>
            <th className="px-4 py-2">Phone Number</th>
            <th className="px-4 py-2">Semester</th>
            <th className="px-4 py-2">Branch</th>
            <th className="px-4 py-2">Gender</th>
            <th className="px-4 py-2">Profile Image</th>
          </tr>
        </thead>
        <tbody>
          {students.length === 0 ? (
            <tr>
              <td colSpan="8" className="text-center py-4">
                No students found
              </td>
            </tr>
          ) : (
            students.map((student) => (
              <tr key={student.enrollmentNo} className="border-t">
                <td className="px-4 py-2">{student.enrollmentNo}</td>
                <td className="px-4 py-2">
                  {`${student.firstName} ${student.middleName} ${student.lastName}`}
                </td>
                <td className="px-4 py-2">{student.email}</td>
                <td className="px-4 py-2">{student.phoneNumber}</td>
                <td className="px-4 py-2">{student.semester}</td>
                <td className="px-4 py-2">{student.branch}</td>
                <td className="px-4 py-2">{student.gender}</td>
                <td className="px-4 py-2">
                  <img
                    src={`${baseApiURL()}/uploads/${student.profile}`}
                    alt="Profile"
                    className="h-10 w-10 object-cover rounded-full"
                  />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ViewStudents;
