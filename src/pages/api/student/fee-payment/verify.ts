import { DbConnect } from "../../../../Server/config/Db_Config";
import StudentAuthenticate from "../../../../Server/middleware/StudentAuthenticate";
import type { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";

const main = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const razorpaySignature = req.body.razorpaySignature;
    const razorpayPaymentId = req.body.razorpayPaymentId;
    const razorpayOrderId = req.body.razorpayOrderId;
    const year = req.body.year;

    const DbModels = await DbConnect();

    const AuthenticateDetail = (await StudentAuthenticate(req, res))!;

    const userData = await DbModels?.studentUser.findById(
      AuthenticateDetail._id
    );

    const tempFeePayment = userData.feePayments;

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET_KEY as string)
      .update(razorpayOrderId + "|" + razorpayPaymentId)
      .digest("hex");

    if (generatedSignature == razorpaySignature) {
      // if (true) {
      await DbModels!.feePayment.findByIdAndUpdate(
        userData.feePayments[year.toString()]["id"],
        {
          paymentId: razorpayPaymentId,
          date: Date.now(),
        }
      );

      tempFeePayment[year.toString()]["isPaid"] = true;

      await DbModels!.studentUser.findByIdAndUpdate(AuthenticateDetail._id, {
        feePayments: tempFeePayment,
      });

      await DbModels!.faculty.findOneAndUpdate(
        { institute: AuthenticateDetail.institute },
        { $push: { feePayments: userData.feePayments[year.toString()]["id"] } }
      );

      return res.send({ isVerified: true });
    } else {
      return res.status(400).send({ isVerified: false });
    }
  } catch (e: any) {
    res.status(500).send({ message: e.message });
  }
};

export default main;
