import mongoose from "mongoose";

const MasterSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    required: true,
  },
  
  
  basicSalary: {
    type: Number,
    required: true,
  },
  allowances: {
    type: Number,
    default: 0,
  },
  deductions: {
    type: Number,
    default: 0,
  },
  allowanceDetails: [
    {
      name: String,
      amount: Number,
    },
  ],
    netMaster: {type: Number, default: 0},

  deductionDetails: [
    {
      name: String,
      amount: Number,
    },
  ],
});

export default mongoose.model("Master", MasterSchema);
