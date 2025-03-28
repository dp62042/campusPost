
const express = require('express');
const router = express.Router();
const User = require("../models/user");
const wrapAsync = require('../utils/wrapAsync');
const passport = require('passport');
const { saveRedirectUrl } = require('../middlewares');

router.get('/signup', (req, res) => {
    res.render('users/signup.ejs');
});

router.post('/signup', wrapAsync(async(req, res) => {
    try {
        let {username, email,password} = req.body;
        const newUser = new User({username, email});
        const registerUser=await User.register(newUser,password);
        req.login(registerUser,(err)=>{
            if (err) {
                return next(err);
            }
            req.flash('success',`${username} Welcome to CampusPost!`);
            res.redirect('/posts');  

        })
        
        
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/signup');
    }
   
}));

router.get('/login', (req, res) => {
    res.render('users/login.ejs');
});

router.post("/login", saveRedirectUrl, passport.authenticate("local", {failureRedirect:"/login" , failureFlash: true}), 
    async(req, res) => {
    req.flash("success","Welcome back to CampusPost!");
    let redirectUrl = res.locals.redirectUrl || "/posts";
    res.redirect(redirectUrl);
});


router.get("/logout", (req, res, next) => {
     req.logout((err)=>{
        if(err){
           return next(err);
        }
        req.flash("success","you are logged out!");
        res.redirect("/posts");
     });
});

module.exports =router;