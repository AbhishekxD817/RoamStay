import { Listing } from "../models/listing-model.js";
import { Review } from "../models/review-model.js";
import { ExpressErrors } from "../utils/errorHandlers.js";


// limiting users to post to save storage from spamming or high costing 
export const limitPosting = async( req, res, next)=>{
    let userId = req.user._id;
    let listingsCount = await Listing.countDocuments({owner:userId})
    let reviewsCount = await Review.countDocuments({author:userId})
    if(listingsCount > 3 || reviewsCount > 5){
        return next(new ExpressErrors(200,'You reached Your Posting Limit'))
    }else{
        next();
    }
}