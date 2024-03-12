import { NextFunction, Request, Response } from "express";
import Jwt, { JwtPayload } from "jsonwebtoken";
import { UsersModel } from "../../components/users/model";

const authenticateMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let token;
    const auth = req.headers.authorization;

    if (auth) {
      token = auth;
    }

    if (!token) {
      return res.status(401).json({ error: "Unauthorized, no token provided" });
    }

    const verified = Jwt.verify(token, process.env.JWT_SECRET!);

    if (!verified) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { id } = verified as JwtPayload;
    const user = await UsersModel.findOne({
      where: { id },
    });

    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    req.user = user.dataValues;
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(500).json({ error });
  }
};

export default authenticateMiddleware;
