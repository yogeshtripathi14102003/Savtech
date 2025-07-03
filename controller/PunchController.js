import Punch from '../models/Punch.js';
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
      return res.status(400).json({ message: 'Employee ID, Punch-In time and Mode are required.' });
    }

    const punchDate = new Date(punchIn);
    const startOfDay = new Date(punchDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(punchDate.setHours(23, 59, 59, 999));

    const existingPunchToday = await Punch.findOne({
      employeeId,
      punchIn: { $gte: startOfDay, $lte: endOfDay }
    });

    if (existingPunchToday) {
      return res.status(400).json({ message: 'Already punched in today.' });
    }

    const punch = new Punch({
      employeeId,
      punchIn: new Date(punchIn),
      locationIn,
      mode,
      totalHours: '0h 0m'
    });

    await punch.save();
    res.status(201).json(punch);
  } catch (error) {
    console.error('Punch-In Error:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};



// ✅ Punch-Out
export const punchOut = async (req, res) => {
  try {
    const { employeeId, punchOut, locationOut, mode } = req.body;

    if (!employeeId || !punchOut) {
      return res.status(400).json({ message: 'Employee ID and Punch-Out time are required.' });
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
      return res.status(404).json({ message: 'No active punch-in record found for today.' });
    }

    punch.punchOut = new Date(punchOut);
    punch.locationOut = locationOut || punch.locationOut;
    punch.totalHours = calculateTotalHours(punch.punchIn, punch.punchOut);
    if (mode) punch.mode = mode; // Optional update

    await punch.save();
    res.status(200).json(punch);
  } catch (error) {
    console.error('Punch-Out Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
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


// ✅ Get Punches by Employee
export const getPunchesByEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: 'Employee ID is required.' });
    }

    // Corrected query: use employeeId instead of id
    const punches = await Punch.find({ employeeId: id }).sort({ createdAt: -1 });

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


// export const getMonthlyHours = async (req, res) => {
//   try {
//     const { year, month } = req.params;
//     const y = parseInt(year, 10);
//     const m = parseInt(month, 10) - 1; // JavaScript months are 0-indexed

//     const start = new Date(Date.UTC(y, m, 1));
//     const end = new Date(Date.UTC(y, m + 1, 1));

//     const result = await Punch.aggregate([
//       {
//         $match: {
//           punchIn: { $gte: start, $lt: end },
//           punchOut: { $exists: true, $ne: null }
//         }
//       },
//       {
//         $project: {
//           hours: {
//             $divide: [
//               { $subtract: ["$punchOut", "$punchIn"] },
//               1000 * 60 * 60
//             ]
//           }
//         }
//       },
//       {
//         $group: {
//           _id: null,
//           totalHours: { $sum: "$hours" }
//         }
//       }
//     ]);

//     const totalHours = result[0]?.totalHours || 0;

//     return res.status(200).json({ totalHours: `${totalHours.toFixed(2)} hours` });
//   } catch (error) {
//     console.error("Error computing total monthly hours:", error);
//     return res.status(500).json({ message: 'Internal Server Error' });
//   }
// };

export const getMonthlyHours = async (req, res) => {
  try {
    const { employeeId, year, month } = req.params;
    const y = parseInt(year, 10);
    const m = parseInt(month, 10) - 1; // JavaScript months are 0-indexed

    const start = new Date(Date.UTC(y, m, 1));
    const end = new Date(Date.UTC(y, m + 1, 1));

    const punches = await Punch.find({
      employeeId,
      punchIn: { $gte: start, $lt: end },
      punchOut: { $ne: null }
    });

    let totalHours = 0;
    let overtimeHours = 0;
    let outsideDays = 0;
    let totalDaysPresent = 0;

    for (const punch of punches) {
      const hoursWorked = (new Date(punch.punchOut) - new Date(punch.punchIn)) / (1000 * 60 * 60); // in hours
      totalHours += hoursWorked;

      if (hoursWorked > 9) {
        overtimeHours += hoursWorked - 9;
      }

      if (punch.mode === 'outside') {
        outsideDays += 1;
      }

      totalDaysPresent += 1;
    }

    res.status(200).json({
      employeeId,
      month: `${year}-${month}`,
      totalHours: `${totalHours.toFixed(2)} hours`,
      overtimeHours: `${overtimeHours.toFixed(2)} hours`,
      outsideDays,
      totalDaysPresent
    });
  } catch (error) {
    console.error('Error in getMonthlySummary:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};




export const getSummaryByEmployee = async (req, res) => {
  try {
    const { employeeId } = req.params;

    if (!employeeId) {
      return res.status(400).json({ message: "Employee ID is required." });
    }

    // 1. Fetch employee document
    const employee = await Employee.findOne({ employeeId });

    if (!employee) {
      return res.status(404).json({ message: "Employee not found." });
    }

    // 2. Get punches for employee
    const punches = await Punch.find({
      employeeId,
      punchIn: { $ne: null },
      punchOut: { $ne: null }
    });

    let totalHours = 0;
    let overtimeHours = 0;
    let outsideDays = 0;
    const uniqueDates = new Set();

    for (const punch of punches) {
      const punchIn = new Date(punch.punchIn);
      const punchOut = new Date(punch.punchOut);
      const hoursWorked = (punchOut - punchIn) / (1000 * 60 * 60);

      totalHours += hoursWorked;
      if (hoursWorked > 9) overtimeHours += hoursWorked - 9;
      if (punch.mode?.toLowerCase().trim() === "outside") outsideDays += 1;

      const dateStr = punchIn.toISOString().split("T")[0];
      uniqueDates.add(dateStr);
    }

    res.status(200).json({
      employee,
      summary: {
        totalHours: `${totalHours.toFixed(2)} hours`,
        overtimeHours: `${overtimeHours.toFixed(2)} hours`,
        totalDaysPresent: uniqueDates.size,
        totalOutsideDays: outsideDays
      }
    });
  } catch (error) {
    console.error("Error in getSummaryByEmployee:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
