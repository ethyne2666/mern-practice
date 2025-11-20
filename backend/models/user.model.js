import mongoose from "mongoose";

const userScheme = new mongoose.Schema(
    {
        username:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
        },
        email:{
            type:String,
            required:true,
            unique:true,
        },
        password:{
            type:String,
            required:[ true,"Please provide a password"],
        }

    },{ timestamps:true });



export const User = mongoose.model("User",userScheme);



// User is stored in mongodb as users
//moongose provide time stamps createdAt and updatedAt