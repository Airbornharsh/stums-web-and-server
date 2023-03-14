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

    const newTempMessBill: { key: string; isPaid: any; messBill: any }[] = [];

    const messBillIds: any[] = [];

    Object.keys(userData.messBills).forEach((key) => {
      if (userData.messBills[key]["isPaid"] && userData.messBills[key]["id"]) {
        messBillIds.push(userData.messBills[key]["id"]);
      }
    });

    const tempMessBill = await DbModels?.messBill.find({
      _id: messBillIds,
    });

    Object.keys(userData.messBills).forEach((key) =>
      newTempMessBill.push({
        key: key,
        isPaid:
          tempMessBill?.find((fee) => fee.semester == key) == undefined
            ? false
            : userData.messBills[key]["isPaid"],
        messBill:
          tempMessBill?.find((fee) => fee.semester == key) == undefined
            ? {}
            : tempMessBill?.find((fee) => fee.semester == key),
      })
    );

    res.send(newTempMessBill);
  } catch (e: any) {
    res.status(500).send({ message: e.message });
  }
};

export default main;
