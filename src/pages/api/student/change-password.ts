import { compare, hash } from "bcrypt";
import { DbConnect } from "../../../Server/config/Db_Config";
import StudentAuthenticate from "../../../Server/middleware/StudentAuthenticate";
import type { NextApiRequest, NextApiResponse } from "next";

const main = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const DbModels = await DbConnect();

    if (!req.body.password) {
      return res.status(400).send({ message: `Provide Current Password` });
    }

    if (!req.body.newPassword) {
      return res.status(400).send({ message: `Provide New Password` });
    }

    const AuthenticateDetail = (await StudentAuthenticate(req, res))!;

    let tempUser = await DbModels!.studentUser.findOne({
      registrationNo: AuthenticateDetail.registrationNo.trim(),
    });

    const passwordSame = await compare(
      req.body.password.trim(),
      tempUser.password.trim()
    );

    if (!passwordSame) {
      return res.status(401).send({ message: "Wrong Password" });
    }

    const hashPassword = await hash(
      req.body.newPassword && req.body.newPassword.trim(),
      10
    );

    const tempStudent = await DbModels!.studentUser.findByIdAndUpdate(
      AuthenticateDetail._id,
      { password: hashPassword }
    );

    console.log(AuthenticateDetail);

    return res.send(tempStudent);
  } catch (e: any) {
    console.log(e);
    return res.status(500).send({ message: e.message });
  }
};

export default main;
