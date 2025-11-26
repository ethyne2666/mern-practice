import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";

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

export {registerUser};

