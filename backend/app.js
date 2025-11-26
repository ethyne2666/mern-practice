import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";


const app = express();

//Middelwares
// these are for parsing the body of requests or how we store data from requests

app.use(cors({origin: process.env.CORS_ORIGIN || "http://localhost:5173",credentials:true}));
app.use(express.json({limit: "16kb"}));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));  
app.use(cookieParser());


//Routes import

import userRouter from "./routes/user.routes.js";

//routes declaration

app.use("/api/v1/users",userRouter);

// http://localhost:5000/api/v1/users/register

export {app};