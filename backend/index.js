// require('dotenv').config({path:'./.env'}); 

import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
import { DB_NAME } from "./constants.js";
import connectDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config({ path: "./.env" });


connectDB()
.then(() => {   
    app.listen(process.env.PORT || 5000,() =>{
        console.log(`SERVER is running on PORT ${process.env.PORT || 5000}`);
    })
})
.catch((error) => {
    console.log("ERROR:", error);
    throw error;
});









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