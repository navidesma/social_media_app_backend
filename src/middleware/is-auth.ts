import { RequestHandler } from "express";

import jwt from "jsonwebtoken";

import { NewError } from "../util/NewError";

export const isAuth: RequestHandler = (
  req: any,
  res,
  next
) => {
  let decodedToken: jwt.JwtPayload | null = null;
  if (req.get("Authorization")) {
    const token = req.get("Authorization")!.split(" ")[1];
    try {
      decodedToken = jwt.verify(token, "jesusPashmak") as jwt.JwtPayload;
    } catch (err: Error | any) {
      err.statsCode = 500;
      throw err;
    }
  }
  if (!decodedToken) {
    const error = new NewError("Not Authenticated", 401);
    throw error;
  }
  req.body.userId = decodedToken.userId;
  next();
};
