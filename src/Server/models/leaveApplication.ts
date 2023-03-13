import { model, models, Schema } from "mongoose";

const leaveApplicationSchema = new Schema({
  subject: { type: String, required: true },
  description: { type: String, required: true },
  from: { type: String, required: true },
  to: { type: String, required: true },
  institute: { type: String, required: true },
  hostel: { type: String, required: true },
  userId: { type: Schema.Types.ObjectId, ref: "StudentUser", required: true },
  submissionDate: { type: String, required: true },
});

export default models.LeaveApplication ||
  model("LeaveApplication", leaveApplicationSchema);
