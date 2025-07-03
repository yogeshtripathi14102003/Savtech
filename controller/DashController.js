import Employee from "../models/Employee.js";
// import Department from "../models/Department.js";
import Leave from "../models/leave.js";

export const DashController = async (req, res) => {
  try {
    const totalEmployees = await Employee.countDocuments();
    const totalDepartments = await Department.countDocuments();

    const salaryAgg = await Employee.aggregate([
      { $group: { _id: null, totalSalary: { $sum: "$salary" } } }
    ]);
    const totalSalaries = salaryAgg[0]?.totalSalary || 0;

    const employeeAppliedLeaves = await Leave.distinct("employeeId");

    const leaveStatus = await Leave.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    const leaveApplied = employeeAppliedLeaves.length;
    const leaveApproved = leaveStatus.find(l => l._id === "approved")?.count || 0;
    const leaveRejected = leaveStatus.find(l => l._id === "rejected")?.count || 0;
    const leavePending = leaveStatus.find(l => l._id === "pending")?.count || 0;

    return res.status(200).json({
      success: true,
      totalEmployees,
      totalDepartments,
      totalSalaries,
      leaveApplied,
      leaveApproved,
      leaveRejected,
      leavePending
    });
  } catch (error) {
    console.log("Dashboard error:", error);
    return res.status(500).json({
      success: false,
      error: "Dashboard data fetch error"
    });
  }
};
