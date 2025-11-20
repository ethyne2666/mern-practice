// require('dotenv').config({path:'./.env'}); 

import dotenv from "dotenv";
import mongoose from "mongoose";
import { DB_NAME } from "./constants.js";
import express from "express";
import connectDB from "./db/index.js";

dotenv.config({ path: "./.env" });

connectDB();




























/*
;(async()=>{
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log("MONGODB CONNECTED");
        app.on("error",(error)=>{
            console.log("ERROR in server setup:",error);
            throw error;
        })

        app.listen(process.env.PORT,()=>{
            console.log(`SERVER is running on PORT ${process.env.PORT}`);
        })
        
    } catch (error) {
        console.log("ERROR:",error)
        throw error;
    }
})()

*/