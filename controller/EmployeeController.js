import bcrypt from "bcrypt";
import User from "../models/User.js";
import Employee from "../models/Employee.js";

// import Employee  from "../models/Employee.js";
import multer from "multer";
import path from "path";
import fs from "fs";
// import Department from "../models/department.js";
import Department from "../models/department.js";
import { response } from "express";

// Ensure uploads folder exists
const uploadDir = path.resolve("public/uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueName =
      Date.now() + "-" + file.originalname.replace(/\s+/g, "_");
    cb(null, uniqueName);
  },
});

// File type filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPEG and PNG images are allowed"), false);
  }
};

// Multer instance
export const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter,
});

// Create employee controller
export const createEmployee = async (req, res) => {
  try {
    const {
      name,
      email,
      employeeId,
      dob,
      doj,
      gender,
      maritalStatus,
      designation,
      department,
  
      password,
      role,
      address,
      PAN,
      Aadhar,
      uan,
      pfno,
      bankAccount,
      bankName,
    } = req.body;

    // Validate required fields (basic example)
    if (!email || !password || !employeeId || !name) {
      return res.status(400).json({ success: false, error: "Missing required fields" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, error: "Email already in use" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create User record
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
      profileImage: req.file ? req.file.filename : "",
    });
    const savedUser = await newUser.save();

    // Create Employee record
    const newEmployee = new Employee({
      userId: savedUser._id,
      employeeId,
      dob,
      doj,
      gender,
      maritalStatus,
      designation,
      department,
  
      address,
      PAN,
      Aadhar,
      uan,
      pfno,
      bankAccount,
      bankName,
    });

    await newEmployee.save();

    return res.status(201).json({ success: true, message: "Employee created successfully" });
  } catch (err) {
    console.error("Create Employee Error:", err);
    return res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};


export const getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find()
      .populate("userId", "-password") 
      .populate("department");        
    return res.status(200).json({
      success: true,
      employees,
    });
  } catch (error) {
    console.error("Get All Employees Error:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to fetch employees",
    });
  }
};



// export const getemployee = async (req, res) => {
//   const { id } = req.params;

//   try {
//     const  employees = await Employee.findById(id)
//       .populate("userId", "-password")
//       .populate("department");

//     // If not found by _id, try finding by userId
//     if (!employees) {
//       employees = await Employee.findOne({ userId: id }) // ✅ fixed syntax here
//         .populate("userId", "-password")
//         .populate("department");
//     }

//     if (!employees) {
//       return res.status(404).json({
//         success: false,
//         error: "Employee not found",
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       employees,
//     });

//   } catch (error) {
//     console.error("Get Employee Error:", error);
//     return res.status(500).json({
//       success: false,
//       error: "Failed to fetch employee",
//     });
//   }
// };




// export const updateEmployee = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const {
//       name,
//       maritalStatus,
//       department,
//       salary,
//       designation
//     } = req.body;

//     const employee = await Employee.findById({ _id: id });
//     if (!employee) {
//       return res.status(404).json({ success: false, error: "Employee not found" });
//     }

//     const user = await User.findById({ _id: employee.userId });
//     if (!user) {
//       return res.status(404).json({ success: false, error: "User not found" });
//     }

//     const updateUser = await User.findByIdAndUpdate(
//       { _id: employee.userId },
//       { name },
//       { new: true }
//     );

//     const updateEmployee = await Employee.findByIdAndUpdate(
//       { _id: id },
//       { maritalStatus, designation, salary, department },
//       { new: true }
//     );

//     if (!updateUser || !updateEmployee) {
//       return res.status(404).json({ success: false, error: "Document not found" });
//     }

//     return res.status(200).json({ success: true, message: "Employee updated" });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       error: "Update employee server error",
//     });
//   }
// };


//new code get employe 
export const getemployee = async (req, res) => {
  const { id } = req.params;

  try {
    let employees = await Employee.findById(id)
      .populate("userId", "-password")
      .populate("department");

    // If not found by _id, try finding by userId
    if (!employees) {
      employees = await Employee.findOne({ userId: id })
        .populate("userId", "-password")
        .populate("department");
    }

    if (!employees) {
      return res.status(404).json({
        success: false,
        error: "Employee not found",
      });
    }

    return res.status(200).json({
      success: true,
      employee: employees, // ✅ Rename this to match frontend expectation
    });

  } catch (error) {
    console.error("Get Employee Error:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to fetch employee",
    });
  }
};


export const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, maritalStatus, department, salary, designation } = req.body;

    if (!name || !maritalStatus || !department || !salary || !designation) {
      return res.status(400).json({
        success: false,
        error: "All fields are required",
      });
    }

    // Check if employee exists
    const employee = await Employee.findById(id);
    if (!employee) {
      return res.status(404).json({ success: false, error: "Employee not found" });
    }
    // Check if user exists
    const user = await User.findById(employee.userId);
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }
    // Update User
    await User.findByIdAndUpdate(user._id, { name });
    // Update Employee
    await Employee.findByIdAndUpdate(id, {
      maritalStatus,
      designation,
      salary: Number(salary),
      department,
    });
    return res.status(200).json({ success: true, message: "Employee updated successfully" });
  } catch (error) {
    console.error("Update error:", error);
    return res.status(500).json({
      success: false,
      error: "Server error while updating employee",
    });
  }
};

// fetchEployeesDepId
 

 export const fetchEmployeesByDepId = async (req, res) => {
  const { id } = req.params;
  try {
    const employees = await Employee.find({ department: id });
    return res.status(200).json({ success: true, employees });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "get employeesbyDepId server error" });
  }
};



// get allemployee  direct 
export const getAllEmployeesDirect = async (req, res) => {
  try {
    const employees = await Employee.find()
      .populate("userId", "-password") // populate user info, exclude password
      .populate("department");         // populate department details if ref used

    return res.status(200).json({
      success: true,
      data: employees,
    });
  } catch (error) {
    console.error("Get All Employees Direct Error:", error);
    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
};

