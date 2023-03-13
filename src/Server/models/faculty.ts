import { model, models, Schema } from "mongoose";

const facultySchema = new Schema({
  institute: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phoneNumber: { type: String },
  emailId: { type: String },
  students: [{ type: Schema.Types.ObjectId, ref: "StudentUser", default: [] }],
  leaveApplications: [
    { type: Schema.Types.ObjectId, ref: "LeaveApplication", default: [] },
  ],
  feePayments: [
    { type: Schema.Types.ObjectId, ref: "FeePayment", default: [] },
  ],
  messBills: [{ type: Schema.Types.ObjectId, ref: "MessBill", default: [] }],
});

export default models.Faculty || model("Faculty", facultySchema);
