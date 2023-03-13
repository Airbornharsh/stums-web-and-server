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

    const feePaymentData = await DbModels?.feePayment.find({
      _id: facultyUserData.feePayments,
    });

    const userIds: any[] = [];

    feePaymentData?.forEach((feePayment) => {
      userIds.push(feePayment.userId);
    });

    const userDatas = await DbModels?.studentUser.find({
      _id: userIds,
    });

    const newfeePaymentData: any[] = [];

    feePaymentData?.forEach((feePayment: any) => {
      const newTempUserData = getUserData(userDatas, feePayment.userId);

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

      const tempFeePayment = { userData: {}, feePayment };

      tempFeePayment.userData = tempUser;

      newfeePaymentData.push(tempFeePayment);
    });

    return res.send(newfeePaymentData);
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
