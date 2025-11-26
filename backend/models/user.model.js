import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
const { Schema } = mongoose;



const userSchema = new mongoose.Schema(
    {
        username:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true,
            index:true
        },
        email:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true,
            
        },
        avatar:{
            type:String,  //cloudinary url
            required:true,


        },
        coverImage:{
            type:String,  //cloudinary url
        },

        watchHistory:{
            type:Schema.Types.ObjectId,
            ref:"Video",
            
        },
        password:{
            type:String,
            required:[ true,"Please provide a password"],
        },
        refereshToken:{
            type:String,
        },

    },{ timestamps:true });


//hash password before saving user

userSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password,10)
    next()
})

// revert back the hashed password and compare with entered password

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password,this.password);

}

// generate jwt access token 

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
        _id: this._id,
        email: this.email,
        username: this.username,
         },
         process.env.ACCESS_TOKEN_SECRET,
         {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY || "15m"
         }
        )
}

// generate jwt refresh token

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
        _id: this._id,
        
         },
         process.env.REFRESH_TOKEN_SECRET,
         {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY || "10d"
         }
        )
}

export const User = mongoose.model("User",userSchema);



// User is stored in mongodb as users
//moongose provide time stamps createdAt and updatedAt