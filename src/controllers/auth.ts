import { RequestHandler } from "express";
import { validationResult } from "express-validator";
import {unlink} from "fs";
import { join } from "path";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { User } from "../models/user";

import { NewError } from "../util/NewError";

export const signup: RequestHandler<
  any,
  any,
  { email: string; name: string; password: string }
> = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      if (req.file?.path) {
        unlink(join(__dirname, "..", "..", req.file?.path), (err) => {if (err) {console.log(err)}else {console.log("file deleted successfully due to validation failure")}})
      }
      const error = new NewError("Validation failed", 422, errors.array());
      throw error;
    }
    const imageUrl = req.file?.path || "";
    const { email, name, password } = req.body;
      const hashedPw = await bcrypt.hash(password, 12);
      const user = new User({
        name,
        email,
        password: hashedPw,
        bio: "",
        profilePicture: imageUrl,
        followers: [],
        following: [],
        posts: [],
      });
      await user.save();
      res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    next(err);
  }
};

export const login: RequestHandler<
  any,
  any,
  { email: string; password: string }
> = async(req, res, next) => {

  const { email, password } = req.body;
  let loadedUser: any;

  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      const error = new NewError(
        "a user with this email could not be found",
        401
      );
      throw error;
    }
    loadedUser = user;
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      const error = new NewError("Wrong password", 401);
      throw error;
    }
    const token = jwt.sign(
      { email: loadedUser.email, userId: loadedUser._id.toString() },
      "jesusPashmak"
    );
    res.status(200).json({ token, userId: loadedUser._id.toString() });
  } catch (err) {
    next(err);
  }
};
