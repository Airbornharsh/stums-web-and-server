import { hash } from "bcrypt";
import { DbConnect } from "../../../../Server/config/Db_Config";
import FacultyAuthenticate from "../../../../Server/middleware/FacultyAuthenticate";
import type { NextApiRequest, NextApiResponse } from "next";

const main = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const DbModels = await DbConnect();

    const AuthenticateDetail = (await FacultyAuthenticate(req, res))!;

    if (!req.body.registrationNo) {
      return res
        .status(400)
        .send({ message: `Provide a Valid Authentication` });
    } else if (!req.body.password) {
      return res.status(400).send({ message: `Provide a Password` });
    }

    let tempUser = await DbModels?.studentUser.findOne({
      registrationNo: req.body.registrationNo,
    });

    if (tempUser) {
      return res.status(400).send({ message: "Registration Number Exists!" });
    }

    const hashPassword = await hash(
      req.body.password && req.body.password.trim(),
      10
    );

    const tempFeePayment = {
      1: { isPaid: false, id: "" },
      2: { isPaid: false, id: "" },
      3: { isPaid: false, id: "" },
      4: { isPaid: false, id: "" },
    };

    const tempMessBill = {
      1: { isPaid: false, id: "" },
      2: { isPaid: false, id: "" },
      3: { isPaid: false, id: "" },
      4: { isPaid: false, id: "" },
      5: { isPaid: false, id: "" },
      6: { isPaid: false, id: "" },
      7: { isPaid: false, id: "" },
      8: { isPaid: false, id: "" },
    };

    const newStudentUser = new DbModels!.studentUser({
      name: req.body.name && req.body.name.trim(),
      registrationNo: req.body.registrationNo && req.body.registrationNo.trim(),
      emailId: req.body.emailId && req.body.emailId.trim(),
      institute:
        AuthenticateDetail.institute && AuthenticateDetail.institute.trim(),
      phoneNumber: req.body.phoneNumber && req.body.phoneNumber.trim(),
      dob: req.body.dob && req.body.dob.trim(),
      password: hashPassword,
      feePayments: tempFeePayment,
      messBills: tempMessBill,
    });

    const data = await newStudentUser.save();


    return res.send(data);
  } catch (e: any) {
    res.status(500).send({ message: e.message });
  }
};

export default main;
