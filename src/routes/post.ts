import { Router } from "express";

import { createPost, getPosts } from "../controllers/post";

export const postRoutes = Router();

postRoutes.get("/get-posts", getPosts);

postRoutes.post("/create-posts", createPost)
