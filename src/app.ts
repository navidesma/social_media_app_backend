import express, { Request, Response, NextFunction } from "express";
import cores from "cors";
import mongoose from "mongoose";
import { join } from "path";
import { json } from "body-parser";
import multer, { diskStorage } from "multer";

import { postRoutes } from "./routes/post";
import { userRoutes } from "./routes/user";
import { NewError } from "./util/NewError";
import { authRoutes } from "./routes/auth";

const app = express();

const fileStorage = diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString().replace(/:/g, '-') + "_" + file.originalname);
  },
});

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(json());

app.use(multer({storage: fileStorage, fileFilter: fileFilter}).single("image"))

app.use("/images", express.static(join(__dirname, "..", "images")));
app.use(express.static(join(__dirname, "..", "client", "build")));


app.use(cores());

app.use("/post", postRoutes);
app.use("/user", userRoutes);
app.use("/auth", authRoutes);

app.use("*", (req: Request, res: Response, next: NextFunction) => {
  res.sendFile(join(__dirname, "../client/build/index.html"))
  next()
})

app.use((error: NewError, req: Request, res: Response, next: NextFunction) => {
  const { statusCode, message } = error;
  const data = error.data || null;
  console.log(error);
  res.status(statusCode || 500).json({ message: message || "Something went wrong", data });
});

const connectToDb = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/instagram");
  } catch (err) {
    console.log(err);
  }
};
connectToDb();
app.listen(8080, "127.0.0.1");
// Developed By Navid Esma 
// github.com/navidesma
