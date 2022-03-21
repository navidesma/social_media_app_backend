import { RequestHandler } from "express";
import { validationResult } from "express-validator";
import { User } from "../models/user";

import { NewError } from "../util/NewError";

// export const createUser: RequestHandler<
//   any,
//   any,
//   { email: string; name: string; password: string }
// > = async (req, res, next) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     const error = new NewError("Validation failed", 422, errors);
//     throw error;
//   }
//   const imageUrl = req.file?.path || "";
//   // add name and password validation(using express validator) and hash the password
//   const { email, name, password } = req.body;

//   const user = new User({
//     name,
//     email,
//     password,
//     bio: "",
//     profilePicture: imageUrl,
//     followers: [],
//     following: [],
//     posts: [],
//   });
//   try {
//     await user.save();
//     res.status(201).json({ message: "User created successfully" });
//   } catch (err) {
//     console.log(err);
//     const error = new NewError("Couldn't create user", 422);
//     next(error);
//   }
// };

export const getUser: RequestHandler<{ id: string }> = async (
  req,
  res,
  next
) => {
  if (!req.params.id) {
    res.status(404).json({message: "User doesn't exist"})
    next();
  }
  const id = req.params.id;

  try {
    // trying to return the posts when getting the user
    const user = await User.findById(id).select(["-password"]).populate("posts");
    if (!user) {
      res.status(404).json({message: "User doesn't exist"})
    } else {
      res.status(200).json({user});
    }
  } catch(err) {
    res.status(500).json({message: "Something went wrong"})
    console.log(err);
  }
};

export const getFollowers: RequestHandler<{ id: string }> = async ( req,
  res,
  next
) => {
  if (!req.params.id) {
    res.status(404).json({message: "User doesn't exist"})
    next();
  }
  const id = req.params.id;

  try {
    // return the user with its followers populated
    const user = await User.findById(id).select(["-password"]).populate("followers");
    if (!user) {
      res.status(404).json({message: "User doesn't exist"})
    } else {
      res.status(200).json({user});
    }
  } catch(err) {
    res.status(500).json({message: "Something went wrong"})
    console.log(err);
  }
};
export const getFollowing: RequestHandler<{ id: string }> = async ( req,
  res,
  next
) => {
  if (!req.params.id) {
    res.status(404).json({message: "User doesn't exist"})
    next();
  }
  const id = req.params.id;

  try {
    // return the user with its following populated
    const user = await User.findById(id).select(["-password"]).populate("following");
    if (!user) {
      res.status(404).json({message: "User doesn't exist"})
    } else {
      res.status(200).json({user});
    }
  } catch(err) {
    res.status(500).json({message: "Something went wrong"})
    console.log(err);
  }
};
