import { RequestHandler } from "express";
import { validationResult } from "express-validator";
import { Post } from "../models/post";
import { NewError } from "../util/NewError";
import { Types } from "mongoose";
import { User } from "../models/user";
import mongoose from "mongoose";


export const createPost: RequestHandler<
  any,
  any,
  { imageUrl: string; description: string, userId: string }
> = async (req, res, next) => {
  console.log(req.body);
  if (!req.file) {
    const error = new NewError("image is not provided", 422);
    next(error);
  }

  const imageUrl = req.file?.path;
  console.log("!!!!imageUrl=>", imageUrl);
  let description: string;
  description = req.body.description;
  console.log(description);
  const post = new Post({ description, imageUrl, creator: req.body.userId });
  try {
    // save the post
    await post.save();
    // add the new post _id to the user document
    const user = await User.findById(req.body.userId);
    user?.posts.push(post);
    await user?.save();
    // then return the response
    res.status(201).json({ message: "post created successfully", post });
  } catch (err) {
    console.log(err);
    const error = new NewError("post creation failed", 422);
    next(error);
  }
};

export const getPosts: RequestHandler = async (req, res, next) => {
  try {
    const posts = await Post.find().populate("creator").sort({createdAt: "desc"});
    // console.log(posts);
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
