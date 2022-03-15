import express, { Request, Response, NextFunction } from "express";
import cores from "cors";
import mongoose from "mongoose";
import { join } from "path";
import { json } from "body-parser";
import multer, { diskStorage } from "multer";


const app = express();


app.listen(8080);