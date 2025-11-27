import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"


//Generate new access and referesh tokens

const generateAccessAndRefereshTokens = async(userId) =>{
try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refereshToken = user.generateRefereshToken();


    //save the referesh token in the data base and give access token to
    //  user so then no need to enter password everytime

    user.refereshToken = refereshToken;
    await user.save({validateBeforeSave: false});

    return {accessToken, refereshToken};
    
} catch (error) {
    throw new ApiError(500,"Something went wrong while generating referesh and access tokens")
    
}
}


// Register the new users

const registerUser = asyncHandler( async(req,res) =>{
    //get user details from frontend
    // validation - not empty
    //check if user already exist: username, email
    // check for images, check for avatar
    //upload them to cloudinary, avatar
    // create user object - create entry in db
    //remove password and referesh token fieldfrom response
    //check for user creation
    //return response

    const {username,email,password} = req.body;
    console.log("email:",email);

    // if(username == ""){
    //     throw new ApiError(400, "username is required")
    // }

    if(
        [username,email,password].some((field) => field?.trim() === "")
    ){
       throw new ApiError(400, "All fields are required") 
    }

    //checking in database

    const existedUser = await User.findOne({
        $or: [{username},{email}]
    })
     

    //check if user is already existed or not

    if(existedUser){
        throw new ApiError(409, "User with email or username already exists")
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    //const coverImageLocalPath = req.files?.coverImage[0]?.path;

    let coverImageLocalPath;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0)
        {coverImageLocalPath = req.files.coverImage[0].path}

     
    //avatar is compulsary so checking for that
    if(!avatarLocalPath)
        {
            throw new ApiError(400,"Avatar file is required")
        }

        //upload both the cover and avatar images to cloudinary

        const avatar = await uploadOnCloudinary(avatarLocalPath)
        const coverImage = await uploadOnCloudinary(coverImageLocalPath)


        //check that avatar is properly uploaded on the database(url) and cloudinary(image)

        if(!avatar){
        throw new ApiError(400,"Avatar file is required")
        }

         
        // Create an object entry of the user in the database

        const user = await User.create({
            username:username.toLowerCase(),
            avatar:avatar.url,
            coverImage: coverImage?.url || "",
            email,
            password,

        })

        const createdUser = await User.findById(user._id).select(
            "-password -refreshToken"
        )

        if(!createdUser){
            throw new ApiError(500,"Something went wrong while registering the user")
        }

        return res.status(201).json(
            new ApiResponse(200, createdUser, "User registered successfully")
        )

})


//Login user

const loginUser = asyncHandler(async (req,res) =>{
//req body ->data
// username or email
// find the user
// password check
// access and referesh token
// send cookie


const {email,username,password} = req.body

if(!(username || email)){
    throw new ApiError(400,"user name or password is required")
}

//finding user in database
const user = await User.findOne({
    $or:[{username},{email}]
})

if(!user){
    throw new ApiError("404","User does not exist")
}

//checking password

const isPasswordValid = await user.isPasswordCorrect(password)

if(!isPasswordValid){
    throw new ApiError("401","Password incorrect")
}

const {accessToken, refereshToken} = await generateAccessAndRefereshTokens(user._id);

//send cookies to the user

const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

const options = {
    httpOnly:true,
    secure:true
}

return res
.status(200)
.cookie("accessToken",accessToken,options)
.cookie("refereshToken",refereshToken,options)
.json(
    new ApiResponse(200,{user: loggedInUser,accessToken,refereshToken},"User logged In successfully")
)


})


//Logout user

const logoutUser = asyncHandler(async(req,res) =>{
await User.findByIdAndUpdate(
    req.user._id,
    {$set:{refereshToken:undefined}},
    {new:true}
)

const options = {
    httpOnly:true,
    secure:true
}

return res
.status(200)
.clearCookie("accessToken", options)
.clearCookie("refereshToken", options)
.json(new ApiResponse(200,{},"User logged Out"))

})




const refereshAccessToken = asyncHandler(async(req,res)=>{
    const incomingRefreshToken = req.cookies.refereshToken || req.body.refereshToken

    if(!incomingRefreshToken){
        throw new ApiError(401,"unauthorized request")
    }


    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
    
        const user = await User.findById(decodedToken?._id);
    
        if(!user){
            throw new ApiError(401,"Invalid referesh token")
        }
    
        if(incomingRefreshToken !== user?.refereshToken){
            throw new ApiError(401,"Referesh Token is expired or used")
        }
    
    
        const options = {
            httpOnly: true,
            secure: true
        }
    
    
        // if referesh token or access token got expired then generate them again
        const {accessToken,newrefereshToken} = await generateAccessAndRefereshTokens(user._id);
    
        return res
        .status(200)
        .cookie("accessToken",accessToken, options)
        .cookie("refereshToken",newrefereshToken,options)
        .json(
            new ApiResponse(200,{accessToken,refereshToken:newrefereshToken},"Access token refreshed")
        );
    
    } catch (error) {
        throw new ApiError(401,error?.message || "Invalid referesh token");
        
    }
})

export {registerUser,loginUser,logoutUser,refereshAccessToken};

