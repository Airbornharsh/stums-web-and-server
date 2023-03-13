import { DbConnect } from "../../../../Server/config/Db_Config";
import FacultyAuthenticate from "../../../../Server/middleware/FacultyAuthenticate";
import type { NextApiRequest, NextApiResponse } from "next";

const main = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const DbModels = await DbConnect();

    const AuthenticateDetail = (await FacultyAuthenticate(req, res))!;

    const facultyUserData = await DbModels?.faculty.findById(
      AuthenticateDetail._id
    );

    const messBillData = await DbModels?.messBill.find({
      _id: facultyUserData.messBills,
    });

    const userIds: any[] = [];

    messBillData?.forEach((messBill) => {
      userIds.push(messBill.userId);
    });

    const userDatas = await DbModels?.studentUser.find({
      _id: userIds,
    });

    const newMessBillData: any[] = [];

    messBillData?.forEach((messBill: any) => {
      const newTempUserData = getUserData(userDatas, messBill.userId);

      const tempUser = {
        _id: newTempUserData._id,
        name: newTempUserData.name,
        registrationNo: newTempUserData.registrationNo,
        emailId: newTempUserData.emailId,
        phoneNumber: newTempUserData.phoneNumber,
        institute: newTempUserData.institute,
        dob: newTempUserData.dob,
        leaveApplications: newTempUserData.leaveApplications,
        feePayments: newTempUserData.feePayments,
        messBills: newTempUserData.messBills,
      };

      const tempMessBill = { userData: {}, messBill };

      tempMessBill.userData = tempUser;

      newMessBillData.push(tempMessBill);
    });

    return res.send(newMessBillData);
  } catch (e: any) {
    return res.status(500).send({ message: e.message });
  }
};

const getUserData = (userDatas: any, userId: String) => {
  return userDatas.find(
    (user: { _id: String }) => user._id.toString() == userId.toString()
  );
};

export default main;
