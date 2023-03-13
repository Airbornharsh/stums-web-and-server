import { DbConnect } from "../../../../Server/config/Db_Config";
import StudentAuthenticate from "../../../../Server/middleware/StudentAuthenticate";
import type { NextApiRequest, NextApiResponse } from "next";
import Razorpay from "razorpay";

const main = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const year = req.body.year;
    const DbModels = await DbConnect();

    const instance = await new Razorpay({
      key_id: process.env.RAZORPAY_TEST_KEY_ID as string,
      key_secret: process.env.RAZORPAY_SECRET_KEY as string,
    });

    const AuthenticateDetail = (await StudentAuthenticate(req, res))!;

    const userData = await DbModels?.studentUser.findById(
      AuthenticateDetail._id
    );

    const tempFeePayments = userData.feePayments;

    const feePaymentIds: any[] = [];
    let maxFeePaymentsYear = 1;

    Object.keys(tempFeePayments).forEach((key) => {
      if (tempFeePayments[key]["id"] && tempFeePayments[key]["isPaid"]) {
        feePaymentIds.push(tempFeePayments[key]["id"]);
        maxFeePaymentsYear = parseInt(key);
      }
    });

    if (tempFeePayments[year]["isPaid"]) {
      return res.status(403).send({ message: "Payment is Already Done" });
    }

    if (year - tempFeePayments !== 1) {
      return res
        .status(403)
        .send({ message: `Pay for ${maxFeePaymentsYear + 1} Year` });
    }

    const options = {
      amount: req.body.amount,
      currency: req.body.currency,
      notes: req.body.year,
    };

    const data = { orderId: "", status: "", amount: 0 };

    await instance.orders.create(options, function (err, order) {
      if (err) {
        console.log(3);
        return err;
      }

      data.orderId = order.id;
      data.status = order.status;
      data.amount = req.body.amount;
      return;
    });

    if (data.orderId) {
      const newFeePayment = new DbModels!.feePayment({
        amount: req.body.amount,
        currency: req.body.currency.trim(),
        orderId: data.orderId.trim(),
        paymentId: "",
        userId: AuthenticateDetail._id,
        year: parseInt(req.body.year),
        institute: AuthenticateDetail.institute.trim(),
      });

      const feePaymentData = await newFeePayment.save();

      tempFeePayments[req.body.year.toString()]["id"] = feePaymentData._id;

      await DbModels!.studentUser.findByIdAndUpdate(AuthenticateDetail._id, {
        feePayments: tempFeePayments,
      });

      return res.send(feePaymentData);
    } else {
      return res.status(500).send({ message: "Order Creating Error" });
    }
  } catch (e: any) {
    res.status(500).send({ message: e.message });
  }
};

export default main;
