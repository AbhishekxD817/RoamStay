import { User } from "../models/user-model.js";
import { ExpressErrors } from "../utils/errorHandlers.js";

export const signup = async ( req,res,next) => {
    let {username,email,password } = req.body;
    let userEmailExists = await User.findOne({email});
    let usernameExists = await User.findOne({username});

    if(userEmailExists || usernameExists){
        req.flash('error','User Already Exists');
        return res.redirect('/users/login')
    }

    let newUser = await User({
        username,email
    })
    let savedNewUser = await User.register(newUser,password);

    await req.login(savedNewUser,()=>{
        req.flash('success','Welcome to RoamStay')
        return res.redirect('/listings');
    });
}

export const login = async ( req, res, next) =>{
    req.flash('success','Welcome Back,',req.user.username)
    return res.redirect('/');
}

export const logout = async ( req, res, next ) =>{
    if( req.isAuthenticated()){
        await req.logout(()=>{
            return res.redirect('/')
        });
    }
}