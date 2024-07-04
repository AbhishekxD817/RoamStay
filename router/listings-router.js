import { Router } from "express";
import { isUserLoggedIn , isListingOwner } from "../middlewares/Auth.js";
import { ExpressErrors, wrapAsync } from "../utils/errorHandlers.js";
import { Listing } from "../models/listing-model.js";
import {validateListings} from '../utils/validateSchema.js'
import {limitPosting} from '../middlewares/limit.js'
const listingsRouter= Router();
import multer from "multer";
import {storage} from '../utils/cloudConfig.js'
import { Review } from "../models/review-model.js";
const upload = multer({storage})



listingsRouter.route('/')
.get(wrapAsync(
    async (req,res,next) => {
        let listings = await Listing.find().populate('owner');
        return res.render("Listings",{listings})
    }
))
.post(isUserLoggedIn,
    limitPosting,
    upload.single('image'),
    validateListings,
    wrapAsync( async (req,res,next)=>{

        let {title , description , price , location , country} = await req.body;
        let newListing = await Listing({
            title,description,price,location,country,
            owner: req.user._id,
            image:{
                url:req.file.path,
                name:req.file.originalname
            }
        })
        await newListing.save();
        await req.flash('success','New Listing Added')

        return res.redirect('/listings')

        
    })
)










listingsRouter.route('/new')
.get(isUserLoggedIn,(req,res)=> res.render("AddNewListing"))


listingsRouter.route('/:id')
.get(wrapAsync(async (req,res,next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id).populate('owner');
    let reviews = await Review.find({listing:id}).populate('author')
    return res.render('ShowListing',{listing,reviews})
}))
.patch(isUserLoggedIn,
    isListingOwner,
    upload.single('image'),
    validateListings,
    wrapAsync(async (req, res , next)=>{
        let { id } = req.params;
        let {title,description,price,location,country} = await req.body;
        
        let updateListing = await Listing.findByIdAndUpdate(id,{
            title,description,price,location,country,
            image:{
                url:req.file.path,
                name:req.file.originalname
            }
})
        await updateListing.save();
        return res.redirect(`/listings/${id}`)
}))
.delete(isUserLoggedIn,
    isListingOwner,
    wrapAsync(async(req,res,next)=>{
    let { id } = req.params;
    let deleteListingReviews = await Review.deleteMany({listing:id})
    let deletedListing = await Listing.findByIdAndDelete(id);
    await req.flash('success','New Listing Deleted')

    return res.redirect('/listings')
}))


listingsRouter.route('/:id/edit')
.get(isUserLoggedIn,
    isListingOwner,
    wrapAsync(async(req,res,next)=> {
    let { id } = req.params;
    let listing = await Listing.findById(id);

    if(listing){
        return res.render('EditListing',{listing});
    }else{
        return next(new ExpressErrors(200,'Bad Request'));
    }
}))


export default listingsRouter;