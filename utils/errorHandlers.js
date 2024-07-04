export const wrapAsync = (fn) =>{
    return function(req,res,next){
        fn(req,res,next).catch((err)=>next(err));
    }
}

export class ExpressErrors extends Error{
    constructor(status,message){
        super(),
        this.status = status,
        this.message = message
    }
}