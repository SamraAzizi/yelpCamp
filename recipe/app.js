if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}  

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const catchAsync = require("./utils/catchAsync");
const Joi = require("joi");
const { campgroundSchema, reviewSchema } = require('./schema.js');
const ExpressError =  require("./utils/expressError")
const Campground = require('./models/campground');
const Review = require('./models/review')
const ejsMate = require('ejs-mate')
const session = require('express-session');
const flash = require('connect-flash')
const campgrounds = require('./routes/campgrounds')
const userRoutes = require('.routes/users');
const reviews = require('./routes/reviews')
const passport = require('passport')
const localStrategy = require('passport-local')
const User = require('./models/user');
const { deserialize } = require('v8');


mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp', {
   
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')))

const sessionConfig = {
    secret: 'haseyhus',
    unsave: false,
    saveUninitialized : true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig));
app.use(flash);

app.use(passport.initialize())
app.use(passport.session())
passport.use(new localStrategy(User.authenticate()))


passport.serializeUser(User.serializeUser())
passport.deserializeUser(User, deserializeUser())


app.use((req,res,next)=>{
    res.locals.currentUsers = req.user;
    res.locals.success = req.flash('success');
    res.locals.success = req.flash('error')
    next();
})



app.use('/', userRoutes)
app.use('/campgrounds', campgrounds)
app.use('/campgrounds/:id/reviews', reviews)

app.get('/', (req, res) => {
    res.render('home')
});



app.all("*", (req, res, next) => {
    next(new ExpressError("page not found!", 404));
});

app.use((err, req, res, next) =>{
    const {statusCode = 500} = err;
    if(!err.message) err.message = "oh no something went wrong! "
    res.status(statusCode).render('error',{err})
})

app.listen(3000, () => {
    console.log('Serving on port 3000')
})