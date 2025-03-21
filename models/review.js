const mongoose = require('mongoose');


const reviewSchema = new mongoose.Schema({
    comment : String,
    rating : {
        type : Number,
        min : 1,
        max : 5,
    },
    author :  {
        type : mongoose.Types.ObjectId,
        ref : "User",

    }

});

const Review = mongoose.model('Review', reviewSchema); 
module.exports = Review;