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

    const newTempFeePayments: { key: string; isPaid: any; feePayment: any }[] =
      [];

    const feePaymentIds: any[] = [];

    Object.keys(userData.feePayments).forEach((key) => {
      if (
        userData.feePayments[key]["isPaid"] &&
        userData.feePayments[key]["id"]
      ) {
        feePaymentIds.push(userData.feePayments[key]["id"]);
      }
    });

    const tempFeePayment = await DbModels?.feePayment.find({
      _id: feePaymentIds,
    });

    Object.keys(userData.feePayments).forEach((key) =>
      newTempFeePayments.push({
        key: key,
        isPaid:
          tempFeePayment?.find((fee) => fee.year == key) == undefined
            ? false
            : userData.feePayments[key]["isPaid"],
        feePayment:
          tempFeePayment?.find((fee) => fee.year == key) == undefined
            ? {}
            : tempFeePayment?.find((fee) => fee.year == key),
      })
    );

    res.send(newTempFeePayments);
  } catch (e: any) {
    res.status(500).send({ message: e.message });
  }
};

export default main;
