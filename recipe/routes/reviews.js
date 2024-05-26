
const express = require('express')
const router = express.Router({mergeParams:true});
const {validateReview, isLoggedIn, isReviewAuthor} = require('../middleware')
const reviews = require('../contollers/reviews')
const ExpressError =  require("../utils/expressError")
const Campground = require('../models/campground');
const Review = require('../models/review');

const catchAsync = require("../utils/catchAsync");

const { reviewSchema } = require('../schema.js');


