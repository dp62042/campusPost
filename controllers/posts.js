const Post = require("../models/post");



module.exports.newForm =  (req, res)=>{
    res.render("post/new");
   }


module.exports.search = async (req, res) => {
    try {
        let { query } = req.query;

        if (!query) {
            return res.redirect('/posts'); 
        }

        const posts = await Post.find({
            $or: [
                { title: { $regex: new RegExp(query, 'i') } },
                { category: { $regex: new RegExp(query, 'i') } }
            ]
        });

        res.render('post/index', { posts }); // Render search results in index.ejs
    } catch (err) {
        console.error(err);
        res.status(500).send("Something went wrong");
    }
}


module.exports.getAllPosts = async(req, res) =>{
    try {
        const posts =await Post.find({});
        res.status(200).render("post/index", {posts}); 
    } catch (error) {
        console.log("Error fetching data: " + error);
        res.status(500).json({message:"Internal Server Error"});
    }
   
}

module.exports.createPost = async(req, res)=>{
    let url = req.file.path;
    let filename = req.file.filename;
    const newPost = new Post(req.body.post);
    newPost.owner = req.user._id;
    newPost.img = {url, filename};
    await newPost.save();
    req.flash('success','New Post Created successfully!');
    res.redirect('/posts');  

}

module.exports.getSinglePost = async(req, res)=>{
    let {id} = req.params;
    const post = await Post.findById(id).populate({path:"reviews", populate:{path:"author"}}).populate('owner');
    if(!post) {
      req.flash('error',"post you requested for does not exist!");
      res.redirect('/posts');
    }
    res.render('post/show', {post});
 }


 module.exports.edit = async(req, res)=>{
        let {id} = req.params;
        const post = await Post.findById(id);
        res.render('post/edit', {post});
    }

module.exports.update = async(req, res)=>{
      let {id} = req.params;
      let newPost = await Post.findByIdAndUpdate(id, {...req.body.post});
      if(typeof(req.file) !== "undefined"){
        let filename = req.file.filename;
        let url = req.file.path;
        newPost.img = {url, filename};
        await newPost.save();
      }
      req.flash('success','post updated successfully!');
      res.redirect(`/posts/${id}`);
   }

module.exports.delete = async(req, res)=>{
    let {id} = req.params;
    await Post.findByIdAndDelete(id);
    req.flash('success','post delete successfully!');
    res.redirect(`/posts`);
   }