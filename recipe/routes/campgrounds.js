const express = require('express')
const router = express.Router();
const campgrounds = require('../controllers/campgrounds')
const catchAsync = require("../utils/catchAsync");
const { campgroundSchema } = require('../schema.js');
const ExpressError =  require("../utils/expressError")
const Campground = require('../models/campground');
const{isLoggedIn} = require('../middleware');
const campground = require('../models/campground');
const { updateCampground } = require('../../controllers/campgrounds.js');
const multer = require('multer')
const upload = multer( storage )
const {storage} = require('../cloudinary')
const validateCampground = (req,res,next) =>{
    const{error} = campgroundSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(" ,")
        throw new ExpressError(msg,400)
    }else{
        next()
    }
}

router.route('/')
    .get(catchAsync(campgrounds.index));
router.get('/new',isLoggedIn, campgrounds.renderNewForm)
    .post(upload.single('image'),(req,res) => {
        res.send(req.body, req.file);
        res.send("It worked!!")
    })


router.route('/:id')
    .get(catchAsync(campground.showCampground))
    .put(isLoggedIn,validateCampground, catchAsync(campgrounds.updateCampground))
    .delete(isLoggedIn,isAuthor, catchAsync(campgrounds.deleteCampground))



    .post(isLoggedIn, validateCampground,catchAsync(async(campground.createCampgrounds)
    // if(!req.body.campground) throw new ExpressError("Invalid campground data!",400);
    


    
  ))


module.exports = router