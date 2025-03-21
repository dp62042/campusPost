const express = require('express');
const router = express.Router({mergeParams: true});
const Review = require('../models/review');
const wrapAsync = require('../utils/wrapAsync');
const Post = require("../models/post");
const { isLoggedIn, isReviewAuthor, validateReview } = require('../middlewares');
const controllerReview = require("../controllers/reviews");








// review route
// post 
router.post('/',isLoggedIn, validateReview,wrapAsync(controllerReview.create));

// delete review
router.delete('/:reviewId',isLoggedIn, isReviewAuthor,wrapAsync(controllerReview.delete));


module.exports = router;
