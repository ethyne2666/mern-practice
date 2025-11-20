import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
    productId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product",
    },
    quantity:{
        type:Number,
        required:true,
    }
});

const orderSchema = new mongoose.Schema({
    orderprice:{
        type:Number,
        required:true,
    },
    customer:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
    orderItems:{
        type:[orderItemSchema]
    },
    status:{
        type:String,
        enum:["pending","shipped","delivered","cancelled"],
        default:"pending",
    }
},{timestamps:true});

export const Order = mongoose.model("Order",orderSchema);