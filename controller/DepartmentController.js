// import express from 'express'
// // import authMiddleware from '../middleware/authMiddleware.js'
// import Department from '../models/department.js';

// export const DepartmentController = async (req, res) => {
//   try {
//     const { dep_name, description } = req.body;

//     const newDepartment = new Department({
//       dep_name,
//       description
//     });

//     await newDepartment.save();

//     return res.status(200).json({ success: true, message: "Department added successfully" });
//   } catch (error) {
//     console.error("Error adding department:", error);
//     return res.status(500).json({ success: false, error: "Add department server error" });
//   }
// };

//  export const getDepartments = async (req, res) => {
//   try {
//     const departments = await Department.find();
//     return res.status(200).json({ success: true, departments });
//   } catch (error) {
//     console.error("Error fetching departments:", error);
//     return res.status(500).json({ success: false, error: "Get department server error" });
//   }
// };
//  export const editDepartments = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const department = await Department.findById(id);
//     if (!department) {
//       return res.status(404).json({ success: false, error: "Department not found" });
//     }
//     return res.status(200).json({ success: true, department });
//   } catch (error) {
//     console.error("Error fetching department:", error);
//     return res.status(500).json({ success: false, error: "Get department server error" });
//   }
// };

// export default {DepartmentController ,getDepartments,editDepartments };





import Department from '../models/department.js';

export const DepartmentController = async (req, res) => {
  try {
    const { dep_name, description } = req.body;

    if (!dep_name) {
      return res.status(400).json({ success: false, error: "Department name is required" });
    }

    const newDepartment = new Department({ dep_name, description });
    await newDepartment.save();

    return res.status(200).json({ success: true, message: "Department added successfully" });
  } catch (error) {
    console.error("Error adding department:", error.message);
    return res.status(500).json({ success: false, error: "Add department server error" });
  }
};

export const getDepartments = async (req, res) => {
  try {
    const departments = await Department.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, departments });
  } catch (error) {
    console.error("Error fetching departments:", error.message);
    return res.status(500).json({ success: false, error: "Get departments server error" });
  }
};

export const editDepartments = async (req, res) => {
  try {
    const { id } = req.params;
    const department = await Department.findById(id);
    if (!department) {
      return res.status(404).json({ success: false, error: "Department not found" });
    }
    return res.status(200).json({ success: true, department });
  } catch (error) {
    console.error("Error fetching department:", error.message);
    return res.status(500).json({ success: false, error: "Get department server error" });
  }
};


export const updateDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const { dep_name, description } = req.body;

    const updateDep = await Department.findByIdAndUpdate(
      id,
      { dep_name, description },
      { new: true } // ✅ Returns the updated document
    );

    if (!updateDep) {
      return res.status(404).json({ success: false, error: "Department not found" });
    }

    return res.status(200).json({ success: true, department: updateDep });
  } catch (error) {
    console.error("Error updating department:", error.message);
    return res.status(500).json({ success: false, error: "Edit department server error" });
  }
};


export const deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedDep = await Department.findByIdAndDelete(id); // ✅ Corrected method & variable name

    if (!deletedDep) {
      return res.status(404).json({ success: false, error: "Department not found" });
    }

    return res.status(200).json({ success: true, department: deletedDep });
  } catch (error) {
    console.error("Error deleting department:", error.message); // ✅ Typo fixed
    return res.status(500).json({ success: false, error: "Delete department server error" });
  }
};


