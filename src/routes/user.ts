import { Router } from "express";

import { getUser, getFollowers, getFollowing, getFollowingWithoutDetail, addToFollowing, removeFromFollowing  } from "../controllers/user";

import {isAuth} from "../middleware/is-auth";

export const userRoutes = Router();


userRoutes.get("/get-user/:id", isAuth, getUser);

userRoutes.get("/get-followers/:id", isAuth, getFollowers);

userRoutes.get("/get-following/:id", isAuth, getFollowing);

userRoutes.get("/get-following-no-detail/:id", isAuth, getFollowingWithoutDetail);

userRoutes.put("/add-following", isAuth, addToFollowing);

userRoutes.delete("/remove-following", isAuth, removeFromFollowing);
