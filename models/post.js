const mongoose = require('mongoose');
const Review = require("./review");
const postSchema = new mongoose.Schema({
   title : {
    type : String,
    required : true,
    trim : true
   },

   description : {
    type : String,
    required : true,
    trim : true
   },

   img: {  
    url: { type: String, required: true },  
    filename: { type: String } 
 },

  

   category : {
       type : String,
       required : true,
       trim : true
   },
   reviews : [ {
     type : mongoose.Types.ObjectId,
     ref : 'Review'
   },
],
 owner : {
     type : mongoose.Types.ObjectId,
     ref : 'User',
 }
},
   { timestamps: true }
);

postSchema.virtual("formattedTime").get(function() {
    return this.updatedAt.toISOString().split("T")[1].split(".")[0]; // Extract HH:MM:SS
});

postSchema.post('findOneAndDelete', async(post) => {
    if(post){
      await Review.deleteMany({_id:{$in: post.reviews}});
    }
});

const Post =mongoose.model('Post',postSchema);
module.exports = Post;