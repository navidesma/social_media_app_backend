import { Router } from "express";
import { body } from "express-validator";

import { User } from "../models/user";

import { signup, login } from "../controllers/auth";

export const authRoutes = Router();

authRoutes.put("/signup", [
  body("email")
    .isEmail()
    .withMessage("Please enter a valid email")
    .custom((value, { req }) => {
      return User.findOne({email: value}).then(userDoc => {
        if (userDoc) {
          return Promise.reject("Email address already taken");
        }
      });
    }).normalizeEmail({"gmail_remove_dots": false}),
    body("password").trim().isLength({min: 8}),
    body("name").trim().isLength({min: 5}),
], signup);

authRoutes.post("/login", login);
