import { Schema, model } from "mongoose";

interface User {
  name: string;
  email: string;
  password: string;
  bio: string;
  followers: object[];
  following: object[];
  profilePicture: string;
  posts: object[];
}

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  bio: { type: String  },
  profilePicture: {type: String},
  following: [{type: Schema.Types.ObjectId, ref: "User"}],
  followers: [{type: Schema.Types.ObjectId, ref: "User"}],
  posts: [{ type: Schema.Types.ObjectId, ref: "Post" }],
});

export const User = model<User>("User", userSchema);
