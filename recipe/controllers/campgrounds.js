const Campground = require('../models/campground');
const axios = require('axios'); // Use axios for making HTTP requests
const { cloudinary } = require("../cloudinary");

module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
};

module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new');
};

module.exports.createCampground = async (req, res, next) => {
    try {
        // LocationIQ Geocoding API
        const { location } = req.body.campground; // Extract location from request body
        const geoResponse = await axios.get(`https://us1.locationiq.com/v1/search.php`, {
            params: {
                key: process.env.LOCATION_IQ_API_KEY, // Use LocationIQ API key
                q: location,
                format: 'json'
            }
        });

        const campground = new Campground(req.body.campground);
        if (geoResponse.data.length > 0) {
            campground.geometry = {
                type: 'Point',
                coordinates: [geoResponse.data[0].lon, geoResponse.data[0].lat] // Set coordinates based on LocationIQ response
            };
        } else {
            // Handle case when no results are found
            req.flash('error', 'Could not find location coordinates. Please try again.');
            return res.redirect('/campgrounds/new');
        }

        campground.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
        campground.author = req.user._id; // Set the author field here
        await campground.save();
        console.log(campground);
        req.flash('success', 'Successfully made a new campground!');
        res.redirect(`/campgrounds/${campground._id}`);
    } catch (error) {
        console.error(error);
        req.flash('error', 'Error creating campground');
        res.redirect('/campgrounds');
    }
};

module.exports.showCampground = async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author'); // Ensure author is populated
    if (!campground) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground });
};

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground });
};

module.exports.updateCampground = async (req, res) => {
    const { id } = req.params;
    console.log(req.body);
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.images.push(...imgs);
    await campground.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } });
    }
    req.flash('success', 'Successfully updated campground!');
    res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted campground');
    res.redirect('/campgrounds');
};
