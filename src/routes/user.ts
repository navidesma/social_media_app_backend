import { Router } from "express";
import { body } from "express-validator";

import { getUser, getFollowers, getFollowing  } from "../controllers/user";
import { User } from "../models/user";

import {isAuth} from "../middleware/is-auth";

export const userRoutes = Router();


userRoutes.get("/get-user/:id", isAuth, getUser);

userRoutes.get("/get-followers/:id", isAuth, getFollowers);

userRoutes.get("/get-following/:id", isAuth, getFollowing);
