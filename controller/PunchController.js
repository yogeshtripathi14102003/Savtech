import Punch from '../models/Punch.js';
import mongoose from 'mongoose';
import Employee from '../models/Employee.js';
// Helper function to calculate total hours
const calculateTotalHours = (punchIn, punchOut) => {
  const start = new Date(punchIn);
  const end = new Date(punchOut);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return 'Invalid Time';
  }

  if (end < start) {
    return 'Invalid Time Range';
  }

  const diffMs = end - start;
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs / (1000 * 60)) % 60);

  return `${hours}h ${minutes}m`;
};

// ✅ Create Punch-In
export const createPunchIn = async (req, res) => {
  try {
    const { employeeId, punchIn, locationIn, mode } = req.body;

    if (!employeeId || !punchIn || !mode) {
      return res.status(400).json({ message: "Employee ID, Punch-In time and Mode are required." });
    }

    const punchDate = new Date(punchIn);
    const startOfDay = new Date(punchDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(punchDate.setHours(23, 59, 59, 999));

    const existingPunchToday = await Punch.findOne({
      employeeId,
      punchIn: { $gte: startOfDay, $lte: endOfDay }
    });

    if (existingPunchToday) {
      return res.status(400).json({ message: "Already punched in today." });
    }

    const punch = new Punch({
      employeeId,
      punchIn: new Date(punchIn),
      locationIn,
      mode,
      totalHours: "0h 0m",
      status: "A",// Default to Absent until punchOut is completed
      
    });

    await punch.save();
    res.status(201).json(punch);
  } catch (error) {
    console.error("Punch-In Error:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


// ✅ Punch-Out
// export const punchOut = async (req, res) => {
//   try {
//     const { employeeId, punchOut, locationOut, mode } = req.body;

//     if (!employeeId || !punchOut) {
//       return res.status(400).json({ message: "Employee ID and Punch-Out time are required." });
//     }

//     const punchDate = new Date(punchOut);
//     const startOfDay = new Date(punchDate.setHours(0, 0, 0, 0));
//     const endOfDay = new Date(punchDate.setHours(23, 59, 59, 999));

//     const punch = await Punch.findOne({
//       employeeId,
//       punchIn: { $gte: startOfDay, $lte: endOfDay },
//       punchOut: null
//     });

//     if (!punch) {
//       return res.status(404).json({ message: "No active punch-in record found for today." });
//     }

//     punch.punchOut = new Date(punchOut);
//     punch.locationOut = locationOut || punch.locationOut;
//     punch.totalHours = calculateTotalHours(punch.punchIn, punch.punchOut);
//     if (mode) punch.mode = mode;

//     // Set status to Present after both punchIn and punchOut exist
//     punch.status = "P";

//     await punch.save();
//     res.status(200).json(punch);
//   } catch (error) {
//     console.error("Punch-Out Error:", error.message);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };
export const punchOut = async (req, res) => {
  try {
    const { employeeId, punchOut, locationOut, mode } = req.body;

    if (!employeeId || !punchOut) {
      return res.status(400).json({ message: "Employee ID and Punch-Out time are required." });
    }

    const punchDate = new Date(punchOut);
    const startOfDay = new Date(punchDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(punchDate.setHours(23, 59, 59, 999));

    const punch = await Punch.findOne({
      employeeId,
      punchIn: { $gte: startOfDay, $lte: endOfDay },
      punchOut: null
    });

    if (!punch) {
      return res.status(404).json({ message: "No active punch-in record found for today." });
    }

    punch.punchOut = new Date(punchOut);
    punch.locationOut = locationOut || punch.locationOut;
    punch.totalHours = calculateTotalHours(punch.punchIn, punch.punchOut);

    const hoursWorked = (new Date(punch.punchOut) - new Date(punch.punchIn)) / (1000 * 60 * 60);
    punch.overtimeHours = hoursWorked > 8.5 ? +(hoursWorked - 8.5).toFixed(2) : 0;
    punch.halfDay = hoursWorked > 0 && hoursWorked < 6; // ✅ mark as half-day if < 6 hours

    if (mode) punch.mode = mode;
    punch.status = "P";

    await punch.save();
    res.status(200).json(punch);

  } catch (error) {
    console.error("Punch-Out Error:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


// ✅ Get All Punches
export const getAllPunches = async (req, res) => {
  try {
    const punches = await Punch.find()
      .sort({ createdAt: -1 })
      .populate({
        path: "employeeId",
        select: "employeeId name" // or any fields you want from Employee
      });

    // Flatten employeeId to just a string for frontend display
    const processed = punches.map(p => {
      const obj = p.toObject();
      if (obj.employeeId && typeof obj.employeeId === "object") {
        obj.employeeId = obj.employeeId.employeeId || "N/A"; // get actual ID string
        obj.name = p.employeeId.name || ""; // optional: if you want employee name
      }
      return obj;
    });

    res.status(200).json(processed);
  } catch (error) {
    console.error("Get All Punches Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


// ✅ Get Punches by Employee id currect code 

export const getPunchesByEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: 'Employee ID is required.' });
    }

    // Validate if the id is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid Employee ID format.' });
    }

    const punches = await Punch.find({ employeeId: new mongoose.Types.ObjectId(id) })
      .sort({ createdAt: -1 });

    const processed = punches.map(p => {
      const punch = p.toObject();
      if (!punch.punchOut) {
        punch.totalHours = '0h 0m';
      }
      return punch;
    });

    res.status(200).json(processed);
  } catch (error) {
    console.error('Get Punches By Employee Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


export const getMonthlyHours = async (req, res) => {
  try {
    const { month, employeeId } = req.query;

    if (!month) {
      return res
        .status(400)
        .json({ message: "Month is required in format YYYY-MM." });
    }

    const [year, m] = month.split("-");
    const y = parseInt(year, 10);
    const mm = parseInt(m, 10) - 1; // 0-indexed

    const start = new Date(Date.UTC(y, mm, 1));
    const end = new Date(Date.UTC(y, mm + 1, 1));

    const filter = {
      punchIn: { $gte: start, $lt: end }
    };

    if (employeeId) {
      const employee = mongoose.Types.ObjectId.isValid(employeeId)
        ? await Employee.findById(employeeId)
        : await Employee.findOne({ employeeId });

      if (!employee) {
        return res.status(404).json({ message: "Employee not found" });
      }

      filter.employeeId = employee._id;
    }

    const punches = await Punch.find(filter)
      .sort({ punchIn: 1 })
      .populate({
        path: "employeeId",
        select: "employeeId name"
      });

    let totalDaysPresent = 0;
    let totalHoursWorked = 0;
    let totalOvertimeHours = 0;
    let outsideDays = 0;
    let halfDays = 0;

    const processed = punches.map(p => {
      const punch = p.toObject();

      if (punch.employeeId && typeof punch.employeeId === "object") {
        punch.employeeCode = punch.employeeId.employeeId || "";
        punch.name = punch.employeeId.name || "";
      }

      if (!punch.punchOut) {
        punch.totalHours = "0h 0m";
        return punch;
      }

      const punchIn = new Date(p.punchIn);
      const punchOut = new Date(p.punchOut);
      const hoursWorked = (punchOut - punchIn) / (1000 * 60 * 60);

      punch.totalHours = calculateTotalHours(punchIn, punchOut);

      totalDaysPresent++;
      totalHoursWorked += hoursWorked;

      if (hoursWorked > 9) {
        totalOvertimeHours += hoursWorked - 9;
      }

      if (p.mode === "outside") {
        outsideDays++;
      }

      if (p.halfDay) {
        halfDays++;
      }

      return punch;
    });

    res.status(200).json({
      summary: {
        month,
        totalDaysPresent,
        totalHoursWorked: `${totalHoursWorked.toFixed(2)} hours`,
        totalOvertimeHours: `${totalOvertimeHours.toFixed(2)} hours`,
        outsideDays,
        halfDays
      },
      data: processed
    });
  } catch (error) {
    console.error("Error in getMonthlyHours:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


export const getSummaryByEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    let employee;

    if (mongoose.Types.ObjectId.isValid(id)) {
      employee = await Employee.findById(id);
    }

    if (!employee) {
      employee = await Employee.findOne({ employeeId: id });
    }

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    const punches = await Punch.find({ employeeId: employee._id });

    let totalDaysPresent = 0;
    let totalOutsideDays = 0;
    let totalHalfDays = 0;
    let totalHours = 0;
    let overtimeHours = 0;

    for (const punch of punches) {
      if (!punch.punchOut) continue;

      const punchIn = new Date(punch.punchIn);
      const punchOut = new Date(punch.punchOut);
      const hoursWorked = (punchOut - punchIn) / (1000 * 60 * 60);

      totalHours += hoursWorked;
      overtimeHours += punch.overtimeHours || 0;
      totalDaysPresent += 1;

      if (punch.mode === 'Onsite') {
        totalOutsideDays += 1;
      }

      if (punch.halfDay) {
        totalHalfDays += 1;
      }
    }

    res.status(200).json({
      employee,
      summary: {
        totalDaysPresent,
        totalOutsideDays,
        halfDays: totalHalfDays,
        totalHours: `${totalHours.toFixed(2)} hours`,
        overtimeHours: `${overtimeHours.toFixed(2)} hours`,
      },
    });

  } catch (error) {
    console.error('Error in getSummaryByEmployee:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};



// approved attendence 


// ✅ Approve Attendance
export const approveAttendance = async (req, res) => {
  try {
    console.log("Incoming body:", req.body); // <-- should now log a real object

    const { punchId } = req.body;
    const approverId = req.user?.id || null;

    if (!punchId) {
      return res.status(400).json({ message: "Punch ID is required" });
    }

    const punch = await Punch.findById(punchId);
    if (!punch) {
      return res.status(404).json({ message: "Punch record not found" });
    }

    if (punch.approved) {
      return res.status(400).json({ message: "Already approved" });
    }

    punch.approved = true;
    punch.approvedAt = new Date();
    punch.approvedBy = approverId;

    await punch.save();

    res.status(200).json({ message: "Attendance approved successfully", punch });
  } catch (error) {
    console.error("Error approving attendance:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

