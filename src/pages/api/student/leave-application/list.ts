import { DbConnect } from "../../../../Server/config/Db_Config";
import StudentAuthenticate from "../../../../Server/middleware/StudentAuthenticate";
import type { NextApiRequest, NextApiResponse } from "next";

const main = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const DbModels = await DbConnect();

    const AuthenticateDetail = (await StudentAuthenticate(req, res))!;

    const userData = await DbModels?.studentUser.findById(
      AuthenticateDetail._id
    );

    const leaveApplicationData = await DbModels?.leaveApplication.find({
      _id: userData.leaveApplications,
    });

    res.send(leaveApplicationData);
  } catch (e: any) {
    res.status(500).send({ message: e.message });
  }
};

export default main;
