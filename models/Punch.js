import mongoose from 'mongoose';


  // employeeId: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'Employee',
  //   required: true
  // },
const { Schema } = mongoose;
const punchSchema = new mongoose.Schema({
employeeId: {
    type: Schema.Types.ObjectId,
    ref: "Employee",
    required: true,
  },
  // there is approved button 
  approved: {
  type: Boolean,
  default: false
},
approvedBy: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Employee', // or 'User' if different collection
  default: null
},
approvedAt: {
  type: Date,
  default: null
},


  punchIn: { type: Date, required: true },
  punchOut: { type: Date, default: null },
  locationIn: { type: String },
  locationOut: { type: String },
  totladays:{
    type:Number,
    default:0
  },
  Totaloutsideday:{
    type:Number,
    default:0
  },
 overtimeHours: { type: Number, default: 0 },
  status: {
  type: String,
  enum: ["P", "A"],
  default: "A"
},
  halfDay: {
    type: Boolean,
    default: false
  },
  totalHours: { type: String, default: '0h 0m' },
    mode: { type: String, enum: ["In Office", "Onsite"], required: true },
}, {
  timestamps: true
});

export default mongoose.model('Punch', punchSchema);


