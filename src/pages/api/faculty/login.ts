import { compare } from "bcrypt";
import { Secret, sign } from "jsonwebtoken";
import { DbConnect } from "../../../Server/config/Db_Config";
import type { NextApiRequest, NextApiResponse } from "next";

const main = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const DbModels = await DbConnect();

    let tempUser;

    if (req.body.institute) {
      tempUser = await DbModels!.faculty.findOne({
        institute: req.body.institute.trim(),
      });
      if (!tempUser) {
        return res
          .status(400)
          .send({ message: `No Such ${req.body.institute} Exist` });
      }
    } else {
      return res
        .status(400)
        .send({ message: `Provide a Valid Authentication` });
    }

    const passwordSame = await compare(
      req.body.password.trim(),
      tempUser.password.trim()
    );

    if (!passwordSame) {
      return res.status(401).send({ message: "Wrong Password" });
    }

    const authUser = {
      _id: tempUser._id,
      institute: tempUser.institute,
    };

    const accessToken = sign(authUser, process.env.JWT_SECRET as Secret);

    res.send({ accessToken });
  } catch (e: any) {
    res.status(500).send({ message: e.message });
  }
};

export default main;
