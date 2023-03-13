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

    const userDatas = await DbModels?.studentUser.find({
      _id: facultyUserData.students,
    });

    const newUserDatas: {
      _id: any;
      name: any;
      registrationNo: any;
      emailId: any;
      phoneNumber: any;
      institute: any;
      dob: any;
      leaveApplications: any;
      feePayments: any;
      messBills: any;
    }[] = [];

    facultyUserData.students?.forEach((userId: any) => {
      const newTempUserData = getUserData(userDatas, userId);

      const temp = {
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

      newUserDatas.push(temp);
    });

    return res.send(newUserDatas);
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
