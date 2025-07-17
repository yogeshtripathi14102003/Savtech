import Employee from "../models/Employee.js";
import Department from "../models/Department.js";
import Leave from "../models/leave.js";

export const DashController = async (req, res) => {
  try {
    const totalEmployees = await Employee.countDocuments();
    const totalDepartments = await Department.countDocuments();

    const salaryAgg = await Employee.aggregate([
      {
        $group: {
          _id: null,
          totalSalaryAmount: { $sum: "$salary" },
        },
      },
    ]);
    const totalSalaryAmount = salaryAgg[0]?.totalSalaryAmount || 0;

    const employeeAppliedLeaveIds = await Leave.distinct("employeeId");

    const leaveStatusCounts = await Leave.aggregate([
      {
        $group: {
          _id: { $toLower: "$status" }, // 👈 normalize case
          count: { $sum: 1 },
        },
      },
    ]);

    console.log("Leave status breakdown:", leaveStatusCounts); // 👈 for debug

    const totalLeaveRequests = employeeAppliedLeaveIds.length;

    const totalApprovedLeaves = leaveStatusCounts.find(l => l._id === "approved")?.count || 0;
    const totalRejectedLeaves = leaveStatusCounts.find(l => l._id === "rejected")?.count || 0;
    const totalPendingLeaves = leaveStatusCounts.find(l => l._id === "pending")?.count || 0;

    return res.status(200).json({
      success: true,
      totalEmployeesCount: totalEmployees,
      totalDepartmentsCount: totalDepartments,
      totalSalaryAmount,
      totalLeaveRequests,
      totalApprovedLeaves,
      totalRejectedLeaves,
      totalPendingLeaves,
    });
  } catch (error) {
    console.log("Dashboard error:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to fetch dashboard data",
    });
  }
};
