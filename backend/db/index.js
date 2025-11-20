import mongoose from "mongoose";
import {DB_NAME} from "../constants.js";
import dotenv from "dotenv";

const connectDB = async()=>{
    try {
       const connectInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
         console.log(`MONGODB CONNECTED!! : ${connectInstance.connection.host}`);
    } catch (error) {
        console.log("ERROR in DB CONNECTION:",error);
        process.exit(1);
    }
}

export default connectDB;