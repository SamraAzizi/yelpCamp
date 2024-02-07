
const express = require('express')
const router = express.Router({mergeParams:true});
const {validateReview, isLoggedIn, isReviewAuthor} = require('../middleware')
const reviews = require('../contollers/reviews')
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

router.post('/',isLoggedIn,validateReview, catchAsync(reviews.createReview))



router.delete('/:reviewId' ,isLoggedIn,isReviewAuthor, catchAsync(reviews.deleteReview))

module.exports = router;