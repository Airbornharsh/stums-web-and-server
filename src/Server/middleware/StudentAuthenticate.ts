import { Secret, verify } from "jsonwebtoken";
import type { NextApiRequest, NextApiResponse } from "next";
import { DbConnect } from "../config/Db_Config";

const Authenticate = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    // const accessToken = req.headers["authorization"].split(" ")[1];
    const accessToken = req.headers["authorization"]!.split(" ")[1];

    let tempErr: any;
    let tempUser: any;

    verify(
      accessToken,
      process.env.JWT_SECRET as Secret,
      (err: any, user: any) => {
        tempErr = err;
        tempUser = user;
      }
    );

    const DbModels = await DbConnect();

    if (tempErr) return res.status(402).send({ message: "Not Authorized" });

    const newTempUser = await DbModels!.studentUser.findById(
      tempUser._id.trim()
    );

    if (tempUser.password.trim() !== newTempUser.password.trim())
      return res.status(402).send({ message: "Re Login" });

    return {
      emailId: tempUser.emailId.trim(),
      name: tempUser.name.trim(),
      phoneNumber: tempUser.phoneNumber.trim(),
      institute: tempUser.institute.trim(),
      registrationNo: tempUser.registrationNo.trim(),
      _id: tempUser._id.trim(),
      password: tempUser.password.trim(),
    };
  } catch (e: any) {
    return res.status(500).send({ message: e.message });
  }
};

export default Authenticate;
