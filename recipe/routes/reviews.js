
const express = require('express')
const router = express.Router({mergeParams:true});

const ExpressError =  require("../utils/expressError")
const Campground = require('../models/campground');
const Review = require('../models/review');

const catchAsync = require("../utils/catchAsync");

const { reviewSchema } = require('../schema.js');



const validateReview = (req, res, next)=>{
    const {error} = reviewSchema.validate(req.body)
    if(error){
        const msg = error.details.map(el => el.message).join(" ,")
        throw new ExpressError(msg,400)
    }else{
        next()
    }

}

router.post('/',validateReview, catchAsync(async(req, res)=>{
    console.log(req.params);
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success','successfult made a new review')
    res.redirect(`/campground/${campground._id}`);
    
}))



router.delete('/:reviewId' ,catchAsync(async(req, res)=>{
    const {id, reviewId} = req.params;
    await Campground.findByIdAndUpdate(id, {$pull :{reviews:reviewId}})
    await Review.findByIdAndDelete(reviewId)
    req.flash('success' ,'successfully deleted review !')
    res.redirect(`/campground/${id}`)

}))

module.exports = router;