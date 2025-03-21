const express = require('express');
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const {isLoggedIn} = require("../middlewares");
const {validatePost} = require("../middlewares");
const controllerPosts = require("../controllers/posts");
const multer  = require('multer')
const {storage} = require("../cloudconfig");
const upload = multer({ storage })


// get data from user through form
router.get("/new",isLoggedIn, controllerPosts.newForm);

// Search Route (Place this before '/posts/:id')
router.get('/search', wrapAsync(controllerPosts.search));



router.route("/")
.get(wrapAsync(controllerPosts.getAllPosts))
.post(isLoggedIn,upload.single("post[img]"),validatePost, wrapAsync(controllerPosts.createPost));




router.route("/:id")
.get(wrapAsync(controllerPosts.getSinglePost))
.put(isLoggedIn,upload.single("post[img]"),validatePost,wrapAsync(controllerPosts.update))
.delete(isLoggedIn,wrapAsync(controllerPosts.delete));


// edit post 
   // get post data to edit 
   router.get('/:id/edit',isLoggedIn, wrapAsync(controllerPosts.edit));

   
    

   

module.exports = router;