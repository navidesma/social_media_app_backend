import { Schema, model } from "mongoose";

interface User {
  name: string;
  email: string;
  password: string;
  bio: string;
  followers: Schema.Types.ObjectId[];
  following: Schema.Types.ObjectId[];
  profilePicture: string;
  posts: Schema.Types.ObjectId[];
}

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  bio: { type: String  },
  following: [{type: Schema.Types.ObjectId}],
  followers: [{type: Schema.Types.ObjectId}],
  posts: [{ type: Schema.Types.ObjectId, ref: "Post" }],
});

export const User = model<User>("User", userSchema);
