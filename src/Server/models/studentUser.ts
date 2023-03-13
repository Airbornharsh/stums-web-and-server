import { model, models, Schema } from "mongoose";

const studentUserSchema = new Schema({
  name: { type: String },
  password: { type: String, required: true },
  registrationNo: { type: String, required: true, unique: true },
  emailId: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  institute: { type: String },
  dob: {type:String,required:true},
  leaveApplications: [
    { type: Schema.Types.ObjectId, ref: "LeaveApplication", default: [] },
  ],
  feePayments: {
    type: Schema.Types.Mixed,
  },
  messBills: {
    type: Schema.Types.Mixed,
  },
});

export default models.StudentUser || model("StudentUser", studentUserSchema);
