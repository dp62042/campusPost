const {postSchema,reviewSchema} = require("./schema");
const ExpressError = require("./utils/ExpressError");
const Review = require("./models/review");




module.exports.validatePost = (req,res,next) => {
    let {error} = postSchema.validate(req.body);
    if(error){
      let errMsg = error.details.map((er )=>er.message).join(',');
      throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

module.exports.isLoggedIn = (req, res, next) => {
  if(!req.isAuthenticated()){
      req.session.redirectUrl = req.originalUrl;
      req.flash('error', "you must be logged in to create post");
      return res.redirect('/login');
  }
  next();
};

module.exports.saveRedirectUrl = (req, res,next) => {
  if(req.session.redirectUrl) {
     res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

module.exports.isReviewAuthor = async(req, res, next) => {
    let {id,reviewId} = req.params;
    let review =await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash('error',"this review do not own by you");
        return res.redirect(`/listings/${id}`);
    }
    next();
}


module.exports.validateReview = (req, res, next) => {
  let {error} = reviewSchema.validate(req.body);
  if(error){
    let errMsg = error.details.map((er )=>er.message).join(',');
    throw new ExpressError(400, errMsg);
  } else {
      next();
  }
}
