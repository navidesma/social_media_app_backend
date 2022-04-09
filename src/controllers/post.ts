import { RequestHandler } from "express";
import { Post } from "../models/post";
import { NewError } from "../util/NewError";
import { User } from "../models/user";

export const createPost: RequestHandler<
  any,
  any,
  { imageUrl: string; description: string; userId: string }
> = async (req, res, next) => {
  try {
    console.log(req.body);
    if (!req.file) {
      const error = new NewError("image is not provided", 422);
      throw error;
    }
    
    const imageUrl = req.file?.path;
    let description: string;
    description = req.body.description || " ";
    const post = new Post({ description, imageUrl, creator: req.body.userId });
      // save the post
      await post.save();
      // add the new post _id to the user document
      const user = await User.findById(req.body.userId);
      user?.posts.push(post);
      await user?.save();
      res.status(201).json({ message: "post created successfully", post });
  }
  
  catch (err) {
    console.log(err);
    const error = new NewError("post creation failed", 422);
    next(error);
  }
};

export const getPosts: RequestHandler<any, any, { userId: string }> = async (
  req,
  res,
  next
) => {
  let currentPage = 1;
  if (req.get("currentPage")) {
    if (req.get("currentPage") !== "1") {
      currentPage = +req.get("currentPage")!;
    }
  }
  const perPage = 2;
  try {
    // get the user _ids of those who you follow
    const user = await User.findById(req.body.userId);
    // query the posts from you and those you follow and sort them by date and use pagination
    const totalItems = await Post.find({ creator: [req.body.userId, ...(user!.following)] }).countDocuments();
    const posts = await Post.find({ creator: [req.body.userId, ...(user!.following)] })
      .populate("creator")
      .sort({ createdAt: "desc" })
      .skip((+currentPage - 1) * perPage)
      .limit(perPage);
    if (!posts) {
      res.status(204).json({ message: "No posts found" });
    } else {
      res.status(200).json({ posts, totalPages: Math.round(totalItems / perPage) });
    }
  } catch (err) {
    const error = new NewError("Can't fetch data");
    next(error);
  }
};
