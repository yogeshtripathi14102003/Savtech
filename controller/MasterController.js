import Master from "../models/mastesalary.js"; // ✅ Correct import
import mongoose from "mongoose";
import Employee from "../models/Employee.js";
import { response } from "express";

// add master salary 
const addmastersalary = async (req, res) => {
  try {
    const {
      employeeId,
      basicSalary,
      allowances,
      deductions,
      allowanceDetails,
      deductionDetails,
    } = req.body;

    // 🔍 Step 1: Check if salary already exists for this employee
    const existingSalary = await Master.findOne({ employeeId });

    if (existingSalary) {
      return res.status(400).json({
        success: false,
        error: "Salary already added for this employee.",
      });
    }

    // ✅ Step 2: Calculate net salary
    const totalMaster =
      parseInt(basicSalary) + parseInt(allowances) - parseInt(deductions);

    // 🆕 Step 3: Create new salary record
    const newMaster = new Master({
      employeeId,
      basicSalary,
      allowances,
      deductions,
      netMaster: totalMaster,
      allowanceDetails,
      deductionDetails,
    });

    await newMaster.save();

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Salary Add Error:", error);
    return res.status(500).json({
      success: false,
      error: "Salary add server error",
    });
  }
};


// GET all table salaries
const getoverSalaries = async (req, res) => {
  try {
    const masters = await Master.find().populate({
      path: "employeeId",
      select: "employeeId department",
      populate: {
        path: "department",
        select: "dep_name", // or "name" based on your schema
      },
    });

    const formattedSalaries = masters.map((salary, index) => ({
      sno: index + 1,
      employeeId: salary.employeeId?.employeeId || "N/A",
      basicSalary: salary.basicSalary || 0,
      department: salary.employeeId?.department?.dep_name || "N/A", // use "name" if that's in your schema
      allowances: salary.allowances || 0,
      deductions: salary.deductions || 0,
      netSalary:
        (salary.basicSalary || 0) +
        (salary.allowances || 0) -
        (salary.deductions || 0),
      allowanceDetails: salary.allowanceDetails || [],
      deductionDetails: salary.deductionDetails || [],
    }));

    return res.status(200).json({
      success: true,
      data: formattedSalaries,
    });
  } catch (error) {
    console.error("Get Master Salaries Error:", error);
    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
};


// get over salary by id  
const getoverSalaryById = async (req, res) => {
  let { id } = req.params;
  id = id.trim(); // ✅ Remove newline or extra spaces

  try {
    const master = await Master.findOne({ employeeId: id }).populate({
      path: "employeeId",
      select: "employeeId department",
      populate: {
        path: "department",
        select: "dep_name",
      },
    });

    if (!master) {
      return res.status(404).json({
        success: false,
        error: "Salary record not found for this employee",
      });
    }

    const formattedSalary = {
      employeeId: master.employeeId?.employeeId || "N/A",
      basicSalary: master.basicSalary || 0,
      department: master.employeeId?.department?.dep_name || "N/A",
      allowances: master.allowances || 0,
      deductions: master.deductions || 0,
      netSalary:
        (master.basicSalary || 0) +
        (master.allowances || 0) -
        (master.deductions || 0),
      allowanceDetails: master.allowanceDetails || [],
      deductionDetails: master.deductionDetails || [],
    };

    return res.status(200).json({
      success: true,
      data: formattedSalary,
    });
  } catch (error) {
    console.error("Get Salary By ID Error:", error);
    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
};




export { addmastersalary ,getoverSalaries,getoverSalaryById};
