import {ListingSchema, ReviewSchema} from './Schema-joi.js'
import { ExpressErrors } from './errorHandlers.js';

export const validateListings = async (req,res,next) =>{
    const {error} = await ListingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=> el.message).join(',')
        return next(new ExpressErrors(200,errMsg));
    }else{
        return next();
    }
}


export const validateReviews  =  async (req, res, next) =>{
    let {error} = await ReviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=> el.message).join(',');
        return next(new ExpressErrors(200,errMsg));
    }else{

        return next();
    }
}