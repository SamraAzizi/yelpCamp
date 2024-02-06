

const campground = require('../models/campground')
module.exportsindex = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds })
}

module.exports.rendrNewForm = (req, res) =>{
    res.render('campgrounds/new')
}

module.exports.createCampground = async (req, res, next) =>{
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    await campground.save();
    req.flash("success", "successfully made a new campground!");
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.showCampground = async (req, res,) => {
    const campground = await Campground.findById(req.params.id).populate({path:"reviews"}).populate('author')
    console.log(campground)
    if(!campground){
        req.flash('error','cannot find that campground');
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', { campground });
};

router.get('/:id/edit', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    if(!campground){
        req.flash('error','cannot find that campground');
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', { campground });
}))

module.exports.renderEditForm = async (req, res) =>{
    const { id } = req.params;
    const campground = await Campground.findById(id)
    if(!campground){
        req.flash('error', 'can not find that campground!');
        return res.redirect('/campgrounds/edit', { campground})
    }  
    res.render('campgrounds/edit', {campground});
}

module.exports.updateCampground = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    req.flash('success','successfully updated campground')
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.deleteCampground = async(req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success' ,'successfully deleted campground !')
    res.redirect('/campgrounds');
}