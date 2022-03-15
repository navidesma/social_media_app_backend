import { Schema, model } from "mongoose";

interface Post {
  imageUrl: string;
  Description: string;
  creator: object;
}

const postSchema = new Schema<Post>(
  {
    imageUrl: { type: String, required: true },
    Description: { type: String, required: true },
    creator: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export const Post = model<Post>("Post", postSchema);
