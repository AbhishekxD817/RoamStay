import mongoose from "mongoose";
import { Schema } from "mongoose";
import passportLocalMongoose from "passport-local-mongoose"

const userSchema = Schema({
    username:{
        type:String
    },
    email:{
        type:String,
        unique:true,
        required:true
    }
})

userSchema.plugin(passportLocalMongoose, {
    usernameField: 'email'
  });


userSchema.methods.verifyPassword = async function(password) {
  try {
    return await this.authenticate(password);
  } catch (err) {
    throw err;
  }
};


export const User = mongoose.model('User',userSchema)


