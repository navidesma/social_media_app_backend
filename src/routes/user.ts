import { Router } from "express";
import { body } from "express-validator";

import { createUser } from "../controllers/user";
import { User } from "../models/user";

export const userRoutes = Router();

userRoutes.post(
  "/create-user",
  [
    body("email")
      .isEmail()
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