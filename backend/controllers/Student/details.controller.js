const studentDetails = require("../../models/Students/details.model.js")
const XLSX = require("xlsx");
const getDetails = async (req, res) => {
    try {
        let user = await studentDetails.find(req.body);
        if (!user) {
            return res
                .status(400)
                .json({ success: false, message: "No Student Found" });
        }
        const data = {
            success: true,
            message: "Student Details Found!",
            user,
        };
        res.json(data);
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

const addDetails = async (req, res) => {
    try {
        let user = await studentDetails.findOne({
            enrollmentNo: req.body.enrollmentNo,
        });
        if (user) {
            return res.status(400).json({
                success: false,
                message: "Student With This Enrollment Already Exists",
            });
        }
        user = await studentDetails.create({ ...req.body, profile: req.file.filename });
        const data = {
            success: true,
            message: "Student Details Added!",
            user,
        };
        res.json(data);
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}


const updateDetails = async (req, res) => {
    try {
        let user;
        if (req.file) {
            user = await studentDetails.findByIdAndUpdate(req.params.id, { ...req.body, profile: req.file.filename });
        } else {
            user = await studentDetails.findByIdAndUpdate(req.params.id, req.body);
        }
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "No Student Found",
            });
        }
        const data = {
            success: true,
            message: "Updated Successfull!",
        };
        res.json(data);
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

const deleteDetails = async (req, res) => {
    let { id } = req.body;
    try {
        let user = await studentDetails.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "No Student Found",
            });
        }
        const data = {
            success: true,
            message: "Deleted Successfull!",
        };
        res.json(data);
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

const getCount = async (req, res) => {
    try {
        let user = await studentDetails.count(req.body);
        const data = {
            success: true,
            message: "Count Successfull!",
            user,
        };
        res.json(data);
    } catch (error) {
        res
            .status(500)
            .json({ success: false, message: "Internal Server Error", error });
    }
}
const getAllDetails = async (req, res) => {
    try {

      let students = await studentDetails.find();
      if (students.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No students found",
        });
      }
      const data = {
        success: true,
        message: "Students retrieved successfully!",
        students,
      };
      res.json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  };

  
const downloadStudentDetails = async (req, res) => {
    try {
     
      const students = await studentDetails.find();
      
      if (students.length === 0) {
        return res.status(404).json({ success: false, message: "No students found" });
      }
  
   
      const data = students.map((student) => ({
        EnrollmentNo: student.enrollmentNo,
        FirstName: student.firstName,
        MiddleName: student.middleName,
        LastName: student.lastName,
        Email: student.email,
        PhoneNumber: student.phoneNumber,
        Semester: student.semester,
        Branch: student.branch,
        Gender: student.gender,
        
      }));
  
      
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(data);
  
      XLSX.utils.book_append_sheet(workbook, worksheet, "Students");
  
      const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });
  
      res.setHeader("Content-Disposition", "attachment; filename=students.xlsx");
      res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
  
      res.send(excelBuffer);
    } catch (error) {
      console.error("Error generating Excel file:", error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  };
  
module.exports = { getDetails, addDetails, updateDetails, deleteDetails, getCount,getAllDetails, downloadStudentDetails }