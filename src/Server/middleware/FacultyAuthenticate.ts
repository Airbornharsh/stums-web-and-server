import { Secret, verify } from "jsonwebtoken";
import type { NextApiRequest, NextApiResponse } from "next";

const Authenticate = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const accessToken = req.headers["authorization"]!.split(" ")[1];

    let tempErr: any;
    let tempUser: any;

    await verify(
      accessToken,
      process.env.JWT_SECRET as Secret,
      (err: any, user: any) => {
        tempErr = err;
        tempUser = user;
      }
    );

    if (tempErr) return res.status(402).send({ message: "Not Authorized" });

    return {
      institute: tempUser.institute.trim(),
      _id: tempUser._id.trim(),
    };
  } catch (e: any) {
    return res.status(500).send({ message: e.message });
  }
};

export default Authenticate;
