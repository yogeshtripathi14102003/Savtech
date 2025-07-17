import Employee from "../models/Employee.js";
import Leave from "../models/leave.js";
import Department from "../models/department.js";
// add leave 
 export const LeaveController = async (req, res) => {
  try {
    const { userId, leaveType, startDate, endDate, reason } = req.body;
    // const employee = await Employee.findOne({userId})

    if (!userId || !leaveType || !startDate || !endDate || !reason) {
      return res.status(400).json({ success: false, error: "All fields are required." });
    }

    const newLeave = new Leave({
      employeeId: userId, // Must match schema
      leaveType,
      startDate,
      endDate,
      reason,
    });

    await newLeave.save();

    return res.status(200).json({ success: true, message: "Leave request submitted." });
  } catch (error) {
    console.error("Leave Add Error:", error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
};

//  this api working get  leaves by id  
//  export const getLeaves = async (req, res) => {
//   try {
//     const leaves = await Leave.find().populate({
//       path: 'employeeId',
//       populate: [
//         {
//           path: 'department',
//           select: 'dep_name',
//         },
//         {
//           path: 'userId',
//           select: 'name',
//         },
//       ],
//     });

//     return res.status(200).json({ success: true, leaves });
//   } catch (error) {
//     console.log(error.message);
//     return res.status(500).json({ success: false, error: "leave add server error" });
//   }
// };

export const getLeavesById = async (req, res) => {
  try {
    const { id } = req.params;

    let leaves = await Leave.find({ employeeId: id });

    if (!leaves || leaves.length === 0) {
      const employee = await Employee.findOne({ userId: id });

      if (!employee) {
        return res.status(404).json({ success: false, message: "Employee not found" });
      }

      leaves = await Leave.find({ employeeId: employee._id });
    }

    return res.status(200).json({ success: true, leaves });
  } catch (error) {
    console.error("Error in getLeavesById:", error.message);
    return res.status(500).json({ success: false, error: "Leave get by id error" });
  }
};

// get all leaves 
export const getAllleaves = async (req, res) => {
  try {
const leaves = await Leave.find()
  .populate({
    path: "employeeId",
    populate: [
      { path: "department", select: "dep_name" },
      { path: "userId", select: "name" },
    ],
  });

    return res.status(200).json({ success: true, leaves });
  } catch (error) {
    console.error("Get Leaves Error:", error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
};  


// get leave  mtlv viewleave on admin controller 
export const getLeavesDeatil = async (req, res) => {
  try {
    const { id } = req.params;

    const leave = await Leave.findById(id).populate({
      path: "employeeId",
      model: "Employee",
      populate: [
        { path: "department", model: "Department", select: "dep_name" },
        { path: "userId", model: "User", select: "name profileImage" },
      ],
    });

    return res.status(200).json({ success: true, leave });
  } catch (error) {
    console.error("Get Leaves Error:", error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
};

// approved or reject  controller 
export const updateLeave = async(req,res) =>{
  
try {
  const {id} = req.params;
  const leave = await Leave.findByIdAndUpdate({_id: id}, {status: req.body.status})
   if(!leave){
    return res.status(404).json({success: false, error: "leave not found "})
   }
   return res.status(200).json({success: true})
} catch (error) {
  console.log(error.message)
  return res.status(500).json({sucsess: false, error:"leave add on server "})
}

}






