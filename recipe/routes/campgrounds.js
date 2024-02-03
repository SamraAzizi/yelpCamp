const express = require('express')
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const { campgroundSchema } = require('../schema.js');
const ExpressError =  require("../utils/expressError")
const Campground = require('../models/campground');

const{isLoggedIn} = require('../middleware')

const validateCampground = (req,res,next) =>{
    const{error} = campgroundSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(" ,")
        throw new ExpressError(msg,400)
    }else{
        next()
    }
}


router.get('/', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds })
}));
router.get('/new',isLoggedIn, (req, res) => {
   
    res.render('campgrounds/new');
})

router.post('/',validateCampground,catchAsync(async(req, res, next) => {
    // if(!req.body.campground) throw new ExpressError("Invalid campground data!",400);
    

    
    const campground = new Campground(req.body.campground);
    await campground.save();
    req.flash("successfully made a new campground!");
    res.redirect(`/campgrounds/${campground._id}`)
    
}))

router.get('/:id',isLoggedIn,async (req, res,) => {
    const campground = await Campground.findById(req.params.id).populate("reviews").populate('author')
    console.log(campground)
    if(!campground){
        req.flash('error','cannot find that campground');
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', { campground });
});

router.get('/:id/edit', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    if(!campground){
        req.flash('error','cannot find that campground');
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', { campground });
}))

router.put('/:id',isLoggedIn,validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    req.flash('success','successfully updated campground')
    res.redirect(`/campgrounds/${campground._id}`)
}));

router.delete('/:id',isLoggedIn, async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success' ,'successfully deleted campground !')
    res.redirect('/campgrounds');
});

module.exports = router