import { DbConnect } from "../../../Server/config/Db_Config";
import FacultyAuthenticate from "../../../Server/middleware/FacultyAuthenticate";
import type { NextApiRequest, NextApiResponse } from "next";

const main = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const DbModels = await DbConnect();

    const AuthenticateDetail = (await FacultyAuthenticate(req, res))!;

    const userData = await DbModels?.faculty.findById(AuthenticateDetail._id);

    res.send(userData);
  } catch (e: any) {
    res.status(500).send({ message: e.message });
  }
};

export default main;
