import { model, models, Schema } from "mongoose";

const leaveApplicationSchema = new Schema({
  date: { type: String },
  amount: { type: Number, required: true },
  currency: { type: String, required: true },
  orderId: { type: String, required: true },
  paymentId: { type: String },
  userId: { type: Schema.Types.ObjectId, ref: "StudentUser", required: true },
  year: { type: Number, required: true },
  institute: { type: String, required: true },
});

export default models.FeePayment || model("FeePayment", leaveApplicationSchema);
