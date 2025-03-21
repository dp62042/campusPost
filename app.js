// require necessary modules
if(process.env.NODE_ENV != 'production'){
  require('dotenv').config();
}

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');


// import routes
const postRoutes = require('./routes/post');
const userRoutes = require('./routes/user');
const reviewRoutes = require('./routes/review');
const { configDotenv } = require('dotenv');

// server port
const PORT = 8080;
const dbUrl = process.env.MONGO_URI;

// mongo session

const store = MongoStore.create({
  mongoUrl : dbUrl,
  crypto : {
    secret : process.env.SECRET,
  },
  touchAfter : 24*3600

});

store.on("error", ()=>{
  console.log("mongo-session error:", err);
})


// session
const sessionOptions = {
  store,
  secret : process.env.SECRET,
  resave : false,
  saveUninitialized : true,
  cookie : {
      expires: Date.now() + 7 *24*60*60*1000,
      maxAge:  7 *24*60*60*1000,
      httpOnly : true
  }
};



// middleware 
app.use(express.static(path.join(__dirname, '/public')));
app.use(express.urlencoded({ extended: true }));
app.engine('ejs', ejsMate);
app.use(methodOverride('_method'));
app.use(express.static("public")); // Serve static files from the "public" folder


// view engine set
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// mongodb connections 

main().then(()=>{
  console.log("Connected to DB");
}).catch((err)=>{
    console.log("Error connecting to DB: " + err);
});
async function main(){
    await mongoose.connect(dbUrl);
}


//home page
app.get('/', (req, res) => {
    res.redirect('/posts');
});


app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.currUser = req.user;
  next();
});



// routes connections
app.use('/posts', postRoutes);
app.use('/posts/:id/reviews',reviewRoutes);
app.use("/", userRoutes);



// 404 page not found
app.all('*', (req, res) => {
  res.render('notfound');
});



// global err handler
app.use((err, req, res, next) => {
  let {statusCode=505, message="something went wrong!"} = err;
  res.render('error', {err} );
});

// Start Server
app.listen(PORT, () => {
  console.log(`server running on http://localhost:${PORT}`);
});