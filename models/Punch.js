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

  punchIn: { type: Date, required: true },
  punchOut: { type: Date, default: null },
  locationIn: { type: String },
  locationOut: { type: String },
  totalHours: { type: String, default: '0h 0m' },
    mode: { type: String, enum: ["In Office", "Onsite"], required: true },
}, {
  timestamps: true
});

export default mongoose.model('Punch', punchSchema);


