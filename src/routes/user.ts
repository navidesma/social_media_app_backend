import { Router } from "express";
import { body } from "express-validator";

import { createUser, getUser, getFollowers, getFollowing  } from "../controllers/user";
import { User } from "../models/user";

export const userRoutes = Router();

userRoutes.post(
  "/create-user",
  [
    body("email")
      .isEmail().withMessage("Please enter a valid email")
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject("Email address already has been taken");
          }
        });
      })
      .normalizeEmail(),
    body("password").trim().isLength({ min: 8 }),
    body("name").trim().isLength({ min: 5 }),
  ],
  createUser
);


userRoutes.get("/get-user/:id", getUser);

userRoutes.get("/get-followers/:id", getFollowers);

userRoutes.get("/get-following/:id", getFollowing);
