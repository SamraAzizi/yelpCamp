const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;

// Schema for storing image data
const ImageSchema = new Schema({
    url: String,
    filename: String
});

// Virtual for thumbnail image
ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
});

// Main Campground schema
const CampgroundSchema = new Schema({
    title: {
        type: String,
        required: true, // Adding validation for title
    },
    images: [ImageSchema],
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    price: {
        type: Number,
        required: true, // Adding validation for price
    },
    description: {
        type: String,
        required: true, // Adding validation for description
    },
    location: {
        type: String,
        required: true, // Adding validation for location
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true // Ensure author is required
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});

// Middleware to delete reviews when a campground is deleted
CampgroundSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        });
    }
});

// Export the model
module.exports = mongoose.model('Campground', CampgroundSchema);
