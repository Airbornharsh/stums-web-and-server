import mongoose from "mongoose";
import studentUser from "../models/studentUser";
import leaveApplication from "../models/leaveApplication";
import feePayment from "../models/feePayment";
import messBill from "../models/messBill";
import faculty from "../models/faculty";

const Db_Uri = process.env.DB_URI;

export const DbConnect = async () => {
  try {
    const connect = await mongoose.connect(Db_Uri as string);
    console.log("Db Connected");
    return {
      connect,
      studentUser,
      leaveApplication,
      feePayment,
      messBill,
      faculty,
    };
  } catch (e) {
    console.log(e);
  }
};
