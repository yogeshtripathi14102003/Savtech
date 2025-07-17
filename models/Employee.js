
import mongoose from "mongoose";
import { Schema } from "mongoose";
const employeeSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  employeeId: {
    type: String,
    required: true,
    unique: true,
  },
  dob: {
    type: Date,
    
  },
  doj: { type: Date, required: true },
 gender: {
        type: String
    },
  maritalStatus: {
    type: String,
 

  },
  designation: {
    type: String,
  
  },
  department: {
        type: Schema.Types.ObjectId,
        ref: "Department",
        required: true
    },

  address:{ 
    type: String,
    required: true},
  PAN: { type: String, required: true },
  Aadhar: { type: String, required: true },
  uan:{
    type:Number,
    required:true
  },
  pfno:{
    type: String,
    required: true,
  },
  bankAccount: {
    type: String,
    required: true,},
  bankName: {
    type: String,},
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,},
}) 

const Employee = mongoose.model("Employee", employeeSchema);
export default Employee;






