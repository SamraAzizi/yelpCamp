
const Campground = require('../models/campground');
const Review = require('../models/review');


module.exports.createReview = async(req, res)=>{
    console.log(req.params);
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user_id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success','successfult made a new review')
    res.redirect(`/campground/${campground._id}`);
    
}

module.exports.deleteReview = async(req, res)=>{
    const {id, reviewId} = req.params;
    await Campground.findByIdAndUpdate(id, {$pull :{reviews:reviewId}})
    await Review.findByIdAndDelete(reviewId)
    req.flash('success' ,'successfully deleted review !')
    res.redirect(`/campground/${id}`)

}