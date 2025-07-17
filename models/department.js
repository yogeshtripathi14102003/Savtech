import mongoose from "mongoose";

const DepartmentSchema = new mongoose.Schema({
  dep_name: {
    type: String,
    required: true,
    trim: true,
  },
  // ... any other fields
});

// ✅ Check if the model is already compiled
const Department = mongoose.models.Department || mongoose.model("Department", DepartmentSchema);

export default Department;
