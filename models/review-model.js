import mongoose from "mongoose";
import { Schema } from "mongoose";

const reviewSchema = Schema({
    author:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    listing:{
        type:Schema.Types.ObjectId,
        ref:'Listing'
    },
    comment:{
        type:String,
        required:true
    },
    rating:{
        type:Number,
        required:true,
        min:1,
        max:5,
        default:1
    },
    createdAt:{
        type:Date,
        default:Date.now()
    }
})


export const Review = mongoose.model('Review',reviewSchema)