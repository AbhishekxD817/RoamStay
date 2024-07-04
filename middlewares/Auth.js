import { Listing } from "../models/listing-model.js";
import { Review } from "../models/review-model.js";
import { ExpressErrors } from "../utils/errorHandlers.js";


export const isUserLoggedIn = async (req, res, next) => {
    let userLoggedIn = await req.isAuthenticated();
    if(userLoggedIn){
        return next()
    }else{
        await req.flash('error','Please Login To Continue')
        return res.redirect('/users/login')
    }
}


export const isListingOwner = async ( req , res , next) =>{
    let { id } = await req.params;
    let listing = await Listing.findById(id);

    if (listing && req.user && listing.owner._id.equals(req.user._id)){
        return next();
    } else {
        return next(new ExpressErrors(200,'Permissions Denied'));
    }
}

export const isReviewAuthor = async ( req, res, next ) =>{
    let {id , reviewId } = req.params;
    let review = await Review.findById(reviewId).populate('author');
    
    if(review.author._id.equals(req.user._id)){
        return next();
    }else{
        return next(new ExpressErrors(200,'Permissions Denied'));
    }

}