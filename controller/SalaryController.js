
import Salary from "../models/salary.js";
import mongoose from "mongoose";
import Employee from "../models/Employee.js";
import { response } from "express";


const addSalary = async (req, res) => {
  try {
    const {
      employeeId,
      basicSalary,
      allowances,
      deductions,
      payDate,
      allowanceDetails,
      deductionDetails,
    } = req.body;

    const totalSalary =
      parseInt(basicSalary) + parseInt(allowances) - parseInt(deductions);

    const newSalary = new Salary({
      employeeId,
      basicSalary,
      allowances,
      deductions,
      netSalary: totalSalary,
      payDate,
      allowanceDetails,
      deductionDetails,
    });

    await newSalary.save();

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Salary Add Error:", error);
    return res
      .status(500)
      .json({ success: false, error: "Salary add server error" });
  }
};





const getSalary = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Requested ID:", id);

    let salary = await Salary.find({ employeeId: id }).populate({
      path: 'employeeId',
      select: 'employeeId name email department designation',
      populate: {
        path: 'department',
        select: 'name',
      }
    });

    if (!salary || salary.length < 1) {
      const employee = await Employee.findOne({ userId: id });

      if (!employee) {
        return res.status(404).json({
          success: false,
          error: `No employee found for user ID: ${id}`,
        });
      }

      salary = await Salary.find({ employeeId: employee._id }).populate({
        path: 'employeeId',
        select: 'employeeId name email department designation',
        populate: {
          path: 'department',
          select: 'name',
        }
      });
    }

    return res.status(200).json({
      success: true,
      data: salary,
    });

  } catch (error) {
    console.error("Salary fetch error:", error.message);
    return res.status(500).json({
      success: false,
      error: "Salary get server error",
    });
  }
};

// adding admin employee salary deatails
// const adminddSalary = async (req, res) => {
//   try {
//     const {
//       employeeId,
//       department,
//       basicSalary,
//       allowanceDetails,
//       deductionDetails,
//       payDate,
//     } = req.body;

//     if (!employeeId || !department || !basicSalary || !payDate) {
//       return res.status(400).json({ error: "Missing required fields." });
//     }

//     const salary = new Salary({
//       employeeId,
//       department,
//       basicSalary,
//       allowanceDetails,
//       deductionDetails,
//       payDate,
//     });

//     await salary.save();

//     res.status(201).json({
//       success: true,
//       message: "Salary added successfully.",
//       salary,
//     });
//   } catch (error) {
//     console.error("Error adding salary:", error);
//     res.status(500).json({ error: "Server error while adding salary." });
//   }
// };

const getAllSalaries = async (req, res) => {
  try {
    const salaries = await Salary.find()
      .populate({
        path: 'employeeId',
        select: 'employeeId name email department basicSalary designation ,Allowance,Deduction',
        populate: {
          path: 'department',
          select: 'name',
        },
      })
      .sort({ payDate: -1 }); // Optional: newest salaries first

    res.status(200).json({
      success: true,
      data: salaries,
    });
  } catch (error) {
    console.error("Error fetching all salaries:", error.message);
    res.status(500).json({
      success: false,
      error: "Server error while fetching salaries.",
    });
  }
};


const getAllSaly = async (req, res) => {
  try {
    const salaries = await Salary.find().populate("employeeId"); // optional: .sort({ payDate: -1 })

    return res.status(200).json({ success: true, data: salaries });
  } catch (error) {
    console.error("Get All Salaries Error:", error);
    return res
      .status(500)
      .json({ success: false, error: "Server error while fetching salaries" });
  }
};

export { addSalary, getSalary , getAllSalaries,getAllSaly,};