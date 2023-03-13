import { model, models, Schema } from "mongoose";

const messBillSchema = new Schema({
  date: { type: String },
  amount: { type: Number, required: true },
  currency: { type: String, required: true },
  orderId: { type: String, required: true },
  paymentId: { type: String },
  userId: { type: Schema.Types.ObjectId, ref: "StudentUser", required: true },
  semester: { type: Number, required: true },
  institute: { type: String, required: true },
  totalDays: { type: Number, required: true },
  daysLeft: { type: Number, required: true },
  leaveDays: { type: Number, required: true },
  hostel: { type: String, required: true },
  roomNo: { type: Number, required: true },
});

export default models.MessBill || model("MessBill", messBillSchema);
