import { hash } from "bcrypt";
import { DbConnect } from "../../../Server/config/Db_Config";
import type { NextApiRequest, NextApiResponse } from "next";

const main = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const DbModels = await DbConnect();

    if (!req.body.institute) {
      return res
        .status(400)
        .send({ message: `Provide a Valid Authentication` });
    } else if (!req.body.password) {
      return res.status(400).send({ message: `Provide a Password` });
    }

    let tempUser = await DbModels?.faculty.findOne({
      institute: req.body.institute,
    });

    if (tempUser) {
      return res.status(400).send({ message: "Institute Exists!" });
    }

    const hashPassword = await hash(
      req.body.password && req.body.password.trim(),
      10
    );

    const newFaculty = new DbModels!.faculty({
      emailId: req.body.emailId && req.body.emailId.trim(),
      institute: req.body.institute && req.body.institute.trim(),
      phoneNumber: req.body.phoneNumber && req.body.phoneNumber.trim(),
      password: hashPassword,
    });

    const data = await newFaculty.save();

    return res.send(data);
  } catch (e: any) {
    res.status(500).send({ message: e.message });
  }
};

export default main;
