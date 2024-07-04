import 'dotenv/config'
import * as path from "path"
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import methodOverride from 'method-override'


// imports
import express from 'express'
import session from 'express-session'
import flash from 'connect-flash'
import MongoStore from 'connect-mongo';
import passport from 'passport';
import LocalStrategy from 'passport-local'


//utils,controllers
import connectDatabase from './utils/database.js'
import { ExpressErrors } from './utils/errorHandlers.js';


//routers , models
import usersRouter from './router/users-router.js'
import listingsRouter from './router/listings-router.js';
import {User} from './models/user-model.js'
import reviewsRouter from './router/reviews-router.js';





const PORT = process.env.SERVER_PORT || 3000;
const sessionOptions = {
    secret: process.env.SECRET_KEY_SESSIONS,
    resave: false,
    saveUninitialized: true,
    store:MongoStore.create({
        mongoUrl:process.env.MONGO_DB_URL,
        collectionName: 'sessions'
    }),
    cookie: { 
        maxAge : 1000 * 60 * 60 * 12
    }
  }






const app = express();

app.listen(PORT,()=>{
    console.log('==> Server Started ==> http://localhost:'+PORT);
    connectDatabase();
})





// set
app.set('view engine','ejs');
app.set("views",path.join(__dirname,"views"));


// middlewares
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(session(sessionOptions))
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
  async function(email, password, done) {
    try {
      const user = await User.findOne({ email: email });

      if (!user) {
        return done(null, false, { message: 'Incorrect email.' });
      }

      const isMatch = await user.verifyPassword(password);
      if (!isMatch.user) {
        return done(null, false, { message: isMatch.error.message });
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req,res,next)=>{
  res.locals.currentUser = req.user;
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success')
  next();
})




// routes

app.
get('/',(req,res)=>{
    res.render('Home');
})


app.use('/users',usersRouter);
app.use('/listings',listingsRouter)
app.use('/listings/:id/reviews',reviewsRouter)












app
.all('*',(req,res,next)=>{
    if(req.method === 'GET'){
        return next(new ExpressErrors(404,'Page Not Found'))
    }else {
        return next(new ExpressErrors(200,'Bad Request'))
    }
})

app.use((err,req,res,next)=>{
    let {status = 500, message = 'Something went wrong'} = err;
    return res.status(status).render('Error',{message});
})