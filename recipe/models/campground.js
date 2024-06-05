const mongoose = require('mongoose');
const { campgroundSchema } = require('../schema');
const Schema = mongoose.Schema;

imageSchema = new Schema({
            url:String,
            filename: String
})
imageSchema.virtual('thumbnail').get(funtion(){
    return this.url.replace('/upload','/upload/w_200')
})
const CampgroundSchema = new Schema({
    title: String,
    images: [imageSchema
    ],
    price: Number,
    description: String,
    location: String,
    author:{
        type: Schema.Types.ObjectId,
        ref: 'user' 
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});

CampgroundSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        });
    }
});

module.exports = mongoose.model('Campground', CampgroundSchema);
