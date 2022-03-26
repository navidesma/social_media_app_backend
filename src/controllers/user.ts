import mongoose from "mongoose";
import { RequestHandler } from "express";
import { validationResult } from "express-validator";
import { User } from "../models/user";

import { NewError } from "../util/NewError";

export const getUser: RequestHandler<{ id: string }> = async (
  req,
  res,
  next
) => {
  if (!req.params.id) {
    res.status(404).json({ message: "User doesn't exist" });
    next();
  }
  const id = req.params.id;

  try {
    // trying to return the posts when getting the user
    const user = await User.findById(id)
      .select(["-password"])
      .populate("posts");
    if (!user) {
      res.status(404).json({ message: "User doesn't exist" });
    } else {
      res.status(200).json({ user });
    }
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
    console.log(err);
  }
};

export const getFollowers: RequestHandler<{ id: string }> = async (
  req,
  res,
  next
) => {
  if (!req.params.id) {
    res.status(404).json({ message: "User doesn't exist" });
    next();
  }
  const id = req.params.id;

  try {
    // return the user with its followers populated
    const user = await User.findById(id)
      .select(["-password"])
      .populate("followers");
    if (!user) {
      res.status(404).json({ message: "User doesn't exist" });
    } else {
      res.status(200).json({ user });
    }
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
    console.log(err);
  }
};

export const getFollowing: RequestHandler<{ id: string }> = async (
  req,
  res,
  next
) => {
  if (!req.params.id) {
    res.status(404).json({ message: "User doesn't exist" });
    next();
  }
  const id = req.params.id;

  try {
    // return the user with its following populated
    const user = await User.findById(id)
      .select(["-password"])
      .populate("following");
    if (!user) {
      res.status(404).json({ message: "User doesn't exist" });
    } else {
      res.status(200).json({ user });
    }
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
    console.log(err);
  }
};

export const getFollowingWithoutDetail: RequestHandler<{ id: string }> = async (
  req,
  res,
  next
) => {
  if (!req.params.id) {
    res.status(404).json({ message: "User doesn't exist" });
    next();
  }
  const id = req.params.id;

  try {
    // return the user with its following populated
    const user = await User.findById(id).select(["-password"]);
    if (!user) {
      res.status(404).json({ message: "User doesn't exist" });
    } else {
      res.status(200).json({ user });
    }
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
    console.log(err);
  }
};

export const addToFollowing: RequestHandler<
  any,
  any,
  { userId: string; target: string }
> = async (req, res, next) => {
  if (!req.body.target) {
    const error = new NewError("Target user is not specified!", 400);
    next(error);
  }
  const { userId, target } = req.body;
  try {
    const user = await User.findById(userId);
    const doesAlreadyExist = user?.following.find(
      (userId) => userId.toString() == target
    );
    if (doesAlreadyExist) {
      // res
      //   .status(422)
      //   .json({ message: "User already exist in followers, bad request" });
      throw new Error("something went wrong");
    }
    user!.following.push(new mongoose.Types.ObjectId(target));
    await user!.save();
    res.status(200).json({ message: "User added to following successfully" });
  } catch (err) {
    const error = new NewError("Something went wrong", 500);
    next(error);
  }
};

export const removeFromFollowing: RequestHandler<
  any,
  any,
  { userId: string; target: string }
> = async (req, res, next) => {
  console.log("!!!", req.body)
  if (!req.body.target) {
    const error = new NewError("Target user is not specified!", 400);
    next(error);
  }
  const { userId, target } = req.body;
  try {
    const user = await User.findById(userId);
    const targetIndex = user?.following.findIndex(
      (userId) => userId.toString() == target
    );
    if (targetIndex === -1) {
      throw new Error("something went wrong")
      // res.status(422).json({
      //   message: "User doesn't exist in followers to be removed, bad request",
      // });
    }
    user?.following.splice(targetIndex as number, 1);
    await user!.save();
    res
      .status(200)
      .json({ message: "Removed user from following successfully" });
  } catch (err) {
    const error = new NewError("Something went wrong", 500);
    next(error);
  }
};

export const searchUser: RequestHandler<
  any,
  any,
  { target: string }
> = async (req, res, next) => {
  console.log(req.body.target);
  if (!req.body.target) {
    const error = new NewError("invalid", 400);
    next(error);
  }
  const users = await User.find({name:{'$regex' : (req.body.target).toString(), '$options' : 'i'}}).select(["-password"]);
  res.status(200).json({users});
};
