

import express from "express";
import { createEmployee, upload,getAllEmployees,getemployee ,updateEmployee,fetchEmployeesByDepId,getAllEmployeesDirect } from "../controller/EmployeeController.js";

const router = express.Router();

// Apply upload.single middleware for profileImage
router.post("/create", upload.single("profileImage"), createEmployee);
router.get("/", getAllEmployees )
router.get("/employee/:id", getemployee)
router.put("/up/:id", updateEmployee)
router.get('/fetchEmployees/:id', fetchEmployeesByDepId);
router.get('employees/all', getAllEmployeesDirect);
export default router;
