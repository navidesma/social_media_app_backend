import { RequestHandler } from "express";

import jwt from "jsonwebtoken";

import { NewError } from "../util/NewError";

export const isAuth: RequestHandler = (req: any, res, next) => {
  let decodedToken: jwt.JwtPayload | null = null;
  try {
    if (req.get("Authorization")) {
      const token = req.get("Authorization")!.split(" ")[1];
      decodedToken = jwt.verify(token, "jesusPashmak") as jwt.JwtPayload;
    } else {
      throw new Error("No Authorization key in header was provided");
    }
    if (!decodedToken) {
      throw new NewError("Not Authenticated", 401);
    }
    req.body.userId = decodedToken!.userId;
    next();
  } catch (err) {
    res.status(401).json({ message: "Not Authenticated", data: err });
  }
};
