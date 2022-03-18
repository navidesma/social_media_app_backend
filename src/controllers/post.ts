import { RequestHandler } from "express";
import { validationResult } from "express-validator";
import { Post } from "../models/post";
import { NewError } from "../util/NewError";
import { Types } from "mongoose";

const defaultUser = new Types.ObjectId("6231b27089f80e5d02e2575c");

export const createPost: RequestHandler<
  any,
  any,
  { imageUrl: string; description: string }
> = async (req, res, next) => {
  console.log("!!!!!!!!!!!!!!!!!!!!from createpost");
  if (!req.file) {
    const error = new NewError("image is not provided", 422);
    next(error);
  }

  const imageUrl = req.file?.path;
  console.log("!!!!imageUrl=>", imageUrl);
  let description: string;
  description = req.body.description;
  console.log(description);
  const post = new Post({ description, imageUrl, creator: defaultUser });
  try {
    await post.save();
    res.status(201).json({ message: "post created successfully", post });
  } catch (err) {
    console.log(err);
    const error = new NewError("post creation failed", 422);
    next(error);
  }
};

export const getPosts: RequestHandler = async (req, res, next) => {
  try {
    const posts = await Post.find().sort({ createdAt: "desc" });
    if (!posts) {
      res.status(204).json({message: "No posts found"});
    } else {
      res.status(200).json({posts});
    }
  } catch (err) {
    const error = new NewError("Can't fetch data");
    next(error);
  }
};
