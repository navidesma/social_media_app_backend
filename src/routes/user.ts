import { Router } from "express";
import { body } from "express-validator";

import { getUser, getFollowers, getFollowing  } from "../controllers/user";
import { User } from "../models/user";

import {isAuth} from "../middleware/is-auth";

export const userRoutes = Router();

// userRoutes.post(
//   "/create-user",
//   [
//     body("email")
//       .isEmail().withMessage("Please enter a valid email")
//       .custom((value, { req }) => {
//         return User.findOne({ email: value }).then((userDoc) => {
//           if (userDoc) {
//             return Promise.reject("Email address already has been taken");
//           }
//         });
//       })
//       .normalizeEmail(),
//     body("password").trim().isLength({ min: 8 }),
//     body("name").trim().isLength({ min: 5 }),
//   ],
//   createUser
// );


userRoutes.get("/get-user/:id", isAuth, getUser);

userRoutes.get("/get-followers/:id", isAuth, getFollowers);

userRoutes.get("/get-following/:id", isAuth, getFollowing);
