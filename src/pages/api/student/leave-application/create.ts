import { DbConnect } from "../../../../Server/config/Db_Config";
import StudentAuthenticate from "../../../../Server/middleware/StudentAuthenticate";
import type { NextApiRequest, NextApiResponse } from "next";

const main = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const subject = req.body.subject;
    const description = req.body.description;
    const fromDate = req.body.from;
    const toDate = req.body.to;
    const hostel = req.body.hostel;
    const roomNo = req.body.roomNo;

    const DbModels = await DbConnect();

    const AuthenticateDetail = (await StudentAuthenticate(req, res))!;

    const userData = await DbModels?.studentUser.findById(
      AuthenticateDetail._id
    );

    let days = Math.floor(
      (parseInt(toDate) - parseInt(fromDate)) / (1000 * 60 * 60 * 24)
    );

    if (days > 4) {
      days = 4;
    } else {
      days = days;
    }

    const tempMessBills = userData.messBills;

    const messBillIds: any[] = [];
    let maxMessBillSemester = 1;
    let maxMessBillId = "";

    Object.keys(tempMessBills).forEach((key) => {
      if (tempMessBills[key]["id"] && tempMessBills[key]["isPaid"]) {
        messBillIds.push(tempMessBills[key]["id"]);
        maxMessBillSemester = parseInt(key);
        maxMessBillId = tempMessBills[key]["id"];
      }
    });

    const newLeaveApplication = new DbModels!.leaveApplication({
      subject: subject,
      description: description,
      from: fromDate,
      to: toDate,
      institute: AuthenticateDetail.institute,
      hostel: hostel,
      roomNo: roomNo,
      userId: AuthenticateDetail._id,
      submissionDate: Date.now(),
    });

    const leaveApplicationData = await newLeaveApplication.save();

    await DbModels!.studentUser.findByIdAndUpdate(AuthenticateDetail._id, {
      $push: { leaveApplications: leaveApplicationData._id },
    });

    await DbModels!.faculty.findOneAndUpdate(
      { institute: AuthenticateDetail.institute },
      { $push: { leaveApplications: leaveApplicationData._id } }
    );

    await DbModels!.messBill.findByIdAndUpdate(maxMessBillId, {
      $inc: { leaveDays: days },
    });

    return res.send(leaveApplicationData);
  } catch (e: any) {
    return res.status(500).send({ message: e.message });
  }
};

export default main;
