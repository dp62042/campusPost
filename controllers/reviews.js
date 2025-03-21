const Review = require('../models/review');
const Post = require("../models/post");

module.exports.create = async(req,res)=>{
      let post = await Post.findById(req.params.id);
      let newReview = new Review(req.body.review);
      newReview.author = req.user._id;
      post.reviews.push(newReview);

      await newReview.save();
      await post.save();
      req.flash('success','New Review Created Successfully!');
      res.redirect(`/posts/${post._id}`)
}


module.exports.delete = async(req,res)=>{
    let {id, reviewId} = req.params;
    const deletePost= await Post.findByIdAndUpdate(id,{$pull:{reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success','Review deleted Successfully!');
    res.redirect(`/posts/${id}`);
 
 }