import { Router } from "express";

import { createPost, getPosts } from "../controllers/post";

import {isAuth} from "../middleware/is-auth";


export const postRoutes = Router();

postRoutes.get("/get-posts", isAuth, getPosts);

postRoutes.post("/create-posts", isAuth, createPost);

