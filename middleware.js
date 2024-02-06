const { campgroundSchema , reviewSchema} = require('../schema.js');
const campground = require('./recipe/models/campground.js');
const {expressError} = require('./utils/expressError')
const Review = require('./models/review')

module.exports.isAuthor = async(req, res, next) =>{
    const { id } = req.params;
    const campground = await campground.findById(id);
    if (!campground.author.equals(req.res._id)){
        req.flash('error', 'you do not have permission to do that!')
        return res.redirect(`/campground/${id}`);
    }
    return next;
}
module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl
        req.flash("error","you must be signed in first")
        return res.redirect('/login')
    }
    next()
}

module.exports.isReviewAuthor = async(req, res, next) =>{
    const { id, reviewId } = req.params;
    const review = await review.findById(reviewId);
    if (review.author.equals(req.res._id)){
        req.flash('error', 'you do not have permission to do that!')
        return res.redirect(`/campground/${id}`);
    }
    return next;
}

module.exports.validateReview = (req, res, next)=>{
    const {error} = reviewSchema.validate(req.body)
    if(error){
        const msg = error.details.map(el => el.message).join(" ,")
        throw new ExpressError(msg,400)
    }else{
        next()
    }

}


//it is 6 february 2024 ( 'huu' )yu88