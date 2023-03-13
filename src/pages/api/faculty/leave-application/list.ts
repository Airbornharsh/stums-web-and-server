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

    const leaveApplicationData = await DbModels?.leaveApplication.find({
      _id: facultyUserData.leaveApplications,
    });

    const userIds: any[] = [];

    leaveApplicationData?.forEach((leaveApplication) => {
      userIds.push(leaveApplication.userId);
    });

    const userDatas = await DbModels?.studentUser.find({
      _id: userIds,
    });

    const newleaveApplicationData: any[] = [];

    leaveApplicationData?.forEach((leaveApplication: any) => {
      const newTempUserData = getUserData(userDatas, leaveApplication.userId);

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

      const tempLeaveApplication = { userData: {}, leaveApplication };

      tempLeaveApplication.userData = tempUser;

      newleaveApplicationData.push(tempLeaveApplication);
    });

    return res.send(newleaveApplicationData);
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
