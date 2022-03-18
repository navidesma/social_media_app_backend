import { RequestHandler } from "express";
import { validationResult } from "express-validator";
import { User } from "../models/user";

import { NewError } from "../util/NewError";

export const createUser: RequestHandler<
  any,
  any,
  { email: string; name: string; password: string }
> = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new NewError("Validation failed", 422, errors);
    throw error;
  }
  const { email, name, password } = req.body;

  const user = new User({
    name,
    email,
    password,
    bio: "",
    followers: [],
    following: [],
    posts: [],
  });
  try {
    await user.save();
    res.status(201).json({message: "user created successfully"})
  } catch (err) {
    console.log(err);
    const error = new NewError("Couldn't create user");
    next(error)
  }
};
