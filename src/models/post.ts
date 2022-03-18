import { Schema, model } from "mongoose";

interface Post {
  imageUrl: string;
  description: string;
  creator: Schema.Types.ObjectId;
}

const postSchema = new Schema<Post>(
  {
    imageUrl: { type: String, required: true },
    description: { type: String, required: true },
    creator: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export const Post = model<Post>("Post", postSchema);
