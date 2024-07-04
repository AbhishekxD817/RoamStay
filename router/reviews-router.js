import { Router } from "express";
import { wrapAsync } from "../utils/errorHandlers.js";
import { isUserLoggedIn , isReviewAuthor} from "../middlewares/Auth.js";
import {Review} from '../models/review-model.js'
import { validateReviews } from "../utils/validateSchema.js";
import {limitPosting} from '../middlewares/limit.js'
const reviewsRouter = Router({mergeParams:true});

reviewsRouter.route('/')
.post(isUserLoggedIn,
    limitPosting,
    validateReviews,
    wrapAsync(async(req,res,next)=>{

        let { id } = req.params;
        let { comment , rating } = req.body;
        let newReview = await Review({
            comment,rating,
            author:req.user._id,
            listing: id
        })
        await newReview.save()
        await req.flash('success','Review Added');

        return res.redirect(`/listings/${id}`);

}))


reviewsRouter.route('/:reviewId')
.delete(isUserLoggedIn,
    isReviewAuthor,
    wrapAsync( async ( req, res , next )=>{

        let { id , reviewId } = req.params;
        let deletedReview = await Review.findByIdAndDelete(reviewId);
        await req.flash('success','Review Deleted');

        return res.redirect(`/listings/${id}`);

    })
)




export default reviewsRouter;