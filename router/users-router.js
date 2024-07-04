
import { signup , login, logout } from '../controllers/user-controllers.js'
import { Router } from "express";
import { ExpressErrors, wrapAsync } from '../utils/errorHandlers.js';
import {isUserLoggedIn} from '../middlewares/Auth.js'
import passport from 'passport';
import { User } from '../models/user-model.js';
import { Listing } from '../models/listing-model.js';
import { Review } from '../models/review-model.js';
const usersRouter = Router();







usersRouter.route('/myprofile')
.get(isUserLoggedIn,
   wrapAsync(
    async(req,res,next)=> {
        let userId = req.user._id;
        let user = await User.findById(userId);

        let listings = await Listing.find({owner:userId})
        let reviews = await Review.find({author:userId}).populate('listing')

        if(user){
            return res.render('UserProfile',{user,listings,reviews});

        }else{
            return next(new ExpressErrors(200,'User Not Found'))
        }
    }
   ))








//signup
usersRouter.route('/signup')
.get((req,res)=> res.render('Signup'))
.post(wrapAsync(signup))





//login
usersRouter.route('/login')
.get((req,res)=> res.render('Login'))
.post(passport.authenticate('local',{
        failureFlash:true,
        failureRedirect:'/users/login'
    }),
    login
)




//logout
usersRouter.route('/logout')
.get(logout)


export default usersRouter;