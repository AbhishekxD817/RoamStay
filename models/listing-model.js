import mongoose from "mongoose";
import { Schema } from "mongoose";
const listingSchema = Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    image:{
        url: String,
        name: String
    },
    location:{
        type:String,
        required:true
    },
    country:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    owner:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    createdAt:{
        type:Date,
        default:Date.now()
    }
})

export const Listing = mongoose.model('Listing',listingSchema)