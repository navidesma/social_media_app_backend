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
  try {
    if (!req.params.id) {
      const error = new NewError("User doesn't exist", 404);
      throw error;
    }
    const id = req.params.id;

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
    next(err);
  }
};

export const getFollowers: RequestHandler<{ id: string }> = async (
  req,
  res,
  next
) => {
  try {
    if (!req.params.id) {
      const error = new NewError("User doesn't exist", 404);
      throw error;
    }
    const id = req.params.id;

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
    next(err);
  }
};

export const getFollowing: RequestHandler<
  any,
  any,
  { userId: string }
> = async (req, res, next) => {
  const id = req.body.userId;

  try {
    // return the user with its following populated
    const user = await User.findById(id)
      .select(["-password"])
      .populate("following");
    if (!user) {
      const error = new NewError("User doesn't exist", 404);
      throw error;
    } else {
      res.status(200).json({ user });
    }
  } catch (err) {
    next(err);
  }
};

export const getFollowingWithoutDetail: RequestHandler<
  any,
  any,
  { userId: string }
> = async (req, res, next) => {
  const id = req.body.userId;

  try {
    // return the user with its following populated
    const user = await User.findById(id).select(["-password"]);
    if (!user) {
      const error = new NewError("User doesn't exist", 404);
      throw error;
    } else {
      res.status(200).json({ user });
    }
  } catch (err) {
    next(err);
  }
};

export const addToFollowing: RequestHandler<
  any,
  any,
  { userId: string; target: string }
> = async (req, res, next) => {
  try {
    if (!req.body.target) {
      const error = new NewError("Target user is not specified!", 400);
      throw error;
    }
    const { userId, target } = req.body;
    const user = await User.findById(userId);
    const doesAlreadyExist = user?.following.find(
      (userId) => userId.toString() == target
    );
    if (doesAlreadyExist) {
      throw new Error("something went wrong");
    }
    user!.following.push(new mongoose.Types.ObjectId(target));
    await user!.save();

    const targetUser = await User.findById(target);
    targetUser!.followers.push(new mongoose.Types.ObjectId(userId));
    await targetUser!.save();

    res.status(200).json({ message: "User added to following successfully" });
  } catch (err) {
    next(err);
  }
};

export const removeFromFollowing: RequestHandler<
  any,
  any,
  { userId: string; target: string }
> = async (req, res, next) => {
  try {
    if (!req.body.target) {
      const error = new NewError("Target user is not specified!", 400);
      throw error;
    }
    const { userId: mainUserId, target } = req.body;
    // remove the target user from main user followings
    const user = await User.findById(mainUserId);
    const targetIndex = user?.following.findIndex(
      (id) => id.toString() == target
    );
    if (targetIndex === -1) {
      throw new NewError(
        "User doesn't exist in followers to be removed, bad request",
        400
      );
    }
    user?.following.splice(targetIndex as number, 1);
    await user!.save();

    // remove the main user from target user followers
    const targetUser = await User.findById(target);
    const mainUserIndex = targetUser?.followers.findIndex(
      (id) => id.toString() == mainUserId
    );
    if (mainUserIndex === -1) {
      throw new NewError(
        "User doesn't exist in followers to be removed, bad request",
        400
      );
    }
    targetUser?.followers.splice(mainUserIndex as number, 1);
    await targetUser!.save();

    res
      .status(200)
      .json({ message: "Removed user from following successfully" });
  } catch (err) {
    next(err);
  }
};

export const searchUser: RequestHandler<any, any, { target: string }> = async (
  req,
  res,
  next
) => {
  try {
    if (!req.body.target) {
      const error = new NewError("invalid request", 400);
      throw error;
    }
    const users = await User.find({
      name: { $regex: req.body.target.toString(), $options: "i" },
    }).select(["-password"]);
    res.status(200).json({ users });
  } catch (err) {
    next(err);
  }
};
