import { DbConnect } from "../../../../Server/config/Db_Config";
import StudentAuthenticate from "../../../../Server/middleware/StudentAuthenticate";
import type { NextApiRequest, NextApiResponse } from "next";
import Razorpay from "razorpay";

const main = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const amount = req.body.amount;
    const currency = req.body.currency.trim();
    const semester = req.body.semester;
    const hostel = req.body.hostel;
    const roomNo = req.body.roomNo;

    const DbModels = await DbConnect();

    const instance = await new Razorpay({
      key_id: process.env.RAZORPAY_TEST_KEY_ID as string,
      key_secret: process.env.RAZORPAY_SECRET_KEY as string,
    });

    const AuthenticateDetail = (await StudentAuthenticate(req, res))!;

    const userData = await DbModels?.studentUser.findById(
      AuthenticateDetail._id
    );

    const tempMessBills = userData.messBills;

    const messBillIds: any[] = [];
    let maxMessBillSemester = 1;

    Object.keys(tempMessBills).forEach((key) => {
      if (tempMessBills[key]["id"] && tempMessBills[key]["isPaid"]) {
        messBillIds.push(tempMessBills[key]["id"]);
        maxMessBillSemester = parseInt(key);
      }
    });

    if (tempMessBills[semester]["isPaid"]) {
      return res.status(403).send({ message: "Payment is Already Done" });
    }

    if (parseInt(semester) - maxMessBillSemester !== 1) {
      if (parseInt(semester) == 1) {
      } else {
        return res
          .status(403)
          .send({ message: `Pay for ${maxMessBillSemester + 1} semester` });
      }
    }

    const options = {
      amount: amount,
      currency: currency,
      notes: semester,
    };

    const data = { orderId: "", status: "", amount: 0 };

    await instance.orders.create(options, function (err, order) {
      if (err) {
        return err;
      }

      data.orderId = order.id;
      data.status = order.status;
      data.amount = req.body.amount;
      return;
    });

    if (data.orderId) {
      const newMessBill = new DbModels!.messBill({
        amount: amount,
        currency: currency,
        orderId: data.orderId.trim(),
        paymentId: "",
        userId: AuthenticateDetail._id,
        semester: parseInt(semester),
        institute: AuthenticateDetail.institute.trim(),
        totalDays: 182,
        daysLeft: 182,
        leaveDays: 0,
        hostel: hostel,
        roomNo: roomNo,
      });

      const messBillData = await newMessBill.save();

      tempMessBills[semester.toString()]["id"] = messBillData._id;

      await DbModels!.studentUser.findByIdAndUpdate(AuthenticateDetail._id, {
        messBills: tempMessBills,
      });

      return res.send(messBillData);
    } else {
      return res.status(500).send({ message: "Order Creating Error" });
    }
  } catch (e: any) {
    res.status(500).send({ message: e.message });
  }
};

export default main;
